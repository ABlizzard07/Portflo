import { React } from 'react'
import { KeyboardAvoidingView, Text, TextInput, View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { useEffect, useState } from 'react'
import auth from "@react-native-firebase/auth"
import db from "@react-native-firebase/database"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
        if (user) {
            navigation.replace("Home")
        }
    })

    return unsubscribe
    }, [])

    const handleSignUp = () => {
        auth()
        .createUserWithEmailAndPassword(email, 'SuperSecretPassword!')
        .then(() => {
          console.log('User account created & signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }
      
          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }
      
          console.error(error);
        });
    }

    /* const handleLogin = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
      })
      .catch(error => alert(error.message))
    } */

    return (
        <KeyboardAvoidingView className="flex-1 justify-center items-center">
            <View className="w-4/5">
                <TextInput className="bg-white p-2 m-2 rounded-2xl text-center"
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                ></TextInput>
                <TextInput className="bg-white p-2 m-2 mb-5 rounded-2xl text-center"
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={text => setPassword(text)}
                ></TextInput>
            </View>

            <View className="w-1/2">
                <TouchableOpacity className="bg-blue-300 border-blue-500 border-2 m-2 p-4 rounded-2xl items-center"
                  /*  onPress={handleLogin} */
                >
                    <Text>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white m-2 p-4 rounded-2xl items-center"
                    onPress={handleSignUp}
                >
                    <Text>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Login

