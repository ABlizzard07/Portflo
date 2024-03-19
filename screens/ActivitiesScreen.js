import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, TextInput, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ActivitiesScreen = () => {
  const [activities, setActivities] = useState([]);
  const [deletedActivities, setDeletedActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [user, setUser] = useState({ name: '' });

  // Performs these actions every time the Home screen is focused
  useFocusEffect(
    React.useCallback(() => {

      const getUser = async () => {
        let storedUser = JSON.parse(await AsyncStorage.getItem('user')); // Gets the user from AsyncStorage
        setUser(storedUser ? storedUser : { name: '' }); 
        // Sets user name to an empty string if it does not exist
      };

      getUser();

      const getActivities = async () => {
        let allActivities = JSON.parse(await AsyncStorage.getItem('activities')) || []; 
        // Gets the activities from AsyncStorage
        
        setActivities(allActivities); 
        // Sets activities to the stored activities or an empty array if no activity exists
  
        let allDeletedActivities = JSON.parse(await AsyncStorage.getItem('deletedActivities')) || [];
        setDeletedActivities(allDeletedActivities);
      };
  
      getActivities();
    }, [])
  );

  const handleShowDeleted = () => {
    setShowDeleted(!showDeleted); // Toggles between showing and not showing deleted activities
  };

  const navigation = useNavigation();

  const deleteActivity = async (item) => {
    // Deletes activity from activities and adds it to deletedActivities
    const allActivities = JSON.parse(await AsyncStorage.getItem('activities')) || [];
    const newActivities = allActivities.filter(activity => activity.title !== item.title);
    await AsyncStorage.setItem('activities', JSON.stringify(newActivities));
    setActivities(newActivities);
  
    const allDeletedActivities = JSON.parse(await AsyncStorage.getItem('deletedActivities')) || [];
    allDeletedActivities.push(item);
    await AsyncStorage.setItem('deletedActivities', JSON.stringify(allDeletedActivities));
    setDeletedActivities(allDeletedActivities);
  };

  const restoreActivity = async (item) => {
    // Restores activity from deletedActivities and brings it back to activities
    const allDeletedActivities = JSON.parse(await AsyncStorage.getItem('deletedActivities')) || [];
    const newDeletedActivities = allDeletedActivities.filter(activity => activity.title !== item.title);
    await AsyncStorage.setItem('deletedActivities', JSON.stringify(newDeletedActivities));
    setDeletedActivities(newDeletedActivities);

    const allActivities = JSON.parse(await AsyncStorage.getItem('activities')) || [];
    allActivities.push(item);
    await AsyncStorage.setItem('activities', JSON.stringify(allActivities));
    setActivities(allActivities);
  }

  const deleteActivityPermanent = async (item) => {
    // Permanently deletes activity 
    const allDeletedActivities = JSON.parse(await AsyncStorage.getItem('deletedActivities')) || [];
    const newDeletedActivities = allDeletedActivities.filter(activity => activity.title !== item.title);
    await AsyncStorage.setItem('deletedActivities', JSON.stringify(newDeletedActivities));
    setDeletedActivities(newDeletedActivities);
  }

  const showItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      // Show these options if activity is deleted
      {showDeleted ? 
        Alert.alert(
          "What do you want to do?",
          "",
          [
            {
              text: "Restore",
              onPress: () => restoreActivity(item)
            },
            {
              text: "Delete",
              onPress: () => deleteActivityPermanent(item)
            }
          ]
        ) // Show these options if activity is not deleted
        : 
        Alert.alert(
          "What do you want to do?",
          "",
          [
            {
              text: "Edit",
              onPress: () => navigation.navigate('AddActivity', { editItem: item })
            },            
            {
              text: "View",
              onPress: () => navigation.navigate('ActivityDetail', { item })
            },
            {
              text: "Delete",
              onPress: async () => deleteActivity(item)
            }
          ]
        );
      }
    }}>
      <View className="bg-white flex-0.5 p-3 mx-2 mb-3 text-base rounded-2xl text-center"
        style={{ 
        width: (Dimensions.get('window').width - 60) / 2 - 8, 
        height: (Dimensions.get('window').height) / 5
        }}>
        <Text className="font-semibold">{item.title}</Text>
        <Text className="text-blue-500">{item.category}</Text>
        <Text>{new Date(item.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} -</Text>
        <Text>{new Date(item.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        <Text className="text-gray-500" numberOfLines={3}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredList = 
    activities.filter(activity => 
    activity.title.toLowerCase().includes(search.toLowerCase()) || 
    activity.description.toLowerCase().includes(search.toLowerCase()) ||
    activity.category.toLowerCase().includes(search.toLowerCase()) ||
    new Date(activity.startDate).toLocaleDateString(undefined, 
    { year: 'numeric', month: 'long', day: 'numeric' }).toLowerCase().includes(search.toLowerCase()) ||
    new Date(activity.endDate).toLocaleDateString(undefined, 
    { year: 'numeric', month: 'long', day: 'numeric' }).toLowerCase().includes(search.toLowerCase())
    );

  return (
    <View className="flex-1 items-center container bg-blue-100 px-5 pt-4">
      <Text className="text-center text-xl pb-2 mt-4 mb-2 font-semibold">{user.name ? `${user.name}'s Activities` : `My Activities`}</Text>
      
      <View className="flex-row items-center">
        <TextInput className="bg-white w-3/5 p-2 mr-2 text-sm rounded-2xl text-center"
          placeholder="Search for an activity"
          onChangeText={keyword => setSearch(keyword)}
        ></TextInput>
        <TouchableOpacity className="mr-2" onPress={handleShowDeleted}>
          <AntDesign name="delete" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {showDeleted ? (
        deletedActivities.length > 0 ? (
          <FlatList className="w-full mt-4"
            data={deletedActivities}
            renderItem={showItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
        ) : (
        <Text className="w-4/5 mt-4 text-center">There are no deleted activities. Click on the Trash icon again to see all activities!</Text>
        )
      ) : (
        filteredList.length > 0 ? (
          <FlatList className="w-full mt-4"
            data={filteredList}
            renderItem={showItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
        ) : (
          <Text className="w-4/5 mt-4 text-center">You have no activities. Go to Add Activity to create a new one!</Text>
        )
      )}

    </View>
  );
}

export default ActivitiesScreen;