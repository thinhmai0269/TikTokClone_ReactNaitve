import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/utils/supabase';
import Profile from '@/components/profile';
export default function () {
  const { user, signOut, following, followers } = useAuth()
  const addProfilePicture = async () => {
    // const {data, error} = await supabase
    // .storage
    // .from('Profile')
    // .upload()
  }
  return (
    <Profile 
      user={user} 
      following={following}
      followers={followers}
    
    />
  );
}
