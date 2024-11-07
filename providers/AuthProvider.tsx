import React, { createContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import signup from "@/app/(auth)/signup";
import { router } from "expo-router";
export const AuthContext = createContext({
    user: null,
    signIn: async (email: string, password: string) => { },
    signUp: async (username: string, email: string, password: string) => { },
    signOut: async () => { },
    likes: [],
    getLike: async (userId: string) => { }
});
export const useAuth = () => React.useContext(AuthContext)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState('')
    const [likes, setLikes] = useState<any>([])
    const getLike = async (userId: string) => {
        const { data, error } = await supabase
            .from('Like')
            .select('*')
            .eq('user_id', userId)
        if (error) return console.log(error, 'error at getLike')
        setLikes(data)
        console.log('like', likes)
    }
    const getUser = async (id: string) => {
        const { data, error } = await supabase.from('User').select('*').eq('id', id).single();
        if (error) {
            console.log("Error fetching user data:", error.message);
            return; // Exit the function if there's an error
        }
        setUser(data);
        getLike(data.id)
        router.push('/(tabs)');
    };

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        console.log(data, 'cechk signin')
        if (error) return console.log(error, 'signin')
        getUser(data.user.id)
    }

    const signUp = async (username: string, email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if (error) return console.log(error, 'errr dk', data)
        console.log(data)
        const { error: userError } = await supabase
            .from('User')
            .insert({
                id: data?.user?.id,
                username: username,
                email: email
            })
            .select()
        if (userError) return console.log(userError, 'error sau khi dk')
        router.back()
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) return console.log(error, 'e')
        setUser(null)
        router.push('/(auth)')
    }
    useEffect(
        () => {
            const { data: authData } = supabase.auth.onAuthStateChange((event, session) => {
                if (!session) {
                    return router.push('/(auth)')
                }
                getUser(session?.user.id)
            })
        }, []
    )
    return <AuthContext.Provider value={{ user, signIn, signUp, signOut,likes, getLike }}>
        {children}
    </AuthContext.Provider>
}