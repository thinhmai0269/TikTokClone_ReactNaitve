import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
export default function () {
  const { user,signOut } = useAuth()
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="">{user?.username}</Text>
      <TouchableOpacity
        className="p-2 rounded-lg"
        onPress={
          () => signOut()
        }
      >
        <Text className='text-black font-semibold text-lg text-center mt-3'>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
