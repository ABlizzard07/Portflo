import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    const checkStarred = async () => {
      const allStarredActivities = JSON.parse(await AsyncStorage.getItem('starredActivities')) || [];
      setIsStarred(!!allStarredActivities.find(activity => activity.title === item.title));
    };
    checkStarred();
  }, []);

  const starActivity = async () => {
    const allStarredActivities = JSON.parse(await AsyncStorage.getItem('starredActivities')) || [];
    if (isStarred) {
      const newStarredActivities = allStarredActivities.filter(activity => activity.title !== item.title);
      await AsyncStorage.setItem('starredActivities', JSON.stringify(newStarredActivities));
    } else {
      allStarredActivities.push(item);
      await AsyncStorage.setItem('starredActivities', JSON.stringify(allStarredActivities));
    }
    setIsStarred(!isStarred);
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
        <TouchableOpacity className="w-1/2 bg-yellow-100 border-yellow-500 border-2 p-2 rounded-2xl items-center" onPress={starActivity}>
          <Text>Star Activity</Text>
        </TouchableOpacity>
      </View>

      
      
      <TouchableOpacity className="w-1/2 bg-blue-100 border-blue-500 border-2 mt-4 p-2 rounded-2xl items-center" onPress={() => navigation.goBack()}>
        <Text>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ActivityDetailScreen;