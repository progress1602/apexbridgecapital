# ApexBridge Capital — Master Backend API & Database Infrastructure Blueprint

This specification is a comprehensive technical mandate detailing the full architecture, database schemas, authorization states, client-to-server data-mapping flows, and API router requirements for **ApexBridge Capital**. This is designed as a drop-in technical specification for a backend developer to build a secure, production-grade API.

---

## 1. System Architecture & Tech Stack

### 1.1 Core Components
* **Frontend Architecture:** Single-Page Application (SPA) utilizing **React 18** and **Vite** with typed **TypeScript**. State transitions are managed locally using React state hooks with temporary `localStorage` fallback wrappers (defined in `src/hooks/useMockData.ts`).
* **Design & Styling Layout:** Styled using utility-first **Tailwind CSS**. Custom layout animations and component transitions are generated using **motion/react**.
* **Target Backend Architecture:** Stateless **RESTful API** returning and accepting JSON payloads (`application/json`).
* **Security & Tokens:** Stateful **JWT (JSON Web Token)** layers passed in the headers:
  `Authorization: Bearer <token>`
* **Database Platform Recommendation:** Relational SQL engines (specifically **PostgreSQL** or **CockroachDB**) to support high-accuracy ledger entries, balance precision, proper state synchronization, and ACID-compliance transactions.

---

## 2. Master Database Schema Specification

Below are the production database tables, custom enumeration constraints, strict data types, indexes, and primary-foreign-key relationships required of the database.

### 2.1 The Users Table (`users`)
Stores authenticated clients, credentials, active account tier constraints, security states, and ledger balances.

```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    balance NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    phone VARCHAR(50) NULL,
    country VARCHAR(100) NULL,
    wallet_address VARCHAR(255) NULL,
    two_fa_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    tier VARCHAR(50) NOT NULL DEFAULT 'Tier 2 Private',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Optimization Index
CREATE INDEX idx_users_email ON users(email);
```

### 2.2 The Transactions Ledger Table (`transactions`)
Stores deposit records, withdrawal requests, and balance modifications. Ensures continuous double-entry ledger security.

```sql
-- Transaction Categories Constraint
CREATE TYPE tx_type_enum AS ENUM ('deposit', 'withdrawal', 'investment');

-- Transaction Status Sequence
CREATE TYPE tx_status_enum AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE transactions (
    id VARCHAR(50) PRIMARY KEY NOT NULL,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type tx_type_enum NOT NULL,
    amount NUMERIC(18, 4) NOT NULL,
    status tx_status_enum NOT NULL DEFAULT 'pending',
    method VARCHAR(100) NULL, -- e.g., 'Bitcoin', 'Ethereum', 'USDT Tether Protocol (ERC-20)'
    plan VARCHAR(100) NULL,   -- Associated investment vault name (if type = 'investment')
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Optimization Indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
```

### 2.3 The Investments Staking Table (`investments`)
Tracks capital allocations into dynamic active capital growth vaults with scheduled returns.

```sql
CREATE TYPE investment_status_enum AS ENUM ('active', 'completed');

CREATE TABLE investments (
    id VARCHAR(50) PRIMARY KEY NOT NULL,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL, -- "Alpha Bolt", "Global Reserve", etc.
    amount NUMERIC(18, 4) NOT NULL,
    roi VARCHAR(20) NOT NULL,        -- ROI rate string, e.g., "15%" or "+32%"
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status investment_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Optimization Index
CREATE INDEX idx_investments_user_id ON investments(user_id);
```

### 2.4 System Notifications Table (`notifications`)
Stores logs of client security confirmations, withdrawal status updates, or deposit receipts.

```sql
CREATE TYPE notification_type_enum AS ENUM ('info', 'alert', 'success');

CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type_enum NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Optimization Index
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
```

---

## 3. Detail Analysis of Frontend Pages & API Data-Binding

The frontend comprises 9 major pages. Below is the precise list of pages, their data structures, expected user interactions, and required API service endpoints.

### 3.1 Main Public Space (`LandingPage.tsx`)
* **Purpose:** Public landing page demonstrating trust badges, marketing, and the newly updated, highly polished hero section.
* **Backend Interaction:** Static rendering on public loading.
* **Visual Elements Context:** Features the high-contrast Hero background mask revealing the structural graphics, avatar arrays, core metrics (`$8.4B+` Platforms Liquidity, etc.), and the email contact card `apexbridgecapital1@gmail.com`.
* **Action Hooks:** Clicking `DEPLOY CAPITAL NOW` routes the user to `/signup`. Clicking `Portal Access` routes to `/login`.

### 3.2 Secure Multi-Factor Authenticator (`LoginPage.tsx` / Signup)
* **Purpose:** Collect credentials and authenticate or register users.
* **Fields Bound:** `email`, `password`, `name` (during registration).
* **Endpoints Triggered:**
  * **Login Request:** `POST /api/auth/login`
  * **Registration Request:** `POST /api/auth/register`
