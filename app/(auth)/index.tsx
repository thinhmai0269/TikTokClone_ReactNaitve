import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { Link, router } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { AuthContext, useAuth } from '@/providers/AuthProvider';
export default function () {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signIn } = useAuth()
    // const handleLogin = async() => {
    //     console.log("login", email, password)
    //     const { data, error } = await supabase.auth.signInWithPassword({
    //         email: email,
    //         password: password,
    //     })
    //     if (error) return console.error(error)
    //         router.push('/(tabs)')
    // }

    return (
        <View className="flex-1 items-center justify-center bg-slate-50">
            <View className='w-full p-4'>
                <Text className='text-black font-bold text-3xl text-center mb-5 '>Login</Text>
                <TextInput
                    placeholder='Email'
                    className='bg-white px-4 py-2 rounded-lg border-gray-300 w-full  border borderWidth-2 mb-4'
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    secureTextEntry={true}
                    placeholder='Password'
                    className='bg-white px-4 py-2 rounded-lg border-gray-300 w-full  border borderWidth-2 mb-4'
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    className="bg-black p-2 rounded-lg"
                    onPress={
                        // () => router.push('/(tabs)')
                        () => signIn(email, password)
                    }
                >
                    <Text className='text-white font-bold text-lg text-center'>login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="p-2 rounded-lg"
                    onPress={
                        () => router.push('/signup')
                        // handleLogin
                    }
                >
                    <Text className='text-black font-semibold text-lg text-center mt-3'>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}
