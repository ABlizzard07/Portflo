import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Linking, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const getName = async () => {
      let user = JSON.parse(await AsyncStorage.getItem('user'));
      setName(user ? user.name : '');
    };

    getName();

    const getEmail = async () => {
      let user = JSON.parse(await AsyncStorage.getItem('user'));
      setEmail(user ? user.email : '');
    };

    getEmail();
  }, []);

  const updateName = async (newName) => {
    setName(newName);
    let user = JSON.parse(await AsyncStorage.getItem('user')) || {};
    user.name = newName;
    await AsyncStorage.setItem('user', JSON.stringify(user));
  };
  
  const updateEmail = async (newEmail) => {
    setEmail(newEmail);
    let user = JSON.parse(await AsyncStorage.getItem('user')) || {};
    user.email = newEmail;
    await AsyncStorage.setItem('user', JSON.stringify(user));
  }

  return (
    <View className="flex-1 items-center bg-blue-100 px-5 pt-4">
      <Text className="text-center text-2xl pb-2 mt-8 font-semibold">Settings</Text>
      <Text className="text-center text-xl pb-2 mt-4">Edit Profile</Text>
      <TextInput className="bg-white w-4/5 p-2 m-2 mb-2 text-lg rounded-2xl text-center"
        value={name}
        onChangeText={updateName}
        placeholder="Enter Your Name">
      </TextInput>

      <TextInput className="bg-white w-4/5 p-2 m-2 text-lg rounded-2xl text-center"
        value={email}
        onChangeText={updateEmail}
        placeholder="Enter Your Email">
      </TextInput>

      <Text className="text-center text-xl pb-2 mt-2">Get Help</Text>

      <TouchableOpacity className="w-1/2 bg-blue-300 border-blue-500 border-2 mt-4 p-2 rounded-2xl items-center" 
        onPress={Linking.openURL("https://instagram.com/portfloapp")}>
        <Text>Official Instagram Page</Text>
      </TouchableOpacity>

      <TouchableOpacity className="w-1/2 bg-blue-100 border-blue-500 border-2 mt-4 p-2 rounded-2xl items-center" 
        onPress={Linking.openURL("mailto:portfloapp@gmail.com")}>
        <Text>Email an inquiry</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;