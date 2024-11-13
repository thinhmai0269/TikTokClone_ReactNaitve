import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useIsFocused } from '@react-navigation/native';

export default function () {
    const [activity, setActivity] = useState([]);
    const { user } = useAuth();
    const isForcus = useIsFocused();
    useEffect(() => {
        getComments();
    }, [isForcus]);

    if (!user) return;

    const getComments = async () => {
        const { data, error } = await supabase
            .from('Comment')
            .select('*, User(*)')
            .eq('video_user_id', user.id)
            .order('create_at', { ascending: false })
            .limit(10);
        if (error) {
            console.error("Error fetching comments:", error);
        } else {
            getLike(data);
        }
    };

    const getLike = async (comments) => {
        const { data, error } = await supabase
            .from('Like')
            .select('*, User(*)')
            .eq('video_user_id', user.id)
            .order('create_at', { ascending: false })
            .limit(10);
        if (error) {
            console.error("Error fetching likes:", error);
        }
        setActivity(comments.concat(data));
    };

    return (
        <SafeAreaView className='flex-1 mt-16'>
            <Header title='Chat' goBack color='black' />
            <FlatList
                data={activity}
                renderItem={({ item }) => {
                    
                    return (
                        <View className="flex-row gap-2 items-start justify-start w-full m-1">
                            <View className='flex-row w-full justify-between items-center px-3'>
                                <View className='flex-row gap-2'>
                                    <Image
                                        source={{ uri: `${process.env.EXPO_PUBLIC__BUCKET}/avatar/${item.User.id}/avatar.jpeg` }}
                                        className="w-12 h-12 rounded-full bg-blue-400 items-center justify-center"
                                    />
                                    <View>
                                        <Text className="font-bold text-base">{item.User.username}</Text>
                                        <Text>{item.text || 'Liked your video'}</Text>
                                        <Text className='text-gray-500 text-xs'>{item.create_at}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                }}
            />
        </SafeAreaView>
    );
}
