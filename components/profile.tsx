import { Dimensions, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import VideoPlayer from '@/components/video';
import { ResizeMode, Video } from 'expo-av';
export default function Profile(
    {
        user,
        following,
        followers
    }: {
        user: any,
        following: any,
        followers: any,

    }
) {
    const { user: authUser, signOut, following: myFollowing, followers: myFollower, getFollowing } = useAuth()
    const [profilePicture, setProfilePicture] = useState<string>('')
    const [videos, setVideos] = useState<any[]>()
    const videoRef = useRef<Video>(null)
    
    useEffect(() => {
        getVideo();
    }, []);

    const getVideo = async () => {
        const { data, error } = await supabase
            .from('Video')
            .select('*, User(*)')
            .eq('user_id', user.id)
            .order('create_at', { ascending: false })
            .limit(3)
        if (error) {
            console.log("Error fetching videos:", error);
            return;
        }

        if (data) {
            getSignedUrls(data);
        }
    }; const getSignedUrls = async (videos: any[]) => {
        const videoPaths = videos.map((video) => video.uri); // Adjust if 'uri' isn't the correct field

        const { data, error } = await supabase
            .storage
            .from('videos')
            .createSignedUrls(videoPaths, 60 * 60 * 24 * 7);

        if (error) {
            console.error("Error creating signed URLs:", error);
            return;
        }

        const videoUrls = videos.map((item) => {
            item.signedUrl = data?.find((signedUrl) => signedUrl.path === item.uri)?.signedUrl;
            return item;
        });

        setVideos(videoUrls);
    };
    const pickImage = async () => {
        if (authUser?.id !== user.id) return;

        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.1,
        });

        // Check if result has assets before setting the profile picture
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setProfilePicture(result.assets[0].uri);
            saveImage(result.assets[0].uri)
        }
    };
    const saveImage = async (uri: string) => {

        const formData = new FormData();
        const fileName = uri?.split('/').pop();
        const extension = fileName?.split('.').pop();
        formData.append('file', {
            type: `image/${extension}`,
            name: `avatar.${extension}`,
            uri
        });

        // Upload the image to Supabase storage
        const { data, error: uploadError } = await supabase.storage
            .from(`avatar/${user.id}`)
            .upload(`avatar.${extension}`, formData, {
                cacheControl: '3600000000',
                upsert: false,
            });


    };
    const followUser = async () => {
        const { data, error } = await supabase
            .from('Follower')
            .insert({
                user_id: authUser?.id,
                follower_user_id: user.id,
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
            .eq('user_id', authUser?.id)
            .eq('follower_user_id', user.id)
        if (!error) {
            if (user?.id) {
                getFollowing(user.id);
            }

        }
    }

    return (
        <SafeAreaView className="flex-1 items-center mt-16">
            {/* <Text className="">{user?.username}</Text> */}
            <TouchableOpacity onPress={pickImage}>
                <Image
                    className="w-20 h-20 rounded-full bg-black "
                    source={{ uri: `${process.env.EXPO_PUBLIC__BUCKET}/avatar/${user.id}/avatar.jpeg` }}
                />
            </TouchableOpacity>

            <View className='py-3'>
                <Text className='text-lg font-semibold '>@{user.username}</Text>
            </View>

            <View className='flex-row items-center justify-around w-5/6'>
                <View className='justify-center items-center  mr-3'>
                    <Text className='text-lg font-semibold '>{following.length}</Text>
                    <Text className='text-lg'>following</Text>
                </View>
                <View className='justify-center items-center  mr-3'>
                    <Text className='text-lg font-semibold '>{followers.length}</Text>
                    <Text className='text-lg '>followers</Text>
                </View>
                <View className='justify-center items-center  mr-3'>
                    <Text className='text-lg font-semibold '>1000</Text>
                    <Text className='text-lg '>Likes</Text>
                </View>


            </View>
            <View >
                {
                    authUser?.id === user?.id ? (
                        <TouchableOpacity
                            className=" py-4 px-2 rounded-lg bottom-0"
                            onPress={
                                () => signOut()
                            }
                        >
                            <Text className='text-black font-semibold text-lg text-center mt-3'>Log out</Text>
                        </TouchableOpacity>
                    ) : (
                        <View>
                            {
                                myFollowing.filter((u: any) => u.follower_user_id === user.id).length > 0 ?
                                    (
                                        <TouchableOpacity className=' bg-green-500 rounded-full justify-center items-center w-20 p-2' onPress={unFollowUser}>
                                            <Text className='text-black font-semibold text-sm text-center'>Unfollow</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity className=' bg-red-500 rounded-2xl justify-center items-center w-20 p-2' onPress={followUser}>
                                            <Text className='text-black font-semibold text-sm text-center'>Follow</Text>
                                        </TouchableOpacity>
                                    )
                            }
                        </View>
                    )
                }
            </View>
            <FlatList
                numColumns={3}
                data={videos}
                scrollEnabled={false}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => (
                    <Video
                        ref={videoRef}
                        source={{ uri: item.signedUrl }}
                        style={{
                            width: Dimensions.get('screen').width * 0.333,
                            height: 250,
                        }}
                        resizeMode={ResizeMode.COVER}
                        isLooping
                    />
                )}
            />
        </SafeAreaView>
    );
}
