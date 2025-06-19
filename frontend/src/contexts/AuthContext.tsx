// Authentication context for managing user authentication state across the app
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { UserProfile, getUserProfile } from '../services/userService';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUserProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async () => {
    if (firebaseUser) {
      try {
        console.log('Refreshing user profile...');
        const profile = await getUserProfile();
        console.log('User profile fetched successfully:', profile);
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUserProfile(null);
      }
    } else {
      console.log('No Firebase user, clearing profile');
      setUserProfile(null);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Firebase auth state changed:', user ? `User: ${user.email}` : 'No user');
      setFirebaseUser(user);
      
      if (user) {
        // User is signed in, fetch their profile
        try {
          console.log('Fetching user profile for authenticated user...');
          const profile = await getUserProfile();
          console.log('User profile loaded:', profile);
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to fetch user profile on auth change:', error);
          // Don't immediately clear profile - user might exist but API call failed
          // Instead, wait for potential retry or manual refresh
        }
      } else {
        // User is signed out
        console.log('User signed out, clearing profile');
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Debug logging for state changes
  useEffect(() => {
    console.log('Auth state updated:', {
      firebaseUser: firebaseUser ? firebaseUser.email : 'null',
      userProfile: userProfile ? userProfile.email : 'null',
      loading,
      isAuthenticated: !!firebaseUser && !!userProfile
    });
  }, [firebaseUser, userProfile, loading]);

  const value: AuthContextType = {
    firebaseUser,
    userProfile,
    loading,
    isAuthenticated: !!firebaseUser && !!userProfile,
    refreshUserProfile,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};