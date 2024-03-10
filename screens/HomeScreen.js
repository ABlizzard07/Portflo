import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, TextInput, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [deletedActivities, setDeletedActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchActivities = async () => {
        let storedActivities = JSON.parse(await AsyncStorage.getItem('activities')) || [];
        storedActivities = storedActivities.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
        setActivities(storedActivities);
  
        let storedDeletedActivities = JSON.parse(await AsyncStorage.getItem('deletedActivities')) || [];
        storedDeletedActivities = storedDeletedActivities.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
        setDeletedActivities(storedDeletedActivities);
      };
  
      fetchActivities();
    }, [])
  );

  const handleShowDeleted = () => {
    setShowDeleted(!showDeleted);
  };

  const navigation = useNavigation();

  const deleteActivity = async (item) => {
    const storedActivities = JSON.parse(await AsyncStorage.getItem('activities')) || [];
    const newActivities = storedActivities.filter(activity => activity.title !== item.title);
    await AsyncStorage.setItem('activities', JSON.stringify(newActivities));
    setActivities(newActivities);
  
    const storedDeletedActivities = JSON.parse(await AsyncStorage.getItem('deletedActivities')) || [];
    storedDeletedActivities.push(item);
    await AsyncStorage.setItem('deletedActivities', JSON.stringify(storedDeletedActivities));
    setDeletedActivities(storedDeletedActivities);
  };

  const restoreActivity = async (item) => {
    const storedDeletedActivities = JSON.parse(await AsyncStorage.getItem('deletedActivities')) || [];
    const newDeletedActivities = storedDeletedActivities.filter(activity => activity.title !== item.title);
    await AsyncStorage.setItem('deletedActivities', JSON.stringify(newDeletedActivities));
    setDeletedActivities(newDeletedActivities);

    const storedActivities = JSON.parse(await AsyncStorage.getItem('activities')) || [];
    storedActivities.push(item);
    await AsyncStorage.setItem('activities', JSON.stringify(storedActivities));
    setActivities(storedActivities);
  }

  const deleteActivityPermanent = async (item) => {
    const storedDeletedActivities = JSON.parse(await AsyncStorage.getItem('deletedActivities')) || [];
    const newDeletedActivities = storedDeletedActivities.filter(activity => activity.title !== item.title);
    await AsyncStorage.setItem('deletedActivities', JSON.stringify(newDeletedActivities));
    setDeletedActivities(newDeletedActivities);
  }

  const showItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
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
        ) : 
        Alert.alert(
          "What do you want to do?",
          "",
          [
            {
              text: "Edit",
              onPress: () => navigation.navigate('Add Activity', { editMode: true, activity: item })
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
      <View className="bg-white flex-1 p-3 mx-2 mb-5 text-base rounded-2xl text-center"
        style={{ 
        width: (Dimensions.get('window').width - 60) / 2 - 8, 
        }}>
        <Text className="font-semibold">{item.title}</Text>
        <Text className="text-blue-500">{item.category}</Text>
        <Text>{item.startDate} -</Text>
        <Text>{item.endDate}</Text>
        <Text className="text-gray-500" numberOfLines={3}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredList = activities.filter(activity => 
    activity.title.toLowerCase().includes(search.toLowerCase()) || activity.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 items-center container bg-blue-100 px-5 pt-4">
      <Text className="text-center text-2xl pb-2 mt-8 mb-2 font-semibold">{`${user.name}'s Portfolio`}</Text>
      
      <View className="flex-row items-center">
        <TextInput className="bg-white w-4/5 p-2 mr-2 text-base rounded-2xl text-center"
          placeholder="Search for an activity"
          onChangeText={keyword => setSearch(keyword)}
        ></TextInput>
        <TouchableOpacity onPress={handleShowDeleted}>
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
        <Text className="w-4/5 mt-4 text-center">There are no deleted activities. Click on an activity to delete it!</Text>
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

export default HomeScreen;