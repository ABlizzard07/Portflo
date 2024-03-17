import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddActivityScreen = ({ route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const [categories] = useState(
    ['Academics', 'Sports', 'Performing Arts', 'Internships and Work Experience', 'Clubs and Organizations',
    'Test Scores', 'Personal Projects', 'Competitions', 'Certifications', 'Research', 'Other']
    );

  useEffect(() => {
    if (route.params?.editMode && route.params?.activity) {
      const { title, description, category, startDate, endDate } = route.params.activity;
      setTitle(title);
      setDescription(description);
      setCategory(category);
      setStartDate(new Date(startDate));
      setEndDate(new Date(endDate));
    }
  }, [route.params?.activity]);


  const handleStartChange = (event, selectedDate) => {
    setShowStartCalendar(false);
    if (selectedDate) {
      selectedDate.setHours(12)
      setStartDate(selectedDate);
    }
  };

  const handleEndChange = (event, selectedDate) => {
    setShowEndCalendar(false);
    if (selectedDate) {
      selectedDate.setHours(12)
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
    if (title.trim().length > 20) {
      Alert.alert('Invalid title', 'Title cannot extend 20 characters.');
      return;
    } else if (!title.trim() || !category || !description.trim() || !startDate || !endDate) {
      Alert.alert('Invalid input', 'Please choose a category.');
      return;
    }

    const newActivity = {
      title,
      description,
      category,
      startDate: showDate(startDate),
      endDate: showDate(endDate)
    };

    const storedActivities = JSON.parse(await AsyncStorage.getItem('activities')) || [];
    storedActivities.push(newActivity);
    await AsyncStorage.setItem('activities', JSON.stringify(storedActivities));

    Alert.alert('Form verified', 'Your activity has been submitted!');
    onClear();
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
          <TextInput className="bg-white w-4/5 p-2 m-2 mb-3 text-xl rounded-2xl text-center"
            placeholder="Activity Title"
            value={title}
            onChangeText={setTitle}
          />
          <View className="w-3/5">
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
            <TouchableOpacity className="w-3/5" onPress={() => setShowStartCalendar(true)}>
              <Text className="font-semibold">Select Start Date</Text>
            </TouchableOpacity>
            <Text>{showDate(startDate)}</Text>
          </View>

          {showStartCalendar && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartChange}
            />
          )}

          <View className="flex-row mb-3">
            <TouchableOpacity className="w-3/5" onPress={() => setShowEndCalendar(true)}>
              <Text className="font-semibold">Select End Date</Text>
            </TouchableOpacity>
            <Text>{showDate(endDate)}</Text>
          </View>

          {showEndCalendar && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndChange}
            />
          )}

          <TextInput className="bg-white w-full p-2 m-2 h-36 mb-3 text-lg text-center"
            placeholder="Description"
            value={description}
            blurOnSubmit
            onChangeText={setDescription}
            multiline
            scrollEnabled
          />
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