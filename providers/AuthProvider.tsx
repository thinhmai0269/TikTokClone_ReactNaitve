import React, { createContext, useState } from "react";
import { supabase } from "@/utils/supabase";
import signup from "@/app/(auth)/signup";
import { router } from "expo-router";
export const AuthContext = createContext({
    user: null,
    signIn: async (email: string, password: string) => { },
    signUp: async (username: string, email: string, password: string) => { },
    signOut: async () => { }
});
export const useAuth = () => React.useContext(AuthContext)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState('')

    const getUser = async (id: string) => {
        const { data, error } = await supabase.from('User').select('*').eq('id', id).single();
        if (error) return console.error(error)
        setUser(data)
        console.log('datauser', data)
        router.push('/(tabs)')

    }
    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error) return console.error(error)
        getUser(data.user.id)
    }

    const signUp = async (username: string, email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if (error) return console.error(error,'errr dk')
        const {error: userError } = await supabase.from('User').insert({
            id: data?.user?.id,
            username: username,
            email: email
        })
        if (userError) return console.error(userError, 'error sau khi dk')
        router.back()
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) return console.log(error, 'e')
        setUser(null)
        router.push('/(auth)')
    }
    return <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
        {children}
    </AuthContext.Provider>
}