import React, { createContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";

// Define the User interface
interface User {
    id: string;
    username: string;
    email?: string; // Optional if not always included
}

// Define the AuthContext's initial type with all values, especially `user` as `User | null`
interface AuthContextProps {
    user: User | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (username: string, email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    likes: any[];
    getLike: (userId: string) => Promise<void>;
    followers: any[];
    getFollowers: (userId: string) => Promise<void>;
    following: any[];
    getFollowing: (userId: string) => Promise<void>;
    friends: any[];
    getFriends: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
    likes: [],
    getLike: async () => { },
    followers: [],
    getFollowers: async () => { },
    following: [],
    getFollowing: async () => { },
    friends: [],
    getFriends: async () => { }
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [likes, setLikes] = useState<any[]>([]);
    const [followers, setFollowers] = useState<any[]>([]);
    const [following, setFollowing] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    useEffect(() => {
        getFriends()
    }, [following, followers])
    const getFriends = async () => {
        const followingIds = following.map(f => f.follower_user_id)
        const followerIds = followers.map(f => f.user_id)
        const duplicate = followerIds.filter(id => followingIds.includes(id))
        setFriends(duplicate)
    }
    const getLike = async (userId: string) => {
        const { data, error } = await supabase
            .from("Like")
            .select("*")
            .eq("user_id", userId);
        if (error) {
            console.error("Error at getLike:", error);
            return;
        }
        setLikes(data);
    };

    const getFollowers = async (userId: string) => {
        const { data, error } = await supabase
            .from("Follower")
            .select("*, User(*)")
            .eq("follower_user_id", userId);
        if (error) {
            console.error("Error at getFollowers:", error);
            return;
        }

        setFollowers(data);
    };

    const getFollowing = async (userId: string) => {
        const { data, error } = await supabase
            .from("Follower")
            .select("*")
            .eq("user_id", userId);
        if (error) {
            console.error("Error at getFollowing:", error);
            return;
        }

        setFollowing(data);
    };

    const getUser = async (id: string) => {
        const { data, error } = await supabase
            .from("User")
            .select("*")
            .eq("id", id)
            .single();
        if (error) {
            console.error("Error fetching user data:", error.message);
            return;
        }
        setUser(data);
        await getLike(data.id);
        router.push("/(tabs)");
    };

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            console.error("Sign-in error:", error);
            return;
        }
        if (data?.user) {
            await getUser(data.user.id);
        }
    };

    const signUp = async (username: string, email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            console.error("Sign-up error:", error);
            return;
        }
        if (data?.user) {
            const { error: userError } = await supabase.from("User").insert({
                id: data.user.id,
                username,
                email,
            });
            if (userError) {
                console.error("Error after sign-up:", userError);
                return;
            }
            router.back();
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Sign-out error:", error);
            return;
        }
       
        router.push("/(auth)");
    };

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (!session) {
                    router.push("/(auth)");
                } else {
                    getUser(session.user.id);
                    getFollowers(session.user.id)
                    getFollowing(session.user.id)

                }
            }
        );

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                signIn,
                signUp,
                signOut,
                likes,
                getLike,
                followers,
                getFollowers,
                following,
                getFollowing,
                friends,
                getFriends
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
