import { View, Text, Dimensions, Share, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ResizeMode, Video } from 'expo-av'
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { router } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/providers/AuthProvider';
import Header from './header';

export default function video({ video, isViewable }: { video: any, isViewable: boolean }) {
  const videoRef = useRef<Video>(null);
  const { user, likes, getLike, followers, getFollowers, following, getFollowing } = useAuth();

  if (user === null) {
    console.log('cc')
  }
  useEffect(() => {
    if (isViewable) {
      videoRef.current?.playAsync()
    } else {
      videoRef.current?.pauseAsync()
    }
  }, [isViewable])
  const shareVideo = () => {
    Share.share({
      message: `Check out this video: ${video.title}`
    })
  }
  const likeVideo = async () => {

    const { data, error } = await supabase
      .from('Like')
      .insert([
        {
          user_id: user?.id,
          video_id: video.id,
          video_user_id: video.User.id,
        },
      ])
      .select()
    if (!error) {
      if (user?.id) {
        getLike(user.id);
      }
      
    }
  }
  const unLikeVideo = async () => {

    const { data, error } = await supabase
      .from('Like')
      .delete()
      .eq('user_id', user?.id)
      .eq('video_id', video.id)
      .select()
      if (!error) {
        if (user?.id) {
          getLike(user.id);
        }
        
      }
  }
  const followUser = async () => {
    const { data, error } = await supabase
      .from('Follower')
      .insert({
        user_id: user?.id,
        follower_user_id: video.User.id,
      })
      .select()
      if (!error) {
        if (user?.id) {
          getFollowing(user.id);
        }
        
      }
  }
  const unFollowUser = async () => {
    const { data, error } = await supabase
      .from('Follower')
      .delete()
      .eq('user_id', user?.id)
      .eq('follower_user_id', video.User.id)
    if (!error) {
      if (user?.id) {
        getFollowing(user.id);
      }
      
    }
  }
  return (
    <SafeAreaView className=''>

      <Video
        ref={videoRef}
        source={{ uri: video.signedUrl }}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
        resizeMode={ResizeMode.COVER}
        isLooping
      />
      <View className='absolute bottom-12 left-0 z-10 w-full mb-4 p-4'>
        <View className='flex-1 flex-row items-end justify-between mt-4'>
          <View >
            <Text className='text-white text-2xl font-bold mt-18'>
              {video.User.username}
            </Text>
            <Text className='text-white text-lg font-semibold'>
              {video.title}
            </Text>
          </View>
          <View>
            <View className='mb-5'>
              <TouchableOpacity onPress={() => router.push(`/user?user_id=${video.User.id}`)} >
                <Ionicons name='person' size={40} color="white" className='borderwidth' />
              </TouchableOpacity >
              {
                following.filter((following: any) => following.follower_user_id === video.User.id).length > 0 ?
                  (
                    <TouchableOpacity className='absolute -bottom-3 left-6 bg-green-500 rounded-full justify-center items-center' onPress={unFollowUser}>
                      <Ionicons name='checkmark' size={24} color="white" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity className='absolute -bottom-3 left-6 bg-red-500 rounded-full justify-center items-center' onPress={followUser}>
                      <Ionicons name='add' size={24} color="white" />
                    </TouchableOpacity>
                  )
              }


            </View>
            {likes.filter((like: any) => like.video_id === video.id).length > 0 ?
              (
                <TouchableOpacity className='mt-4' onPress={unLikeVideo}>
                  <Ionicons name='heart' size={40} color="red" />
                </TouchableOpacity>
              )
              :
              (
                <TouchableOpacity className='mt-4' onPress={likeVideo}>
                  <Ionicons name='heart' size={40} color="white" />
                </TouchableOpacity>
              )
            }
            <TouchableOpacity className='mt-4' onPress={() => router.push(`/comment?video_id=${video.id}&video_user_id=${video.User.id}`)}>
              <Ionicons name='chatbubble-ellipses' size={40} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className='mt-4' onPress={shareVideo}>
              <FontAwesome name='share' size={40} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>

  )
}