import { View, Text, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Header from '@/components/header';
import Profile from '@/components/profile';
import { supabase } from '@/utils/supabase';

export default function UserProfile() {
  const params = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState<any>([])
  const [following, setFolloweing] = useState<any>([])
  const getUser = async () => {
    const { data, error } = await supabase.from('User').select('*').eq('id', params.user_id).single();
    if (error) {
      console.log("Error fetching user data:", error);
      return; // Exit the function if there's an error
    }
    console.log(data, 'getUserNguoiCuaVideo');
    setUser(data);
  };
  const getFollowers = async () => {
    const { data, error } = await supabase
      .from('Follower')
      .select('*')
      .eq('follower_user_id', params.user_id)
    if (error) return console.log(error, 'error at getFollowers')
    if (!error) setFolloweing(data)
    console.log('like', data)
  }
  const getFollowing = async () => {
    const { data, error } = await supabase
      .from('Follower')
      .select('*')
      .eq('user_id', params.user_id)
    if (error) return console.log(error, 'error at getFollowing')

    if (!error) setFolloweing(data)
    console.log('getFollowing', data)
  }
  useEffect(() => {
    getUser();
    getFollowers();
    getFollowing();  
  }, [params.user_id]);

  return (
    <SafeAreaView className="flex-1 mt-10">
      <Header
        title={`123`}
        color='black'
        goBack
      />
      {user ? ( // Render thông tin người dùng nếu tồn tại

        <Profile
          user={user}
          followers={followers}
          following={following}
        />

      ) : (
        <Text className="text-center mt-5">Đang tải dữ liệu...</Text>
      )}
    </SafeAreaView>
  );
}
