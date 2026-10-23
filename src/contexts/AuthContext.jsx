import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { syncProgressOnLogin } from '../services/gameProgressService';

const AuthContext = createContext(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [subscription, setSubscription] = useState(null)
  const [subscriptionLoading, setSubscriptionLoading] = useState(false)

  // Isolated async operations - never called from auth callbacks
  const profileOperations = {
    async load(userId) {
      if (!userId) return
      setProfileLoading(true)
      try {
        const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()
        if (!error) setUserProfile(data)
      } catch (error) {
        console.error('Profile load error:', error)
      } finally {
        setProfileLoading(false)
      }
    },

    clear() {
      setUserProfile(null)
      setProfileLoading(false)
    }
  }

  const subscriptionOperations = {
    async load(userId) {
      if (!userId) return
      setSubscriptionLoading(true)
      try {
        const { data, error } = await supabase
          ?.from('subscriptions')
          ?.select('*')
          ?.eq('user_id', userId)
          ?.eq('status', 'active')
          ?.order('created_at', { ascending: false })
          ?.limit(1)
          ?.single()
        if (!error && data) {
          setSubscription(data)
        } else {
          setSubscription(null)
        }
      } catch (error) {
        console.error('Subscription load error:', error)
        setSubscription(null)
      } finally {
        setSubscriptionLoading(false)
      }
    },

    clear() {
      setSubscription(null)
      setSubscriptionLoading(false)
    }
  }

  // Auth state handlers - PROTECTED from async modification
  const authStateHandlers = {
    // This handler MUST remain synchronous - Supabase requirement
    onChange: (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      if (session?.user) {
        profileOperations?.load(session?.user?.id) // Fire-and-forget
        subscriptionOperations?.load(session?.user?.id) // Fire-and-forget
        // Sync localStorage progress to Supabase on login
        if (event === 'SIGNED_IN') {
          syncProgressOnLogin()?.catch((err) =>
            console.error('Progress sync error:', err)
          )
        }
      } else {
        profileOperations?.clear()
        subscriptionOperations?.clear()
      }
    }
  }

  useEffect(() => {
    // Initial session check
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      authStateHandlers?.onChange(null, session)
    })

    // CRITICAL: This must remain synchronous
    const { data: { subscription: authSubscription } } = supabase?.auth?.onAuthStateChange(
      authStateHandlers?.onChange
    )

    return () => authSubscription?.unsubscribe()
  }, [])

  // Auth methods
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({ email, password })
      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut()
      if (!error) {
        setUser(null)
        profileOperations?.clear()
        subscriptionOperations?.clear()
      }
      return { error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: { message: 'No user logged in' } }

    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()
      if (!error) setUserProfile(data)
      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  const isPremium = !!subscription && subscription?.status === 'active'

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    subscription,
    subscriptionLoading,
    isPremium,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
