import { View, Text, SafeAreaView, TouchableOpacity, Image, Modal, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/header';

export default function ({
    message,
    addMessage
}: {
    message: any[],
    addMessage: (message: any) => void
}) {

    const [text, setText] = useState<string>('');
    const [loading, setLoading] = useState(false);
   
    console.log(message,"item")

    return (
        <KeyboardAvoidingView
            className='flex-1'
            behavior={Platform.OS === 'ios' ? "height" : 'padding'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView className="flex-1 items-center justify-center">
                    <View className="absolute top-5 left-0 right-0 z-10">
                        <Header
                            title="Comment"
                            color="black"
                            goBack
                        />
                    </View>

                    <FlatList
                        className="flex-1 w-full mx-5 mt-20"
                        data={message}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View className="flex-row gap-2 items-start justify-start w-full mt-2 mx-4">
                                <Image
                                    className="w-11 h-11 rounded-full bg-black"
                                    source={{ uri:  `${process.env.EXPO_PUBLIC__BUCKET}/avatar/${item.User.id}/avatar.jpeg`}}
                                />
                                <View>
                                    <Text className="font-bold text-lg">{item.User.username}</Text>
                                    <Text>{item.text}</Text>
                                </View>
                            </View>
                        )}
                    />

                    <View className="flex-row absolute bottom-5 right-0 left-0 z-10 justify-between">
                        <TextInput
                            className="bg-white p-4 rounded-3xl border ml-5 border-gray-300 w-5/6"
                            placeholder="Add a comment"
                            onChangeText={setText}
                            value={text}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                addMessage(text)
                                setText('')
                            }}
                            className='mt-2'
                        // disabled={loading || !text.trim()}
                        >
                            {/* {loading ? (
                                <ActivityIndicator size="large" color="blue" />
                            ) : ( */}
                            <Ionicons
                                name="chevron-forward"
                                size={50}
                                color={text.trim() ? "blue" : "gray"}
                            />
                            {/* )} */}
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
