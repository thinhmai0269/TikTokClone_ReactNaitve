import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { useLocalSearchParams, usePathname } from 'expo-router'
import Header from '@/components/header';

export default function () {
  const pathname = useLocalSearchParams();
  console.log(pathname)
  return (
    <SafeAreaView className="">
      <Header
        title='user'
        color='white'
        goBack={true}
      />
      <Text>User</Text>
    </SafeAreaView>
  )
}