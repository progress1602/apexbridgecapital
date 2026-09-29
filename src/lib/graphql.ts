export const GRAPHQL_ENDPOINT = 'https://apex-backend-lti2.onrender.com/graphql';

export interface GraphQLUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  tier?: string;
  avatar?: string;
  balance: number;
  phone?: string;
  is2FAEnabled?: boolean;
  currencyPreference?: string;
  notifications?: {
    email: boolean;
    sms: boolean;
    yieldAlerts: boolean;
  };
  createdAt?: string;
}

export interface GraphQLWalletSummary {
  totalPortfolio: number;
  availableBalance: number;
  activeInvestments: number;
  totalEarnings: number;
  growth24h: number;
  currency: string;
}

export interface GraphQLChartPoint {
  timestamp: string;
  value: number;
}

export interface GraphQLMarketTicker {
  symbol: string;
  price: number;
  change24h: number;
}

export interface GraphQLDepositMethod {
  id: string;
  name: string;
  network: string;
  address: string;
  minDeposit: number;
  confirmationsRequired: number;
}

export interface GraphQLInvestmentPlan {
  id: string;
  name: string;
  roi: string;
  durationDays: number;
  minAmount: number;
  maxAmount: number;
  feeRate: number;
  status: string;
}

export interface GraphQLUserInvestment {
  id: string;
  planName: string;
  amount: number;
  roi: string;
  progress: number;
  projectedReturn: number;
  status: string;
  startDate: string;
  maturityDate: string;
}

export interface GraphQLTransaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  plan?: string | null;
  method?: string | null;
  date?: string | null;
  receiptImage?: string | null;
  createdAt?: string | null;
}

export interface GraphQLNotification {
  id: string;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;
  createdAt?: string;
}

export function getStoredToken(): string | null {
  const rawToken = localStorage.getItem('apexbridge_token');
  if (!rawToken || rawToken === 'undefined' || rawToken === 'null') {
    return null;
  }
  const clean = rawToken.trim().replace(/^["']|["']$/g, '');
  if (!clean || clean === 'undefined' || clean === 'null') {
    return null;
  }
  return clean.startsWith('Bearer ') ? clean.slice(7).trim() : clean;
}

export async function fetchGraphQL<T = any>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const makeRequest = () => fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  let response: Response;
  try {
    response = await makeRequest();
  } catch (networkErr: any) {
    // If the server was sleeping (Render cold start) or had a temporary connection blip, retry once
    console.warn('[GraphQL Network Notice]: Initial connection attempt failed, retrying in 1.5s...', networkErr);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      response = await makeRequest();
    } catch (retryErr: any) {
      console.error('[GraphQL Network Error]: Failed to reach backend endpoint:', GRAPHQL_ENDPOINT, retryErr);
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    }
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      if (errJson.errors && Array.isArray(errJson.errors) && errJson.errors.length > 0) {
        errorDetail = errJson.errors.map((e: any) => e.message || JSON.stringify(e)).join(' | ');
      } else if (errJson.message) {
        errorDetail = errJson.message;
      } else if (errJson.error) {
        errorDetail = typeof errJson.error === 'string' ? errJson.error : JSON.stringify(errJson.error);
      }
    } catch {
      // ignore text parse error
    }

    const fullErrMsg = errorDetail || `HTTP ${response.status}: ${response.statusText}`;
    console.error(`[GraphQL Backend HTTP ${response.status} Error]:`, fullErrMsg);

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('apexbridge:unauthorized'));
      }
      throw new Error(errorDetail || 'Your session has expired or is unauthorized. Please log in again.');
    }

    if (response.status === 502 || response.status === 503 || response.status === 504) {
      throw new Error('The server is temporarily warming up or busy. Please wait a moment and try again.');
    }

    throw new Error(errorDetail || 'Server encountered an issue processing your request. Please try again.');
  }

  let json: any;
  try {
    json = await response.json();
  } catch (parseErr: any) {
    console.error('[GraphQL JSON Parse Error]: Backend did not return valid JSON:', parseErr);
    throw new Error('Received an unexpected response from the server. Please try again.');
  }

  if (json.errors && Array.isArray(json.errors) && json.errors.length > 0) {
    console.error('[GraphQL Backend Errors]:', json.errors);
    const errorMsg = json.errors.map((e: any) => e.message || 'GraphQL operation failed').join(' | ');
    const isAuthError = errorMsg.toLowerCase().includes('unauthorized') || 
                        errorMsg.toLowerCase().includes('invalid token') ||
                        errorMsg.toLowerCase().includes('token expired');
    if (isAuthError && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('apexbridge:unauthorized', { detail: { message: errorMsg } }));
    }
    throw new Error(errorMsg);
  }

  return json.data;
}

