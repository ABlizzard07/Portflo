import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Linking, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [name, setName] = useState('');
  const [gradYear, setGradYear] = useState('')
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [GPA, setGPA] = useState('');
  const [weightedGPA, setWeightedGPA] = useState('');
  const [satScore, setSatScore] = useState('');
  const [actScore, setActScore] = useState('');
  const [classRank, setClassRank] = useState('');

  useEffect(() => {
    const getUserInfo = async () => {
      let user = JSON.parse(await AsyncStorage.getItem('user')) || {};
      setName(user.name || '');
      setGradYear(user.gradYear || '');
      setEmail(user.email || '');
      setSchool(user.school || '');
      setGPA(user.GPA || '')
      setSatScore(user.satScore || '');
      setActScore(user.actScore || '');
      setClassRank(user.classRank || '');
    };

    getUserInfo();
  }, []);

  const updateInfo = async (property, value) => {
    let user = JSON.parse(await AsyncStorage.getItem('user')) || {};

    if (property == 'name' && value.length < 3) {
      alert('Name must be at least 3 characters long.');
      setName(user.name || '');
      return;
    }
  
    if (property == 'email' && !/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(value)) {
      alert('Email is invalid.');
      setEmail(user.email || '');
      return;
    }
  
    if (property == 'satScore' && ((value < 400 || value > 1600) || !Number.isInteger(Number(value) )) ) {
      alert('SAT score must be an integer between 400 and 1600.');
      setSatScore(user.satScore || '');
      return;
    }
  
    if (property == 'actScore' && ((value < 1 || value > 36) || !Number.isInteger(Number(value) )) ) {
      alert('ACT score must be an integer between 1 and 36.');
      setActScore(user.actScore || '');
      return;
    }
  
    if (property == 'gradYear' && ((value < 2020 || value > 2099) || !Number.isInteger(Number(value) )) ) {
      alert('Graduation year must be an integer between 2020 and 2099.');
      setGradYear(user.gradYear || '');
      return;
    }

    user[property] = value;
    await AsyncStorage.setItem('user', JSON.stringify(user));
  };

  return (
    <View className="flex-1 items-center bg-blue-100 px-5 pt-4">
      <Text className="text-center text-2xl pb-2 mt-8 font-semibold">Settings</Text>

      <View className="flex-row justify-between space-x-1">
        <TextInput className="bg-white w-2/5 p-2 m-2 mb-2 text-sm rounded-2xl text-center"
          value={name}
          onChangeText={value => { setName(value); updateInfo('name', value); }}
          placeholder="Enter Your Name">
        </TextInput>

        <TextInput className="bg-white w-3/5 p-2 m-2 text-sm rounded-2xl text-center"
          value={email}
          onChangeText={value => { setEmail(value); updateInfo('email', value); }}
          placeholder="Enter Your Email">
        </TextInput>
      </View>

      <View className="flex-row justify-between space-x-1">
        <TextInput className="bg-white w-3/5 p-2 m-2 text-sm rounded-2xl text-center"
          value={school}
          onChangeText={value => { setSchool(value); updateInfo('school', value); }}
          placeholder="Enter Your School">
        </TextInput>

        <TextInput className="bg-white w-2/5 p-2 m-2 text-sm rounded-2xl text-center"
          value={gradYear}
          onChangeText={value => { setGradYear(value); }}
          onBlur={() => { updateInfo('gradYear', gradYear); }}
          placeholder="Graduation Year">
        </TextInput>
      </View>

      <View className="flex-row justify-between space-x-1">
        <TextInput className="bg-white w-1/2 p-2 m-2 text-sm rounded-2xl text-center"
          value={GPA}
          onChangeText={value => { setGPA(value); updateInfo('GPA', value); }}
          placeholder="GPA">
        </TextInput>

        <TextInput className="bg-white w-1/2 p-2 m-2 text-sm rounded-2xl text-center"
          value={classRank}
          onChangeText={value => { setClassRank(value); updateInfo('classRank', value); }}
          placeholder="Class Rank">
        </TextInput>
      </View>

      <View className="flex-row justify-between space-x-1">
        <TextInput className="bg-white w-1/2 p-2 m-2 text-sm rounded-2xl text-center"
          value={satScore}
          onChangeText={value => { setSatScore(value); }}
          onBlur={() => { updateInfo('satScore', satScore); }}
          placeholder="SAT Score">
        </TextInput>

        <TextInput className="bg-white w-1/2 p-2 m-2 text-sm rounded-2xl text-center"
          value={actScore}
          onChangeText={value => { setActScore(value); }}
          onBlur={() => { updateInfo('actScore', actScore); }}
          placeholder="ACT Score">
        </TextInput>
      </View>

      <Text className="text-center text-xl mt-2">Get Help</Text>

      <View className="flex-row justify-between space-x-3">
        <TouchableOpacity className="w-1/2 bg-blue-300 border-blue-500 border-2 mt-4 p-2 rounded-2xl items-center" 
          onPress={() => Linking.openURL("https://instagram.com/portfloapp")}>
          <Text>Official Instagram Page</Text>
        </TouchableOpacity>

        <TouchableOpacity className="w-1/2 bg-blue-100 border-blue-500 border-2 mt-4 p-2 rounded-2xl items-center" 
          onPress={() => Linking.openURL("mailto:portfloapp@gmail.com")}>
          <Text>Email an inquiry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;