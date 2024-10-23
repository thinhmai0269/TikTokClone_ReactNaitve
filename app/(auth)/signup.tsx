import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/providers/AuthProvider';
export default function () {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userName, setUserName] = useState('')
    const { signUp } = useAuth()

    return (
        <View className="flex-1 items-center justify-center bg-slate-50">
            <View className='w-full p-4'>
                <Text className='text-black font-bold text-3xl text-center mb-5 '>Sign up</Text>
                <TextInput
                    placeholder='Username'
                    className='bg-white px-4 py-2 rounded-lg border-gray-300 w-full  border borderWidth-2 mb-4'
                    value={userName}
                    onChangeText={setUserName}
                />
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
                        () => signUp(userName, email, password)
                    }
                >
                    <Text className='text-white font-bold text-lg text-center'>Create</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}