// ----------------- QUERIES -----------------

export const ME_QUERY = `
query GetMe {
  me {
    id
    name
    email
    role
    tier
    avatar
    balance
    phone
    is2FAEnabled
    currencyPreference
    createdAt
  }
}
`;

export const USER_PROFILE_QUERY = `
query GetUserProfile {
  userProfile {
    id
    name
    email
    role
    tier
    avatar
    balance
    phone
    is2FAEnabled
    currencyPreference
    createdAt
  }
}
`;

export const ACCOUNT_STATE_QUERY = `
query GetAccountState {
  me {
    id
    name
    email
    role
    tier
    avatar
    balance
    phone
    is2FAEnabled
    currencyPreference
    createdAt
  }
  walletSummary {
    totalPortfolio
    availableBalance
    activeInvestments
    totalEarnings
    growth24h
    currency
  }
}
`;

export interface GraphQLAccountState {
  user: GraphQLUser | null;
  walletSummary: GraphQLWalletSummary | null;
}

export async function apiGetAccountState(): Promise<GraphQLAccountState> {
  let user: GraphQLUser | null = null;
  let walletSummary: GraphQLWalletSummary | null = null;

  try {
    const data = await fetchGraphQL<{ me?: GraphQLUser; walletSummary?: GraphQLWalletSummary }>(ACCOUNT_STATE_QUERY);
    if (data?.me) {
      user = data.me;
    }
    if (data?.walletSummary) {
      walletSummary = data.walletSummary;
    }
  } catch (err) {
    console.warn('apiGetAccountState combined query notice:', err);
  }

  // If user wasn't fetched, try separate fallbacks
  if (!user) {
    user = await apiGetMe();
  }
  if (!walletSummary) {
    walletSummary = await apiGetWalletSummary();
  }

  return { user, walletSummary };
}

export async function apiGetMe(): Promise<GraphQLUser | null> {
  try {
    const data = await fetchGraphQL<{ me?: GraphQLUser }>(ME_QUERY);
    if (data?.me && data.me.id) {
      return data.me;
    }
  } catch (err) {
    console.warn('apiGetMe query notice, trying userProfile fallback:', err);
  }

  try {
    const fallback = await fetchGraphQL<{ userProfile?: GraphQLUser }>(USER_PROFILE_QUERY);
    if (fallback?.userProfile && fallback.userProfile.id) {
      return fallback.userProfile;
    }
  } catch (err2) {
    console.warn('userProfile fallback also failed:', err2);
  }

  return null;
}

export const WALLET_SUMMARY_QUERY = `
query WalletSummary {
  walletSummary {
    totalPortfolio
    availableBalance
    activeInvestments
    totalEarnings
    growth24h
    currency
  }
}
`;

export async function apiGetWalletSummary(): Promise<GraphQLWalletSummary | null> {
  try {
    const data = await fetchGraphQL<{ walletSummary: GraphQLWalletSummary }>(WALLET_SUMMARY_QUERY);
    return data?.walletSummary || null;
  } catch (err) {
    console.warn('apiGetWalletSummary notice:', err);
    return null;
  }
}

export const ANALYTICS_CHART_QUERY = `
query AnalyticsChart {
  analyticsChart {
    timestamp
    value
  }
}
`;

export async function apiGetAnalyticsChart(): Promise<GraphQLChartPoint[]> {
  const data = await fetchGraphQL<{ analyticsChart: GraphQLChartPoint[] }>(ANALYTICS_CHART_QUERY);
  return data.analyticsChart || [];
}

export const MARKET_TICKERS_QUERY = `
query MarketTickers {
  marketTickers {
    symbol
    price
    change24h
  }
}
`;

export async function apiGetMarketTickers(): Promise<GraphQLMarketTicker[]> {
  const data = await fetchGraphQL<{ marketTickers: GraphQLMarketTicker[] }>(MARKET_TICKERS_QUERY);
  return data.marketTickers || [];
}

export const DEPOSIT_METHODS_QUERY = `
query DepositMethods {
  depositMethods {
    id
    name
    network
    address
    minDeposit
    confirmationsRequired
  }
}
`;