* **Flow & State Transfer:**
  Upon validation, server issues a JSON payload with a `token` (JWT) and a `user` data object (containing balance, tier, and email). The client application stores the token in memory/cookies, and boots state redirection to the internal workspace `/user/dashboard`.

### 3.3 Investment Portfolio Hub (`DashboardPage.tsx`)
* **Purpose:** Displays net valuations, active capital stakings, dynamic metrics, and recent transaction activities.
* **State Values Rendered:**
  * User balance (`formatCurrency(user.balance)`).
  * Net staked capital (Calculated sum of active `investments.amount`).
  * Yield Accrued (Computed ROI gains derived from active stakings).
  * Recent activity ledger list (last 5 ledger items from `transactions` array).
* **Endpoints Triggered:**
  * `GET /api/user/profile` (called on mount to refresh balance)
  * `GET /api/user/dashboard-summary` (optional combined dashboard endpoint)

### 3.4 Wire & Blockchain Deposit Hub (`DepositPage.tsx`)
* **Purpose:** Submits transaction notifications for refuelling client balances.
* **Fields Bound:**
  * `amount` (minimum transaction limit validation applied on front-end).
  * `method` (e.g. `'Bitcoin'`, `'Ethereum'`, `'Tether USDT (ERC-20)'`).
* **Expected User Interaction:**
  User selects the crypto currency method, inputs the desired deposit volume, obtains the unique admin wallet address, deposit instructions, and triggers "Confirm Deposit".
* **Endpoints Triggered:**
  * `POST /api/ledger/deposit`
  * Payload: `{ "amount": number, "method": string }`
  * Action: Server generates a pending transaction under the active user's context.

### 3.5 Capital Growth & Stakings Deployment (`InvestPage.tsx`)
* **Purpose:** Allocates user balance into specific vaults ("Alpha Bolt Plan" 15% APY, "Global Reserve Plan" 24% APY, etc.).
* **State Constraints & Business Rules:**
  * Allocation amount MUST NOT exceed the user's current valid balance:
    `if (amount > user.balance) throw Error("Insufficient Available Balance")`
  * Activating a plan MUST atomically create an investment vault with status "active", and also decrement the user's wallet balance by the exact amount allocated.
* **Endpoints Triggered:**
  * `POST /api/vaults/deploy`
  * Payload: `{ "planName": string, "amount": number, "roi": string }`
  * API Logic:
    1. Verify current available balance of the calling user.
    2. Create `investments` entry with status `'active'`.
    3. Insert a transaction record under type `'investment'` on the user's profile.
    4. Return updated user balance and created position record.

### 3.6 Ledger Audit History Archive (`TransactionsPage.tsx`)
* **Purpose:** Comprehensive grid displaying all historically initialized deposit, withdrawal, and staking entries.
* **Interaction Flow:** Displays filtering buttons to toggle records by state classifications (`'deposit'`, `'withdrawal'`, `'investment'`). Shows status badges for each (`pending`, `approved`, `rejected`).
* **Endpoints Triggered:**
  * `GET /api/ledger/transactions` (Returns a clean array of `Transaction` items).

### 3.7 Liquidity Withdrawal Queue (`WithdrawPage.tsx`)
* **Purpose:** Allows clients to submit withdrawal requests to liquidate assets.
* **State Constraints & Validation Controls:**
  * User balance constraint: `amount <= user.balance`
  * Triggers request to target address (or bank wire wire specifications).
* **Endpoints Triggered:**
  * `POST /api/ledger/withdraw`
  * Payload: `{ "amount": number, "method": string, "destinationWallet": string }`
  * API Logic:
    Atomic balance logic. On validation, the server creates a `Transaction` item of type `'withdrawal'` and status `'pending'`. The backend developer may optionally deduct the balance raw or lock it from other deployments until admin approval settles the transaction.

### 3.8 Security & Profile Portal (`ProfilePage.tsx`)
* **Purpose:** Allows changing passwords, configuring secondary Two-Factor Authentication, and updating phone number, country, and address attributes.
* **Fields Bound:** `name`, `phone`, `country`, `wallet_address`, `two_fa_enabled`.
* **Endpoints Triggered:**
  * `PUT /api/user/profile` (Updates profile meta)

### 3.9 Notifications Feed Inbox (`NotificationsPage.tsx`)
* **Purpose:** Continuous alert log for activities, deposit approvals, and system notifications.
* **Endpoints Triggered:**
  * `GET /api/notifications`
  * `PUT /api/notifications/:id/read`

---

## 4. API Endpoints Specification

All server endpoints should expect/return `Content-Type: application/json` payloads. Secure endpoints require the authorization bearer token.

### 4.1 Authentication Router

#### `POST /api/auth/register`
* **Secure Category:** Public
* **Request Payload Format:**
  ```json
  {
    "name": "Alexander Gale",
    "email": "user@example.com",
    "password": "strong_cleartext_password"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_77189fa3c",
      "name": "Alexander Gale",
      "email": "user@example.com",
      "balance": 0.00,
      "tier": "Tier 2 Private",
      "two_fa_enabled": true
    }
  }
  ```

