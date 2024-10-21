import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Link, router } from 'expo-router';
export default function () {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <TouchableOpacity 
            className="bg-white p-4 rounded-lg"
                onPress={() => router.push('/signup')}
            >
                <Text>login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
             className="bg-white p-4 rounded-lg"
                onPress={() => router.push('/(tabs)')}
            >
                <Text>Chuyen sang tabs</Text>
            </TouchableOpacity>
        </View>
    );
}
