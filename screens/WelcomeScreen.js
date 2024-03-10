import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';
import { React, useState } from 'react'
import { Text, TextInput, View, TouchableOpacity } from 'react-native'

const WelcomeScreen = () => {
    const [name, setName] = useState('')
    const navigation = useNavigation();

    const enteredName = (text) => {
        setName(text)
    }

    const onSubmit = async () => {
        let user = {name: name}
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

            {name.trim().length >= 3 ? (
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

