import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'


export default function Header(
    { title, color, goBack = false, search = false }:
        { title: string, color: string, goBack?: boolean, search?: boolean, }) {
    return (
        <View className='flex-row justify-between items-center '>
            <View className='w-10 ml-5'>
                {goBack && (
                    <TouchableOpacity className='mt-4' onPress={() => router.back()}>
                        <Ionicons name='chevron-back' size={40} color={`${color}`} />
                    </TouchableOpacity>
                )}
            </View>
            <Text className={`text-${color} font-bold text-3xl `}>{title}</Text>
            <TouchableOpacity className='mt-4 mr-5' onPress={() => router.push('/search')}>
                <Ionicons name='search' size={40} color={`${color}`} />
            </TouchableOpacity>

        </View>
    )
}