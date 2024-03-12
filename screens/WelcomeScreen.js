import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';
import { React, useState } from 'react'
import { Text, TextInput, View, TouchableOpacity } from 'react-native'

const WelcomeScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const navigation = useNavigation();

    const enteredName = (text) => {
        setName(text)
    }

    const enteredEmail = (text) => {
        setEmail(text)
    }

    const properEmail = (email) => {
        return /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email) // Regular expression to check for a valid email
    }

    const onSubmit = async () => {
        // Sets user name and email, stores user using AsyncStorage, and navigates to Home tab
        let user = {name: name, email: email}
        await AsyncStorage.setItem('user', JSON.stringify(user))
        navigation.navigate('Home')
    } 

    return (
        <View className="flex-1 items-center justify-center bg-blue-100">
            <TextInput className="bg-white w-4/5 p-2 m-2 mb-5 text-xl rounded-2xl text-center"
                value={name}
                onChangeText={enteredName}
                placeholder="Enter Your Name"
            ></TextInput>

            <TextInput className="bg-white w-4/5 p-2 m-2 mb-5 text-xl rounded-2xl text-center"
                value={email}
                onChangeText={enteredEmail}
                placeholder="Enter Your Email"
            ></TextInput>

            {name.trim().length >= 3 && properEmail(email) ? (
                <TouchableOpacity className="w-1/2 bg-blue-300 border-blue-500 border-2 m-2 p-4 rounded-2xl items-center"
                    onPress={onSubmit}
                >
                    <Text className="text-lg">Let's get started!</Text>
                </TouchableOpacity>
                ) : null
            }
        </View>
    )
}

export default WelcomeScreen

