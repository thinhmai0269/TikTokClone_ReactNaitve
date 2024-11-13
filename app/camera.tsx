import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/utils/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av'
export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false)
  const [videouri, setVideouri] = useState<string>()
  const cameraRef = useRef<CameraView>(null)
  const videoRef = useRef<Video>(null)
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState({ isLoading: false, isPlaying: false })
  const accessPermission = async () => {
    const cameraStatus = await requestPermission(); // Request camera permission
    const microphoneStatus = await requestMicrophonePermission(); // Request microphone permission

    if (!cameraStatus.granted || !microphoneStatus.granted) {
      // Handle the case where either permission is denied
      console.log('Permissions for camera or microphone not granted');
      return;
    }
    console.log('Camera and Microphone permissions granted');
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    setVideouri(result.assets[0].uri);
  };

  // Check if permissions are still loading
  if (!permission || !microphonePermission) {
    return <View />;
  }

  // Check if either permission is not granted
  if (!permission.granted || !microphonePermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access the camera and microphone</Text>
        <Button onPress={accessPermission} title="Grant Permissions" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  const recordVideo = async () => {
    if (isRecording) {
      setIsRecording(false)
      cameraRef.current?.stopRecording();
    } else {
      setIsRecording(true)
      const Video = await cameraRef.current?.recordAsync();
      setVideouri(Video?.uri)
    }
  }
  const saveVideo = async () => {

    const formData = new FormData();
    const fileName = videouri?.split('/').pop();

    formData.append('file', {
      uri: videouri,
      type: `video/${videouri?.split('.').pop()}`,
      name: fileName,
    });

    // Upload the video to Supabase storage
    const { data, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileName, formData, {
        cacheControl: '3600000000',
        upsert: false,
      });

    if (uploadError) {
      console.log('Upload error:', uploadError);
      return;
    }

    console.log(data, 'cechk');
  
    const { error: insertError, data: dataAfterInsert } = await supabase.from('Video').insert({
      title: 'test title here',
      uri: data.path,
      user_id: user?.id,
    })
    .select();


    console.log('Insert error:', insertError, 'dataAfterInsert', dataAfterInsert);
    console.log('User ID:', user?.id);


    // Navigate back after successful save
    router.back();
  };
  return (
    <View className='flex-1'>
      {videouri ? (
        <View className='flex-1'>
          <TouchableOpacity className='absolute bottom-16 left-41 right-40 z-10' onPress={saveVideo}>
            <Ionicons name="checkmark-circle" size={50} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className='flex-1' onPress={() => status.isPlaying ? videoRef.current?.pauseAsync() :
            videoRef.current?.playAsync()}>
            <Video
              ref={videoRef}
              source={{
                uri: videouri

              }}
              style={{
                flex: 1,
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height
              }}
              resizeMode={ResizeMode.COVER}
              isLooping
              onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView mode='video' ref={cameraRef} style={styles.camera} facing={facing}>
          <View className='flex-1  flex-row justify-around mb-10 content-center' >
            <TouchableOpacity className=' items-end  justify-end  ' onPress={pickImage}>
              <Ionicons name="aperture" size={45} color="white" />
            </TouchableOpacity>
            {videouri ? (
              <TouchableOpacity className='items-end justify-end ' onPress={saveVideo}>
                <Ionicons name="checkmark-circle" size={100} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className='items-end justify-end ' onPress={recordVideo}>
                {!isRecording ? <Ionicons name="radio-button-on" size={100} color="white" /> : <Ionicons name="pause-circle" size={100} color="red" />}
              </TouchableOpacity>
            )}

            <TouchableOpacity className=' items-end justify-end ' onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={45} color="white" />
            </TouchableOpacity>

          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