#### `POST /api/auth/login`
* **Secure Category:** Public
* **Request Payload Format:**
  ```json
  {
    "email": "user@example.com",
    "password": "cleartext_password"
  }
  ```
* **Success Response (200 OK):** *(Returns identical payload structure to register on secure clearance)*

---

### 4.2 Financial Ledger Router

#### `GET /api/ledger/transactions`
* **Secure Category:** Authenticated (`Bearer <token>`)
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": "tx_fa91d3",
      "type": "deposit",
      "amount": 5000.00,
      "status": "approved",
      "date": "2026-06-12",
      "method": "Bitcoin"
    },
    {
      "id": "tx_28f3a1",
      "type": "withdrawal",
      "amount": 1200.00,
      "id": "tx_28f3a1",
      "status": "pending",
      "date": "2026-06-14",
      "method": "Ethereum"
    }
  ]
  ```

#### `POST /api/ledger/deposit`
* **Secure Category:** Authenticated (`Bearer <token>`)
* **Request Payload Format:**
  ```json
  {
    "amount": 10500.00,
    "method": "Tether USDT (ERC20)"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "transaction": {
      "id": "tx_new_8a92f02",
      "type": "deposit",
      "amount": 10500.00,
      "status": "pending",
      "date": "2026-06-14",
      "method": "Tether USDT (ERC20)"
    }
  }
  ```

#### `POST /api/ledger/withdraw`
* **Secure Category:** Authenticated (`Bearer <token>`)
* **Request Payload Format:**
  ```json
  {
    "amount": 2500.00,
    "method": "Bitcoin",
    "destinationWallet": "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "transaction": {
      "id": "tx_wd_dca29",
      "type": "withdrawal",
      "amount": 2500.00,
      "status": "pending",
      "date": "2026-06-14",
      "method": "Bitcoin"
    }
  }
  ```

---

### 4.3 Stakings & Vault Router

#### `POST /api/vaults/deploy`
* **Secure Category:** Authenticated (`Bearer <token>`)
* **Request Payload Format:**
  ```json
  {
    "planName": "Gold Plan",
    "amount": 2000.00,
    "roi": "15%"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "investment": {
      "id": "inv_8da29c",
      "planName": "Gold Plan",
      "amount": 2000.00,
      "roi": "15%",
      "startDate": "2026-06-14",
      "status": "active"
    },
    "newBalance": 8000.00
  }
  ```

---

### 4.4 Settings & Meta Router

#### `PUT /api/user/profile`
* **Secure Category:** Authenticated (`Bearer <token>`)
* **Request Payload Format:**
  ```json
  {
    "name": "Alexander Gale",
    "phone": "+1 (555) 019-2834",
    "country": "Switzerland",
    "wallet_address": "0x71C27581B855A5100650A195EAD84CA6762C3A59",
    "two_fa_enabled": true
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "id": "usr_77189fa3c",
      "name": "Alexander Gale",
      "email": "user@example.com",
      "balance": 8000.00,
      "phone": "+1 (555) 019-2834",
      "country": "Switzerland",
      "wallet_address": "0x71C27581B855A5100650A195EAD84CA6762C3A59",
      "two_fa_enabled": true,
      "tier": "Tier 2 Private"
    }
  }
  ```

---

## 5. Integration Guide: Transitioning from Mock fallback to REST API

To swap out the temporary front-end `localStorage` hooks with your production REST endpoints:

1. **Replace the HTTP Client Logic:**
   Create an HTTP Axios service layer or native `fetch` wrappers that append the token stored in your state:
   ```typescript
   // src/lib/api.ts
   import axios from 'axios';

   export const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || '/api',
   });

   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('apexbridge_token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

2. **Refactor Auth Context Data Loading:**
   Modify `AuthContext.tsx` to mount a `GET /api/user/profile` query upon initialization, refreshing state fields directly from the server.

3. **Bind useMockData to API Service Queries:**
   Redirect `useMockData.ts` handlers to dispatch API requests:
   ```typescript
   export function useMockData() {
     // Swap out local state fallback with server data fetches
     const [transactions, setTransactions] = useState<Transaction[]>([]);
     const [investments, setInvestments] = useState<Investment[]>([]);

     useEffect(() => {
       api.get('/ledger/transactions').then(res => setTransactions(res.data));
       api.get('/vaults/active').then(res => setInvestments(res.data));
     }, []);

     const addTransaction = async (tx) => {
       const res = await api.post('/ledger/deposit', tx);
       return res.data;
     };

     const addInvestment = async (inv) => {
       const res = await api.post('/vaults/deploy', inv);
       return res.data;
     };

     return { transactions, investments, addTransaction, addInvestment };
   }
   ```

4. **Synchronize Multi-Staking Real-time yields:**
   Configure a chron-task or backend interval loop that periodically aggregates earnings `roi` percent and increments the corresponding users' `balance` attribute in the database at the conclusion of active staking programs.