export const DEFAULT_DEPOSIT_METHODS: GraphQLDepositMethod[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    network: 'Bitcoin Core Network (BTC)',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    minDeposit: 50,
    confirmationsRequired: 3,
  },
  {
    id: 'eth',
    name: 'Ethereum',
    network: 'Ethereum Mainnet (ERC-20)',
    address: '0x71C83602d28C91350a41A0B669865B88812c25e2',
    minDeposit: 50,
    confirmationsRequired: 12,
  },
];

export async function apiGetDepositMethods(): Promise<GraphQLDepositMethod[]> {
  try {
    const data = await fetchGraphQL<{ depositMethods: GraphQLDepositMethod[] }>(DEPOSIT_METHODS_QUERY);
    const rawMethods = data?.depositMethods || [];
    
    // Exclude Solana and Tether USDT; leave only Bitcoin and Ethereum
    const allowed = rawMethods.filter((m) => {
      const id = (m.id || '').toLowerCase();
      const name = (m.name || '').toLowerCase();
      const isSolana = id.includes('sol') || name.includes('solana');
      const isUsdt = id.includes('usdt') || name.includes('tether') || name.includes('usdt');
      if (isSolana || isUsdt) return false;
      return id.includes('btc') || id.includes('eth') || name.includes('bitcoin') || name.includes('ethereum');
    });

    if (allowed.length > 0) {
      return allowed;
    }
  } catch (err) {
    console.warn('Backend deposit methods query failed, using standard BTC & ETH channels:', err);
  }

  return DEFAULT_DEPOSIT_METHODS;
}

export const DEFAULT_INVESTMENT_PLANS: GraphQLInvestmentPlan[] = [
  {
    id: 'starter',
    name: 'Apex Starter Tier',
    roi: '15%',
    durationDays: 7,
    minAmount: 500,
    maxAmount: 4999,
    feeRate: 0.1,
    status: 'active',
  },
  {
    id: 'vault',
    name: 'Quantum Yield Vault',
    roi: '35%',
    durationDays: 14,
    minAmount: 5000,
    maxAmount: 24999,
    feeRate: 0.1,
    status: 'active',
  },
  {
    id: 'institutional',
    name: 'Sovereign Institutional Core',
    roi: '75%',
    durationDays: 30,
    minAmount: 25000,
    maxAmount: 1000000,
    feeRate: 0.1,
    status: 'active',
  },
];

export const INVESTMENT_PLANS_QUERY = `
query InvestmentPlans {
  investmentPlans {
    id
    name
    roi
    durationDays
    minAmount
    maxAmount
    feeRate
    status
  }
}
`;

export async function apiGetInvestmentPlans(): Promise<GraphQLInvestmentPlan[]> {
  try {
    const data = await fetchGraphQL<{ investmentPlans: GraphQLInvestmentPlan[] }>(INVESTMENT_PLANS_QUERY);
    if (data && data.investmentPlans && data.investmentPlans.length > 0) {
      return data.investmentPlans;
    }
  } catch (err) {
    console.warn('Error querying GraphQL investment plans:', err);
  }
  return DEFAULT_INVESTMENT_PLANS;
}

export const USER_INVESTMENTS_QUERY = `
query UserInvestments {
  userInvestments {
    id
    planName
    amount
    roi
    progress
    projectedReturn
    status
    startDate
    maturityDate
  }
}
`;

export async function apiGetUserInvestments(): Promise<GraphQLUserInvestment[]> {
  try {
    const data = await fetchGraphQL<{ userInvestments: GraphQLUserInvestment[] }>(USER_INVESTMENTS_QUERY);
    if (data && Array.isArray(data.userInvestments)) {
      return data.userInvestments;
    }
  } catch (err: any) {
    console.warn('apiGetUserInvestments query error:', err?.message || err);
  }
  return [];
}

export const TRANSACTIONS_QUERY = `
query Transactions($type: String, $status: String, $page: Int, $limit: Int) {
  transactions(type: $type, status: $status, page: $page, limit: $limit) {
    id
    type
    amount
    status
    plan
    receiptImage
    date
  }
}
`;

