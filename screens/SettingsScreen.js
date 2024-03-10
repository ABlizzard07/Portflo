import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const logout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.navigate('Welcome');
  };

  return (
    <View className="flex-1 items-center justify-center bg-blue-100 px-5 pt-4">
      <Text className="text-center text-2xl pb-2 mt-8 font-semibold">Settings</Text>
      <TouchableOpacity onPress={logout} className="bg-blue-300 p-2 m-2 rounded-2xl items-center">
        <Text className="text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;