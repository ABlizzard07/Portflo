import React, { useState } from 'react';
import { Text, View, TextInput, } from 'react-native';

const HomeScreen = ({ user }) => {
  return (
    <View className="flex-1 items-center container bg-blue-100 px-5 pt-4">
      <Text className="text-center text-2xl pb-2 mt-10 font-semibold">{`${user.name}'s Portfolio`}</Text>
      
      <TextInput className="bg-white w-4/5 p-2 m-2 mb-5 text-base rounded-2xl text-center"
          placeholder="Search for an activity"
      ></TextInput>

    </View>
  );
}

export default HomeScreen;