import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  FirebaseUser,
} from '../lib/firebase';
import { DEFAULT_AVATAR } from '../data/avatars';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isGuest?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (email: string, pass: string, name?: string) => Promise<boolean>;
  loginAsGuest: (name?: string, email?: string) => void;
  logout: () => Promise<void>;
  authError: string | null;
  setAuthError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'smartcv_app_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const appUser: AppUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'SmartCV User',
          photoURL: fbUser.photoURL || DEFAULT_AVATAR,
          isGuest: false,
        };
        setUser(appUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
      } else {
        // If not firebase user, check if we have a guest session
        const saved = localStorage.getItem(LOCAL_USER_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.isGuest) {
              setUser(parsed);
              setIsLoading(false);
              return;
            }
          } catch {
            // ignore
          }
        }
        setUser(null);
        localStorage.removeItem(LOCAL_USER_KEY);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const appUser: AppUser = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName || 'Google User',
          photoURL: res.user.photoURL || DEFAULT_AVATAR,
          isGuest: false,
        };
        setUser(appUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
        return true;
      }
      return false;
    } catch (err: any) {
      console.warn('Google sign in error:', err);
      // If popup was blocked or iframe restriction, offer friendly message
      setAuthError(err?.message || 'Google Sign-in failed. You can also sign in with Email or 1-Click Guest.');
      return false;
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        const appUser: AppUser = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName || email.split('@')[0],
          photoURL: res.user.photoURL || DEFAULT_AVATAR,
          isGuest: false,
        };
        setUser(appUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
        return true;
      }
      return false;
    } catch (err: any) {
      console.warn('Email login error:', err);
      setAuthError(err?.message || 'Invalid email or password.');
      return false;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name?: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        const appUser: AppUser = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: name || email.split('@')[0],
          photoURL: res.user.photoURL || DEFAULT_AVATAR,
          isGuest: false,
        };
        setUser(appUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
        return true;
      }
      return false;
    } catch (err: any) {
      console.warn('Registration error:', err);
      setAuthError(err?.message || 'Could not create account. Please check credentials.');
      return false;
    }
  };

  const loginAsGuest = (name = 'হাবিবুর রহমান (Demo User)', email = 'user@smartcv.app') => {
    const guestUser: AppUser = {
      uid: 'guest-' + Date.now(),
      email,
      displayName: name,
      photoURL: DEFAULT_AVATAR,
      isGuest: true,
    };
    setUser(guestUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(guestUser));
    setAuthError(null);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginAsGuest,
        logout,
        authError,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
