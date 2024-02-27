import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, TextInput, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const fetchActivities = async () => {
        const storedActivities = JSON.parse(await AsyncStorage.getItem('activities')) || [];
        setActivities(storedActivities);
      };
  
      fetchActivities();
    }, [])
  );

  const showDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const showItem = ({ item }) => (
    <TouchableOpacity>
      <View className="bg-white flex-1 p-3 mx-2 mb-5 text-base rounded-2xl text-center"
        style={{ 
        width: (Dimensions.get('window').width - 60) / 2 - 8, 
        height: (Dimensions.get('window').height - 40) / 5
        }}>
        <Text className="font-semibold">{item.title}</Text>
        <Text className="text-blue-500">{item.category}</Text>
        <Text>{showDate(new Date(item.startMonth))} -</Text>
        <Text>{showDate(new Date(item.endMonth))}</Text>
        <Text className="text-gray-500" numberOfLines={3}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredList = activities.filter(activity => 
    activity.title.toLowerCase().includes(search.toLowerCase()) || activity.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 items-center container bg-blue-100 px-5 pt-4">
      <Text className="text-center text-2xl pb-2 mt-8 font-semibold">{`${user.name}'s Portfolio`}</Text>
      
      <TextInput className="bg-white w-4/5 p-2 m-2 mb-5 text-base rounded-2xl text-center"
          placeholder="Search for an activity"
          onChangeText={keyword => setSearch(keyword)}
      ></TextInput>

      <FlatList className="w-full"
        data={filteredList}
        renderItem={showItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </View>
  );
}

export default HomeScreen;