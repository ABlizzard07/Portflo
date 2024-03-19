import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';

const ActivityDetailScreen = ({ route }) => {
  const { item } = route.params; // Gets the activity parameters from the route
  const navigation = useNavigation();

  // Formats start and end dates
  const formatStartDate = new Date(item.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const formatEndDate = new Date(item.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  const twitterShare = async () => {
    const message = `I took part in ${item.title} from ${formatStartDate} to ${formatEndDate}!. Here's what I did: 
    ${item.description}`; // Formats the activity properties into the message
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`; // Pre-populated a tweet with the message
    await WebBrowser.openBrowserAsync(url); // Open the URL
  };

  return (
    <View className="flex-1 items-center container bg-blue-100 px-5 pt-4">
      <Text className="text-2xl pb-2 mt-8 font-semibold">{item.title}</Text>
      <Text className="mt-4 text-lg">{item.category}</Text>
      <Text className="mt-4 text-lg">{formatStartDate} - {formatEndDate}</Text>
      <View className="mt-4 w-full border bg-white border-blue-500 p-10">
        <Text className="text-base text-center">{item.description}</Text>
      </View> 
      <View className="flex-row items-center mt-6 space-x-2">
        <TouchableOpacity className="w-1/2 bg-blue-300 border-blue-500 border-2 p-2 rounded-2xl items-center" onPress={twitterShare}>
          <Text>Brag on Twitter</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity className="w-1/2 bg-blue-100 border-blue-500 border-2 mt-4 p-2 rounded-2xl items-center" onPress={() => navigation.goBack()}>
        <Text>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ActivityDetailScreen;