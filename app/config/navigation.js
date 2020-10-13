import React from 'react';
import { createDrawerNavigator, createStackNavigator, createSwitchNavigator  } from 'react-navigation';
import * as language from '../constants/languages';
import Icon from 'react-native-vector-icons/FontAwesome';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

import SideMenu from '../constants/SideBarComponent';

const HomeNavigation = createStackNavigator({
    HomeScreen: {screen: HomeScreen},
    ProductDetailScreen: {screen: ProductDetailScreen}
},
{
    headerMode: 'none',
})


export const DashboardNavigation = createDrawerNavigator({

    Dashboard : {
        screen: HomeNavigation,
        navigationOptions: () => ({
            title: language.dashboard,
            drawerIcon : ({ tintColor }) => <Icon name="home" size={20} color={tintColor}/>
        })
    },
    ChangePassword : {
        screen: ChangePasswordScreen,
        navigationOptions: () => ({
            title: language.changeText,
            drawerIcon : ({ tintColor }) => <Icon name="unlock-alt" size={20} color={tintColor}/>
        })
    },

},
{
    initialRouteName: 'Dashboard',
    contentComponent: SideMenu,
    contentOptions: {
        activeTintColor: language.primary,
        inactiveTintColor: language.black
    }

})


export const LoginNavigation = createSwitchNavigator({
    LoginScreen: { screen: LoginScreen },
    ForgotPasswordScreen: {screen: ForgotPasswordScreen }
},
{
    headerMode: 'none',
})

