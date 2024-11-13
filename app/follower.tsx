import Header from '@/components/header';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { Link, router, Stack } from 'expo-router';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native';


export default function () {
    const { followers } = useAuth();
    console.log(followers,'???')
    return (
        <SafeAreaView className='flex-1 mt-16'>
            <Header title='Chat' goBack color='black' />
            <FlatList
                data={followers}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push(`/user?user_id=${item.user_id}`)}
                        className="flex-row gap-2 items-start justify-start w-full m-1">
                        <View className='flex-row w-full justify-between items-center px-3'>
                            <View className='flex-row gap-2'>
                                <Image
                                    source={{ uri: "https://i.ebayimg.com/images/g/sUMAAOSw2qRmpkPZ/s-l1600.webp" }}
                                    className="w-12 h-12 rounded-full bg-blue-400 items-center justify-center" />
                                <View>
                                    <Text className="font-bold text-base">{item.User.username}</Text>
                                    <Text>HI</Text>
                                </View>
                            </View>
                            <Ionicons name='chevron-forward' size={24} color={'black'} />
                        </View>
                    </TouchableOpacity>
                )}
            />

        </SafeAreaView>
    );
}
