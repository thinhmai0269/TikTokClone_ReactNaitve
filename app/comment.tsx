import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/providers/AuthProvider';
import Message from '@/components/message';

export default function Comment() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      getComments();
    } else {
      router.back();
    }
  }, [user]);

  const getComments = async () => {
    const { data, error } = await supabase
      .from('Comment')
      .select('*, User(*)')
      .eq('video_id', params.video_id);

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data || []);
    }
  };

  const addComment = async (text:string) => {
    if (!text.trim() || !params.video_id || !user?.id) return;
    const { error } = await supabase
      .from('Comment')
      .insert({
        user_id: user.id,
        video_id: params.video_id,
        text,
        video_user_id: params.video_user_id,
      })
      .select();
    if (error) {
      console.error("Error occurred while inserting comment:", error);
    } else {
      getComments();
    }
  };

  return (
    <Message
      message={comments}
      addMessage={addComment}
    />
  );
}
