import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/providers/AuthProvider';
import Message from '@/components/message';
import { useIsFocused } from '@react-navigation/native';

export default function Chat() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [message, setMessage] = useState<any[]>([]);
  const users_key = [user.id, params.chat_user_id].sort().join(':')
  const isForcus = useIsFocused();
  useEffect(() => {
    if (user) {
      getMessage();
    }
  }, [isForcus]);
  console.log(users_key)

  useEffect(() => {

    const handleInserts = (payload: any) => {
      console.log('Change received!', payload)
      getMessage()
    }
    const channel = supabase.channel(users_key)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Chat',
          filter: `users_key=eq.${users_key}`
        }, handleInserts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel).catch((error) => {
        console.error('Error removing channel:', error);
      });
    };
  }, [message, setMessage, users_key])

  const getMessage = async () => {
    const { data, error } = await supabase
      .from('Chat')
      .select('*, User(*)')
      .eq('users_key', users_key);

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setMessage(data || []);
    }
  };

  const addMessage = async (text: string) => {
    if (!text.trim() || !user?.id) return;
    console.log(text)
    const { data, error } = await supabase
      .from('Chat')
      .insert({
        user_id: user.id,
        chat_user_id: params.chat_user_id,
        text,
        users_key,
      })
      .select()

    if (error) {
      console.error("Error occurred while inserting comment:", error);
    } else {
      getMessage();
    }
  };

  return (
    <Message
      message={message}
      addMessage={addMessage}
    />
  );
}
