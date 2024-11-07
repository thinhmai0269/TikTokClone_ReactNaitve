import { View, Image, Text, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, usePathname } from 'expo-router'
import Header from '@/components/header';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/utils/supabase';

export default function search() {
  const pathname = useLocalSearchParams();
  console.log(pathname)
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<any[]>([])
  const search = async () => {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('username', text)
    console.log('data search user', data)
    setResult(data)
  }
  return (
    <SafeAreaView >
      <View className='mt-8'>
        <Header
          title='Search'
          color='black'
          goBack
          search

        />
      </View>

      <View className="flex-row gap-2 mt-5 mx-3 items-center justify-between">
        <TextInput
          className=" p-4 rounded-3xl border ml-5 border-gray-300 w-5/6"
          placeholder="Search"
          onChangeText={setText}
          value={text}
        />
        <TouchableOpacity onPress={search} className='mt-2' disabled={loading || !text.trim()}>
          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <View className=''>
              <Ionicons
                name="chevron-forward"
                size={35}
                color={text.trim() ? "blue" : "gray"}
              />
            </View>
          )}
        </TouchableOpacity>

      </View>
      <FlatList
        // className="flex-1 w-full mx-5 mt-20"
        data={result}
        
        renderItem={({ item: user }) => (
          <View className="flex-row gap-2 items-start justify-start w-full mt-2 mx-4">
            <Image
              className="w-11 h-11 rounded-full bg-black"
              source={{ uri: 'https://default-url-to-image.jpg' }} // Adjust image source if needed
            />
            <View>
              <Text className="font-bold text-lg">{user?.username}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  )
}