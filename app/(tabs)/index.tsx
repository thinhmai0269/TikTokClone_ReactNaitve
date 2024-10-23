import { Text, View } from 'react-native';
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
export default function () {
  const { user } = useAuth();
  console.log('user', user)
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="">{JSON.stringify(user)}</Text>

    </View>
  );
}
