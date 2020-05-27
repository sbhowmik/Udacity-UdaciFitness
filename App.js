import * as React from 'react'
import { View, Platform, StatusBar } from 'react-native'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import AddEntry from './components/AddEntry'
import History from './components/History'
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; //add option for createBottomTabNavigator for i0s
import { purple, white } from './utils/colors'
import Constants from 'expo-constants';
import { createStackNavigator } from '@react-navigation/stack';
import EntryDetail from './components/EntryDetail'
import Live from './components/Live'

//
function UdaciStatusBar ({ backgroundColor, ...props}) {
  return (
    <View style={{backgroundColor, height: Constants.statusBarHeight}}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

//config for Tab Navigation Routes
const TabInfos = {
  History:{
    name: "History",
    component: History,
    options: {tabBarIcon: ({tintColor}) => <Ionicons name='ios-bookmarks' size={30} color={tintColor} />, title: 'History'}
  }, 
  AddEntry:{
    component: AddEntry,
    name: "Add Entry",
    options: {tabBarIcon: ({tintColor}) => <FontAwesome name='plus-square' size={30} color={tintColor} />, title: 'Add Entry'}
  }, 
  Live:{
    component: Live,
    name: "Live",
    options: {tabBarIcon: ({tintColor}) => <FontAwesome name='ios-speedometer' size={30} color={tintColor} />, title: 'Live'}
  }
}

//Tab Navigator Config
const TabNavigatorConfig = {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === "ios" ? purple : white,
    style: {
      height: 56,
      backgroundColor: Platform.OS === "ios" ? white : purple,
      shadowColor: "rgba(0, 0, 0, 0.24)",
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
  }

//
const Tab = createMaterialTopTabNavigator()

//
const TabNav = () =>(
  <Tab.Navigator {...TabNavigatorConfig}>
      <Tab.Screen {...TabInfos['History']} />
      <Tab.Screen {...TabInfos['AddEntry']} />
      <Tab.Screen {...TabInfos['Live']} />
  </Tab.Navigator>
)

//STACK NAVIGATION
// Config for Stack Navigator
const StackNavigatorConfig = {
  headerMode: "screen"
}

//config for stack routes
const StackConfig = {
  TabNav:{
    name: "Home",
    component: TabNav,
    options: {headerShown: false}
  }, 
  EntryDetail:{
    name: "EntryDetail",
    component: EntryDetail,
    options: {
      headerTintColor: white,
      headerStyle:{
        backgroundColor: purple
      },
      title: "Entry Detail"
    }
  }
}
const Stack = createStackNavigator();
const MainNav = () =>(
  <Stack.Navigator {...StackNavigatorConfig}>
    <Stack.Screen {...StackConfig['TabNav']} />
    <Stack.Screen {...StackConfig['EntryDetail']} />
  </Stack.Navigator>
)

//
export default function App() {
  return (
    <Provider store={createStore(reducer)}>
      <UdaciStatusBar backgroundColor={purple} barStyle='light-content'/>
      <NavigationContainer>
        <MainNav />
      </NavigationContainer>
    </Provider>

  )
}