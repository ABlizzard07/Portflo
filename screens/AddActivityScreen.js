import React, { useState } from 'react';
import { View, TextInput, Text, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddActivityScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startMonth, setStartMonth] = useState(new Date());
  const [endMonth, setEndMonth] = useState(new Date());
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const categories = ['Academic', 'Sports', 'Performing Arts', 'Work Experience', 'Clubs', 'Other'];

  const handleStartChange = (event, selectedDate) => {
    setShowStartCalendar(false);
    if (selectedDate) {
      setStartMonth(selectedDate);
    }
  };

  const handleEndChange = (event, selectedDate) => {
    setShowEndCalendar(false);
    if (selectedDate) {
      if (selectedDate >= startMonth) {
        setEndMonth(selectedDate);
      } else {
        Alert.alert('Invalid date', 'End date must be after start date.');
      }
    }
  };

  const showDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const handleSubmit = async () => {
    if (!title.trim() || title.trim().length > 15) {
      Alert.alert('Invalid input', 'Please enter a valid title.');
      return;
    } else if (!category) {
      Alert.alert('Invalid input', 'Please choose a category.');
      return;
    } else if (!description.trim()) {
      Alert.alert('Invalid input', 'Please enter a description.');
      return;
    } else if (startMonth > endMonth) {
      Alert.alert('Invalid date', 'End date must be after start date.');
      return;
    }

    const newActivity = {
      title,
      description,
      category,
      startMonth,
      endMonth,
    };

    const storedActivities = JSON.parse(await AsyncStorage.getItem('activities')) || [];
    storedActivities.push(newActivity);
    await AsyncStorage.setItem('activities', JSON.stringify(storedActivities));

    Alert.alert('Form verified', 'All fields are valid.');
    handleClear();
  };

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setStartMonth(new Date());
    setEndMonth(new Date());
  };

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 container bg-blue-300 px-5 pt-4 items-center">
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
              <Text>Select Start Date</Text>
            </TouchableOpacity>
            <Text>{showDate(startMonth)}</Text>
          </View>
          {showStartCalendar && (
            <DateTimePicker
              value={startMonth}
              mode="date"
              display="default"
              onChange={handleStartChange}
            />
          )}
          <View className="flex-row mb-3">
            <TouchableOpacity className="w-3/5" onPress={() => setShowEndCalendar(true)}>
              <Text>Select End Date</Text>
            </TouchableOpacity>
            <Text>{showDate(endMonth)}</Text>
          </View>
          {showEndCalendar && (
            <DateTimePicker
              value={endMonth}
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
            <TouchableOpacity onPress={handleSubmit}>
              <Text className="text-center text-lg w-full p-2 m-2 rounded-2xl bg-blue-500 text-white">
                Submit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClear}>
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