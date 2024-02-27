import React from 'react';
import { View, Text } from 'react-native';

const SettingsScreen = () => {
 
  return (
    <View className="flex-1 container bg-blue-300 px-5 pt-4 items-center">
        <Text className="text-center text-2xl pb-2 mt-8 font-semibold">
            Settings
        </Text>
    </View>
  );
};

export default SettingsScreen;