export interface TransactionFilterParams {
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function apiGetTransactions(params: TransactionFilterParams = {}): Promise<GraphQLTransaction[]> {
  const variables = {
    type: params.type && params.type !== 'all' ? params.type : '',
    status: params.status && params.status !== 'all' ? params.status : '',
    page: params.page ?? 1,
    limit: params.limit ?? 100,
  };
  const data = await fetchGraphQL<{ transactions: GraphQLTransaction[] }>(TRANSACTIONS_QUERY, variables);
  return data?.transactions || [];
}

export const NOTIFICATIONS_QUERY = `
query Notifications {
  notifications {
    id
    title
    message
    type
    isRead
    createdAt
  }
}
`;

export async function apiGetNotifications(): Promise<GraphQLNotification[]> {
  const data = await fetchGraphQL<{ notifications: GraphQLNotification[] }>(NOTIFICATIONS_QUERY);
  return data.notifications || [];
}

// ----------------- MUTATIONS -----------------

export const SIGNUP_MUTATION = `
mutation Signup($email: String!, $password: String!, $fullName: String) {
  signup(email: $email, password: $password, fullName: $fullName) {
    success
    token
    user {
      id
      name
      email
      role
      tier
      avatar
      balance
      phone
      is2FAEnabled
      currencyPreference
      notifications {
        email
        sms
        yieldAlerts
      }
      createdAt
    }
  }
}
`;

export async function apiSignup(email: string, password: string, fullName?: string) {
  const data = await fetchGraphQL<{
    signup: {
      success: boolean;
      token: string;
      user: GraphQLUser;
    };
  }>(SIGNUP_MUTATION, {
    email,
    password,
    fullName: fullName || null,
  });
  if (!data?.signup) {
    throw new Error('Registration failed: Backend did not return an account payload.');
  }
  return data.signup;
}

export const LOGIN_MUTATION = `
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    success
    token
    user {
      id
      name
      email
      role
      tier
      avatar
      balance
      phone
      is2FAEnabled
      currencyPreference
      notifications {
        email
        sms
        yieldAlerts
      }
      createdAt
    }
  }
}
`;

export async function apiLogin(email: string, password: string) {
  const data = await fetchGraphQL<{
    login: {
      success: boolean;
      token: string;
      user: GraphQLUser;
    };
  }>(LOGIN_MUTATION, {
    email,
    password,
  });
  if (!data?.login) {
    throw new Error('Login failed: Backend returned an empty response.');
  }
  return data.login;
}

export const UPDATE_PROFILE_MUTATION = `
mutation UpdateProfile($name: String, $phone: String, $is2FaEnabled: Boolean, $currencyPreference: String) {
  updateProfile(name: $name, phone: $phone, is2FAEnabled: $is2FaEnabled, currencyPreference: $currencyPreference) {
    id
    name
    email
    role
    tier
    avatar
    balance
    phone
    is2FAEnabled
    currencyPreference
    notifications {
      email
      sms
      yieldAlerts
    }
    createdAt
  }
}
`;

export async function apiUpdateProfile(variables: {
  name?: string | null;
  phone?: string | null;
  is2FaEnabled?: boolean | null;
  currencyPreference?: string | null;
}) {
  const data = await fetchGraphQL<{
    updateProfile: GraphQLUser;
  }>(UPDATE_PROFILE_MUTATION, {
    name: variables.name ?? null,
    phone: variables.phone ?? null,
    is2FaEnabled: variables.is2FaEnabled ?? null,
    currencyPreference: variables.currencyPreference ?? null,
  });
  return data.updateProfile;
}

export interface GraphQLDepositResult {
  id: string;
  type: string;
  amount: number;
  method: string;
  status: string;
  createdAt?: string;
  userName?: string;
  userId?: string;
  userEmail?: string;
  transactionHash?: string;
  receiptImage?: string;
  currency?: string;
}

export const CREATE_DEPOSIT_MUTATION = `
mutation CreateDeposit($method: String!, $amount: Float!, $currency: String, $transactionHash: String, $receiptImage: String) {
  createDeposit(method: $method, amount: $amount, currency: $currency, transactionHash: $transactionHash, receiptImage: $receiptImage) {
    id
    userId
    userName
    userEmail
    type
    amount
    method
    currency
    transactionHash
    receiptImage
    status
    createdAt
  }
}
`;

export async function apiCreateDeposit(variables: {
  method: string;
  amount: number;
  currency?: string | null;
  transactionHash?: string | null;
  receiptImage?: string | null;
}) {
  const data = await fetchGraphQL<{
    createDeposit: GraphQLDepositResult;
  }>(CREATE_DEPOSIT_MUTATION, {
    method: variables.method,
    amount: variables.amount,
    currency: variables.currency ?? null,
    transactionHash: variables.transactionHash ?? null,
    receiptImage: variables.receiptImage ?? null,
  });
  return data.createDeposit;
}

export const ADMIN_ADJUST_USER_BALANCE_MUTATION = `
mutation AdminAdjustUserBalance($email: String!, $amount: Float!, $action: String!, $reason: String) {
  adminAdjustUserBalance(email: $email, amount: $amount, action: $action, reason: $reason) {
    success
    message
  }
}
`;

export async function apiAdminAdjustUserBalance(email: string, amount: number, action = 'add', reason = 'Deployment liquidity provisioning') {
  try {
    const data = await fetchGraphQL<{ adminAdjustUserBalance: { success: boolean; message: string } }>(
      ADMIN_ADJUST_USER_BALANCE_MUTATION,
      { email, amount, action, reason }
    );
    return data?.adminAdjustUserBalance || null;
  } catch (err) {
    console.warn('apiAdminAdjustUserBalance error:', err);
    return null;
  }
}

export const CREATE_INVESTMENT_MUTATION = `
mutation CreateInvestment($amount: Float!) {
  createInvestment(amount: $amount) {
    id
    planName
    amount
    roi
    progress
    projectedReturn
    status
    startDate
    maturityDate
  }
}
`;

export async function apiCreateInvestment(variables: {
  amount: number;
  userEmail?: string;
  planName?: string;
  roi?: string;
}) {
  const numericAmount = Number(variables.amount);

  try {
    const data = await fetchGraphQL<{
      createInvestment: GraphQLUserInvestment;
    }>(CREATE_INVESTMENT_MUTATION, {
      amount: numericAmount,
    });

    if (data && data.createInvestment && data.createInvestment.id) {
      return data.createInvestment;
    }
    throw new Error('Backend failed to return created investment payload');
  } catch (err: any) {
    const errorMsg = err?.message || '';
    console.warn('apiCreateInvestment attempt result:', errorMsg);
    throw new Error(errorMsg || 'Failed to create investment on backend.');
  }
}

export const SETTLE_INVESTMENT_MUTATION = `
mutation SettleInvestment($id: ID!) {
  settleInvestment(id: $id) {
    investmentId
    payoutAmount
    creditedBalance
    transactionId
    status
  }
}
`;

export async function apiSettleInvestment(id: string) {
  const data = await fetchGraphQL<{
    settleInvestment: {
      investmentId: string;
      payoutAmount: number;
      creditedBalance: number;
      transactionId: string;
      status: string;
    };
  }>(SETTLE_INVESTMENT_MUTATION, {
    id,
  });
  return data.settleInvestment;
}

export const CREATE_WITHDRAWAL_MUTATION = `
mutation CreateWithdrawal($amount: Float!, $destinationAddress: String!, $method: String, $twoFactorCode: String) {
  createWithdrawal(amount: $amount, destinationAddress: $destinationAddress, method: $method, twoFactorCode: $twoFactorCode) {
    id
    amount
    fee
    netPayout
    destinationAddress
    status
    createdAt
  }
}
`;

export async function apiCreateWithdrawal(variables: {
  amount: number;
  destinationAddress: string;
  method?: string;
  twoFactorCode?: string;
}) {
  const data = await fetchGraphQL<{
    createWithdrawal: {
      id: string;
      amount: number;
      fee: number;
      netPayout: number;
      destinationAddress: string;
      status: string;
      createdAt: string;
    };
  }>(CREATE_WITHDRAWAL_MUTATION, {
    amount: variables.amount,
    destinationAddress: variables.destinationAddress,
    method: variables.method || 'Crypto Transfer',
    twoFactorCode: variables.twoFactorCode || null,
  });
  return data.createWithdrawal;
}

export const MARK_NOTIFICATION_READ_MUTATION = `
mutation MarkNotificationRead($id: ID!) {
  markNotificationRead(id: $id)
}
`;

export async function apiMarkNotificationRead(id: string) {
  try {
    const data = await fetchGraphQL<{
      markNotificationRead: boolean;
    }>(MARK_NOTIFICATION_READ_MUTATION, {
      id,
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('apexbridge:notifications-updated'));
    }
    return data?.markNotificationRead ?? false;
  } catch (err) {
    console.warn('apiMarkNotificationRead notice:', err);
    return false;
  }
}

export const MARK_ALL_NOTIFICATIONS_READ_MUTATION = `
mutation MarkAllNotificationsRead {
  markAllNotificationsRead
}
`;

export async function apiMarkAllNotificationsRead() {
  try {
    const data = await fetchGraphQL<{
      markAllNotificationsRead: boolean;
    }>(MARK_ALL_NOTIFICATIONS_READ_MUTATION);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('apexbridge:notifications-updated'));
    }
    return data?.markAllNotificationsRead ?? false;
  } catch (err) {
    console.warn('apiMarkAllNotificationsRead notice:', err);
    return false;
  }
}
