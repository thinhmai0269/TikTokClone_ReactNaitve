import { Dimensions, FlatList, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/utils/supabase';
import VideoPlayer from '@/components/video';
import Header from '@/components/header';
import { useIsFocused } from '@react-navigation/native';

export default function VideoScreen() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const videoRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState<string | null>(null)
  const isForcus = useIsFocused();
  useEffect(() => {
    getVideo();
  }, [isForcus]);

  const getVideo = async () => {
    const { data, error } = await supabase
      .from('Video')
      .select('*, User(*)');

    if (error) {
      console.log("Error fetching videos:", error);
      return;
    }

    if (data) {
      getSignedUrls(data);
    }
  };

  const getSignedUrls = async (videos: any[]) => {
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

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
      <View className='absolute top-10 left-0 right-0 z-10'>
        <Header
          title='123'
          color='white'
          search
        />
      </View>

      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        snapToInterval={Dimensions.get('window').height}
        snapToStart
        decelerationRate={'fast'}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={e => setActiveIndex(e.viewableItems[0].key)}
        renderItem={({ item }) =>
          <VideoPlayer video={item} isViewable={activeIndex === item.id && isForcus} />
        }
      />

    </View>
  );
}
