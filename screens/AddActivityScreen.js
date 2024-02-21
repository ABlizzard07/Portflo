import React, { useState } from 'react';
import { View, TextInput, Text, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AddActivityScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['Academic', 'Sports', 'Performing Arts', 'Work Experience', 'Clubs', 'Other'];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 items-center container bg-blue-300 px-5 pt-4">
        <Text className="text-center text-2xl pb-2 mt-10 font-semibold">
        Add an Activity</Text>
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
            {categories.map((category, index) => (
              <Picker.Item key={index} label={category} value={category} />
            ))}
          </Picker> 
        </View>
        <TextInput className="bg-white w-4/5 p-2 m-2 mb-5 text-lg text-center"
          placeholder="Description"
          value={description}
          blurOnSubmit
          onChangeText={setDescription}
          multiline
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddActivityScreen;