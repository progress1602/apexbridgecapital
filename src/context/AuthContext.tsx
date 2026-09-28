import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { apiLogin, apiSignup, apiGetMe, apiGetAccountState, apiUpdateProfile, GraphQLUser } from '../lib/graphql';
import { isUserUploadedAvatar } from '../components/UserAvatar';

export interface User extends GraphQLUser {
  country?: string;
  walletAddress?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  signup: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateBalance: (amount: number) => void;
  updateProfile: (profile: {
    name?: string;
    phone?: string;
    is2FAEnabled?: boolean;
    currencyPreference?: string;
    country?: string;
    walletAddress?: string;
    avatar?: string;
  }) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const rawToken = localStorage.getItem('apexbridge_token');
    if (!rawToken || rawToken === 'undefined' || rawToken === 'null') {
      return null;
    }
    const clean = rawToken.trim().replace(/^["']|["']$/g, '');
    return clean && clean !== 'undefined' && clean !== 'null' ? clean : null;
  });

  const [user, setUser] = useState<User | null>(() => {
    const rawToken = localStorage.getItem('apexbridge_token');
    if (!rawToken || rawToken === 'undefined' || rawToken === 'null') {
      try {
        localStorage.removeItem('apexbridge_user');
      } catch {
        // ignore
      }
      return null;
    }
    try {
      const savedUser = localStorage.getItem('apexbridge_user');
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        const parsed = JSON.parse(savedUser);
        if (parsed) {
          // Guarantee no random non-uploaded picture is persisted
          if (parsed.avatar && !isUserUploadedAvatar(parsed.avatar)) {
            parsed.avatar = '';
          }
          return parsed;
        }
      }
    } catch {
      // ignore parse error
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    // If we already have a user in localStorage with token, don't block initial render
    const savedUser = localStorage.getItem('apexbridge_user');
    const savedToken = localStorage.getItem('apexbridge_token');
    return !savedUser && !!savedToken;
  });

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('apexbridge_user');
      localStorage.removeItem('apexbridge_token');
    } catch {
      // ignore
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const rawToken = localStorage.getItem('apexbridge_token');
      if (!rawToken || rawToken === 'undefined' || rawToken === 'null') return;

      const accountState = await apiGetAccountState();
      const remoteUser = accountState.user;
      const wallet = accountState.walletSummary;

      if (remoteUser && remoteUser.id) {
        setUser((prev) => {
          let cached: Partial<User> = {};
          try {
            const savedStr = localStorage.getItem('apexbridge_user');
            if (savedStr) cached = JSON.parse(savedStr);
          } catch {
            // ignore
          }

          const liveBalance = remoteUser.balance !== undefined && remoteUser.balance !== null
            ? Number(remoteUser.balance)
            : (wallet?.availableBalance !== undefined && wallet?.availableBalance !== null
                ? Number(wallet.availableBalance)
                : (prev?.balance ?? 0));

          // Strictly preserve only user-uploaded avatar; reject random picture URLs
          const customAvatar = localStorage.getItem(`apexbridge_custom_avatar_${remoteUser.id || remoteUser.email}`);
          let finalAvatar = '';
          if (customAvatar && isUserUploadedAvatar(customAvatar)) {
            finalAvatar = customAvatar;
          } else if (prev?.avatar && isUserUploadedAvatar(prev.avatar)) {
            finalAvatar = prev.avatar;
          } else if (remoteUser.avatar && isUserUploadedAvatar(remoteUser.avatar)) {
            finalAvatar = remoteUser.avatar;
          }

          const updated: User = {
            ...cached,
            ...(prev || {}),
            ...remoteUser,
            avatar: finalAvatar,
            balance: liveBalance,
          };
          try {
            localStorage.setItem('apexbridge_user', JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      }
    } catch (err) {
      console.warn('Could not refresh remote user account state:', err);
    }
  }, []);

  // Revalidate or sync user session in the background
  useEffect(() => {
    let isMounted = true;

    async function initialSync() {
      const rawToken = localStorage.getItem('apexbridge_token');
      if (rawToken && rawToken !== 'undefined' && rawToken !== 'null') {
        await refreshUser();
      }
      if (isMounted) {
        setIsLoading(false);
      }
    }

    initialSync();

    // Auto-refresh when user returns to app tab (e.g., from GraphQL playground)
    const handleFocus = () => {
      refreshUser();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshUser();
      }
    };

    // Listen for unauthorized events to safely reset session
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('apexbridge:unauthorized', handleUnauthorized);

    // Continuous 8-second polling to reflect real-time playground mutations
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshUser();
      }
    }, 8000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('apexbridge:unauthorized', handleUnauthorized);
      clearInterval(intervalId);
    };
  }, [refreshUser, logout]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      if (password) {
        const res = await apiLogin(email, password);
        if (res && res.token) {
          setToken(res.token);
          localStorage.setItem('apexbridge_token', res.token);
          
          const customAvatar = localStorage.getItem(`apexbridge_custom_avatar_${res.user.id || res.user.email}`);
          const finalAvatar = customAvatar && isUserUploadedAvatar(customAvatar)
            ? customAvatar
            : (isUserUploadedAvatar(res.user.avatar) ? (res.user.avatar || '') : '');

          const fullUser: User = {
            ...res.user,
            avatar: finalAvatar,
            balance: res.user.balance ?? 0,
          };
          setUser(fullUser);
          localStorage.setItem('apexbridge_user', JSON.stringify(fullUser));
          return { success: true };
        }
      }
    } catch (err: any) {
      console.warn('GraphQL login error:', err);
      return { success: false, message: err.message || 'Login failed. Please check credentials.' };
    }

    return { success: false, message: 'Invalid credentials' };
  };

  const signup = async (email: string, password: string, fullName?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await apiSignup(email, password, fullName);
      if (res && res.token) {
        setToken(res.token);
        localStorage.setItem('apexbridge_token', res.token);
        
        const fullUser: User = {
          ...res.user,
          avatar: '',
          name: res.user.name || fullName || email.split('@')[0],
          balance: res.user.balance ?? 0,
        };
        setUser(fullUser);
        localStorage.setItem('apexbridge_user', JSON.stringify(fullUser));
        return { success: true };
      }
    } catch (err: any) {
      console.warn('GraphQL signup error:', err);
      return { success: false, message: err.message || 'Signup failed. Please try again.' };
    }

    return { success: false, message: 'Registration could not be completed.' };
  };

  const updateBalance = (amountChange: number) => {
    if (user) {
      const updatedUser = { ...user, balance: (user.balance || 0) + amountChange };
      setUser(updatedUser);
      localStorage.setItem('apexbridge_user', JSON.stringify(updatedUser));
    }
  };

  const updateProfile = async (profile: {
    name?: string;
    phone?: string;
    is2FAEnabled?: boolean;
    currencyPreference?: string;
    country?: string;
    walletAddress?: string;
    avatar?: string;
  }): Promise<boolean> => {
    if (!user) return false;

    // Persist custom avatar locally if provided or removed
    if (profile.avatar !== undefined) {
      if (isUserUploadedAvatar(profile.avatar)) {
        try {
          localStorage.setItem(`apexbridge_custom_avatar_${user.id || user.email}`, profile.avatar);
        } catch {
          // ignore
        }
      } else if (profile.avatar === '') {
        try {
          localStorage.removeItem(`apexbridge_custom_avatar_${user.id || user.email}`);
        } catch {
          // ignore
        }
      }
    }

    const currentUploadedAvatar = localStorage.getItem(`apexbridge_custom_avatar_${user.id || user.email}`);
    const resolvedAvatar = profile.avatar !== undefined
      ? (isUserUploadedAvatar(profile.avatar) ? profile.avatar : '')
      : (currentUploadedAvatar && isUserUploadedAvatar(currentUploadedAvatar)
          ? currentUploadedAvatar
          : (isUserUploadedAvatar(user.avatar) ? user.avatar : ''));

    try {
      const updatedRemote = await apiUpdateProfile({
        name: profile.name ?? user.name,
        phone: profile.phone ?? user.phone,
        is2FaEnabled: profile.is2FAEnabled ?? user.is2FAEnabled,
        currencyPreference: profile.currencyPreference ?? user.currencyPreference,
      });

      if (updatedRemote) {
        const mergedUser: User = {
          ...user,
          ...updatedRemote,
          avatar: resolvedAvatar,
          country: profile.country ?? user.country,
          walletAddress: profile.walletAddress ?? user.walletAddress,
        };
        setUser(mergedUser);
        localStorage.setItem('apexbridge_user', JSON.stringify(mergedUser));
        return true;
      }
    } catch (err) {
      console.warn('Backend update profile failed:', err);
    }

    // Local state fallback
    const updatedUser: User = { ...user, ...profile, avatar: resolvedAvatar };
    setUser(updatedUser);
    localStorage.setItem('apexbridge_user', JSON.stringify(updatedUser));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        updateBalance,
        updateProfile,
        refreshUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
