import 'react-native-gesture-handler'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  MainScreen,
  PostScreen,
  BookedScreen,
  AboutScreen,
  CreateScreen,
  ChatScreen,
  SecondChatScreen,
} from '../screens'
import { THEME } from '../theme'

const Stack = createStackNavigator()
const screenOptionsConfig = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? THEME.MAIN_COLOR : '#fff',
  },
  headerTintColor: Platform.OS === 'android' ? '#fff' : THEME.MAIN_COLOR,
}
const PostNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionsConfig}>
      <Stack.Screen
        name='MainScreen'
        component={MainScreen}
        options={MainScreen.navigationOptions}
      />
      <Stack.Screen
        name='PostScreen'
        component={PostScreen}
        options={PostScreen.navigationOptions}
      />
    </Stack.Navigator>
  )
}
const BookedNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionsConfig}>
      <Stack.Screen
        name='BookedScreen'
        component={BookedScreen}
        options={BookedScreen.navigationOptions}
      />
      <Stack.Screen
        name='PostScreen'
        component={PostScreen}
        options={PostScreen.navigationOptions}
      />
    </Stack.Navigator>
  )
}
const Tab =
  Platform.OS === 'android' ? createMaterialBottomTabNavigator() : createBottomTabNavigator()

export const BottomNavigation = () => {
  return (
    <Tab.Navigator
      shifting={true}
      barStyle={{ backgroundColor: THEME.MAIN_COLOR }}
      tabBarOptions={{ activeTintColor: THEME.MAIN_COLOR }}
    >
      <Tab.Screen
        name='All'
        component={PostNavigation}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name='ios-albums' size={25} color={color} />,
        }}
      />
      <Tab.Screen
        name='Booked'
        component={BookedNavigation}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name='ios-star' size={25} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}
const AboutNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionsConfig}>
      <Stack.Screen
        name='AboutScreen'
        component={AboutScreen}
        options={AboutScreen.navigationOptions}
      />
    </Stack.Navigator>
  )
}
const ChatNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionsConfig}>
      <Stack.Screen
        name='ChatScreen'
        component={ChatScreen}
        options={ChatScreen.navigationOptions}
      />
    </Stack.Navigator>
  )
}
const SecondChatNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionsConfig}>
      <Stack.Screen
        name='SecondChatScreen'
        component={SecondChatScreen}
        options={SecondChatScreen.navigationOptions}
      />
    </Stack.Navigator>
  )
}
const CreateNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionsConfig}>
      <Stack.Screen
        name='CreateScreen'
        component={CreateScreen}
        options={CreateScreen.navigationOptions}
      />
    </Stack.Navigator>
  )
}
const Drawer = createDrawerNavigator()

export const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContentOptions={{
          activeTintColor: THEME.MAIN_COLOR,
          labelStyle: { fontFamily: 'roboto-bold' },
        }}
      >
        <Drawer.Screen name='SecondChat' component={SecondChatNavigation} />
        <Drawer.Screen name='Chat' component={ChatNavigation} />
        <Drawer.Screen name='Main' component={BottomNavigation} />
        <Drawer.Screen name='About' component={AboutNavigation} />
        <Drawer.Screen name='Create' component={CreateNavigation} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
