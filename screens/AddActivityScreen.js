import React, { useState } from 'react';
import { View, TextInput, Text, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddActivityScreen = ({ route }) => {
  const { editItem } = route.params || {};
  const navigation = useNavigation();

  const [title, setTitle] = useState(editItem ? editItem.title : '');
  const [category, setCategory] = useState(editItem ? editItem.category : '');
  const [startDate, setStartDate] = useState(editItem ? new Date(editItem.startDate) : new Date());
  const [endDate, setEndDate] = useState(editItem ? new Date(editItem.endDate) : new Date());
  const [description, setDescription] = useState(editItem ? editItem.description : '');

  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const [categories] = useState(
    ['Academic', 'Sports', 'Performing Arts', 'Internships/Jobs', 'Clubs/Organizations',
      'Volunteering', 'Test Scores', 'Personal Projects', 'Competitions', 'Certifications', 'Research', 'Other']
    );
    

  const onStartChange = (event, selectedDate) => {
    setShowStartCalendar(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndChange = (event, selectedDate) => {
    setShowEndCalendar(false);
    if (selectedDate) {
      if (selectedDate >= startDate) {
        setEndDate(selectedDate);
      } else {
        Alert.alert('Invalid date', 'End date must be after start date.');
      }
    }
  };

  const showDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const onSubmit = async () => {
    // Checks if inputs are valid
    if (title.trim().length > 20) {
      Alert.alert('Invalid title', 'Title cannot extend 20 characters.');
      return;
    } else if (!title.trim() || !category || !description.trim() || !startDate || !endDate) {
      Alert.alert('Invalid input', 'A field is missing.');
      return;
    }
    
    // If editItem exists, update the activity
    if (editItem) {
      const allActivities = JSON.parse(await AsyncStorage.getItem('activities')) || [];
      const index = allActivities.findIndex(activity => activity.title === editItem.title);
      allActivities[index] = {
        title,
        description,
        category,
        startDate,
        endDate
      };
      await AsyncStorage.setItem('activities', JSON.stringify(allActivities));
      Alert.alert('Form verified', 'Your activity has been updated!');

      navigation.navigate('Home');

    } else {  
        const newActivity = {
          title,
          description,
          category,
          startDate,
          endDate
        };
    
        const allActivities = JSON.parse(await AsyncStorage.getItem('activities')) || [];
        allActivities.push(newActivity);
        await AsyncStorage.setItem('activities', JSON.stringify(allActivities));
    
        Alert.alert('Form verified', 'Your activity has been submitted!');
        onClear();
    }
  };

  const onClear = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setStartDate(new Date());
    setEndDate(new Date());
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 container bg-blue-100 px-5 pt-4 items-center">
        <Text className="text-center text-2xl pb-2 mt-8 font-semibold">
          Add an Activity
        </Text>
        <TextInput className="bg-white w-4/5 p-2 m-2 text-xl rounded-2xl text-center"
          placeholder="Activity Title"
          value={title}
          onChangeText={setTitle}
        />
        <View className="w-4/5">
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Choose a Category" value="" />
            {categories.map((cat, index) => (
              <Picker.Item key={index} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity className="w-2/5 p-2 bg-blue-200" onPress={() => setShowStartCalendar(true)}>
            <Text className="font-semibold">Select Start Date</Text>
          </TouchableOpacity>
          <Text className="p-2">{showDate(startDate)}</Text>
        </View>

        {showStartCalendar && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onStartChange}
          />
        )}

        <View className="flex-row items-center mb-2">
          <TouchableOpacity className="w-2/5 p-2 bg-blue-200" onPress={() => setShowEndCalendar(true)}>
            <Text className="font-semibold">Select End Date</Text>
          </TouchableOpacity>
          <Text className="p-2">{showDate(endDate)}</Text>
        </View>

        {showEndCalendar && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onEndChange}
          />
        )}

        <TextInput className="bg-white w-full p-2 m-2 h-16 text-lg text-center"
          placeholder="Description"
          value={description}
          blurOnSubmit
          onChangeText={setDescription}
          multiline
          scrollEnabled
        />

        <Text>Character count: {description.trim().length}</Text>

        <View className="flex-row justify-center gap-x-3.5">
          <TouchableOpacity onPress={onSubmit}>
            <Text className="text-center text-lg w-full p-2 m-2 rounded-2xl bg-blue-500 text-white">
              Submit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClear}>
            <Text className="text-center text-lg w-full p-2 m-2 rounded-2xl bg-red-500 text-white">
              Clear
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddActivityScreen;