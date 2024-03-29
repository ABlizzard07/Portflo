import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from './screens/WelcomeScreen';
import ActivitiesScreen from './screens/ActivitiesScreen';
import AddActivityScreen from './screens/AddActivityScreen';
import ProfileScreen from './screens/ProfileScreen';
import ActivityDetailScreen from './screens/ActivityDetailScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
// Sets up both Stack and Tab navigators

function Tabs({ user }) {
  return (
    <Tab.Navigator
      initialRouteName="See Activities"
      screenOptions={{
        headerShown: false,
        tabBarIcon: () => null,
        tabBarLabelStyle: { fontSize: 15, textAlign: 'center', paddingTop: 5, paddingBottom: 10},
      }}
    >
      <Tab.Screen name="See Activities">
        {props => <ActivitiesScreen {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Add Activity" component={AddActivityScreen} />
      <Tab.Screen name="My Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState({})
  
  const findName = async () => { 
    const result = await AsyncStorage.getItem('user')
    if (result !== null) {
        setUser(JSON.parse(result))
    } // Set user to what is stored in AsyncStorage
  }

  useEffect(() => {
    findName();
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user.name ? (
          <>
            <Stack.Screen name="Welcome">
              {props => <WelcomeScreen {...props} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen name="Home">
              {props => <Tabs {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
            <Stack.Screen name="AddActivity" component={AddActivityScreen} />
          </>
        ) : ( 
          <>
          <Stack.Screen name="Home">
            {props => <Tabs {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
          <Stack.Screen name="AddActivity" component={AddActivityScreen} />
          </> 
        )} 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
