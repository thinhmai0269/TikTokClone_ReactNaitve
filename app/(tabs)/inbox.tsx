import { Text, View, Image, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { useIsFocused } from '@react-navigation/native';
export default function () {
  const { friends } = useAuth();
  const [users, setUsers] = useState<any[]>([])
  const isForcus = useIsFocused();
  useEffect(() => {
    getUsers()
  }, [isForcus])
  const getUsers = async () => {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .in('id', friends)
    if (error) return console.log(error)
    setUsers(data)
  }
  return (
    <SafeAreaView className="flex-1 items-center mt-16 ">
      <Text className="text-black font-bold text-2xl text-center">Inbox</Text>
      <TouchableOpacity
        onPress={() => router.push('/follower')}
        className="flex-row gap-2 items-start justify-start w-full m-1">
        <View className='flex-row w-full justify-between items-center px-3'>
          <View className='flex-row gap-2'>
            <View className="w-12 h-12 rounded-full bg-blue-400 items-center justify-center">
              <Ionicons
                name='person'
                size={24}
                color={'while'} />
            </View>
            <View>
              <Text className="font-bold text-base">New followers</Text>
              <Text>HI</Text>
            </View>
          </View>
          <Ionicons name='chevron-forward' size={24} color={'black'} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/activity')}
        className="flex-row gap-2 items-start justify-start w-full m-1">
        <View className='flex-row w-full justify-between items-center px-3'>
          <View className='flex-row gap-2'>
            <View className="w-12 h-12 rounded-full bg-blue-400 items-center justify-center">
              <Ionicons
                name='time'
                size={24}
                color={'while'} />
            </View>
            <View>
              <Text className="font-bold text-base">Activity</Text>
              <Text>See what people doing</Text>
            </View>
          </View>
          <Ionicons name='chevron-forward' size={24} color={'black'} />
        </View>
      </TouchableOpacity>
      <FlatList
        data={users}
        renderItem={({ item }) => {
          const test = `${process.env.EXPO_PUBLIC__BUCKET}/avatar/${item.id}/avatar.jpeg`
          console.log(test)
            
          return (<TouchableOpacity
            onPress={() => router.push(`/chat?chat_user_id=${item.id}`)}
            className="flex-row gap-2 items-start justify-start w-full m-1">
            <View className='flex-row w-full justify-between items-center px-3'>
              <View className='flex-row gap-2'>
                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC__BUCKET}/avatar/${item.id}/avatar.jpeg` || "https://i.ebayimg.com/images/g/sUMAAOSw2qRmpkPZ/s-l1600.webp" }}
                  className="w-12 h-12 rounded-full bg-blue-400 items-center justify-center" />
                <View>
                  <Text className="font-bold text-base">{item.username}</Text>
                  <Text>HI</Text>
                </View>
              </View>
              <Ionicons name='chevron-forward' size={24} color={'black'} />
            </View>
          </TouchableOpacity>)

        }}
      />
    </SafeAreaView>
  );
}
