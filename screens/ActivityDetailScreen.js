import React from 'react';
import { Text, View, TouchableOpacity, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ActivityDetailScreen = ({ route }) => {
  const { item } = route.params;
  const navigation = useNavigation();

  return (
    <View className="flex-1 items-center container bg-blue-100 px-5 pt-4">
      <Text className="text-2xl pb-2 mt-8 font-semibold">{item.title}</Text>
      <Text className="mt-4 text-lg">{item.category}</Text>
      <Text className="mt-4 text-lg">{item.startDate} - {item.endDate}</Text>
      <Text className="mt-4 text-base">{item.description}</Text>
      <TouchableOpacity className="w-1/2 bg-blue-300 border-blue-500 border-2 mt-6 p-2 rounded-2xl items-center" onPress={() => navigation.goBack()}>
        <Text>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ActivityDetailScreen;