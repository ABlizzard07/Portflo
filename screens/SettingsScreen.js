import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    const getName = async () => {
      let user = JSON.parse(await AsyncStorage.getItem('user'));
      setName(user ? user.name : '');
    };

    getName();
  }, []);

  const updateName = async (newName) => {
    setName(newName);
    let user = { name: newName };
    await AsyncStorage.setItem('user', JSON.stringify(user));
  };

  return (
    <View className="flex-1 items-center justify-center bg-blue-100 px-5 pt-4">
      <Text className="text-center text-2xl pb-2 mt-8 font-semibold">Settings</Text>
      <TextInput className="bg-white w-4/5 p-2 m-2 mb-5 text-xl rounded-2xl text-center"
        value={name}
        onChangeText={updateName}
        placeholder="Enter Your Name">
      </TextInput>
    </View>
  );
};

export default SettingsScreen;