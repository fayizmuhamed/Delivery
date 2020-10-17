import React, {Component} from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, ToastAndroid, Image, Platform } from 'react-native';
import * as language from '../constants/languages';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Left, Body  } from 'native-base';
import { DrawerItems } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { getEmployeeInfo } from '../services/services';
import * as api from '../constants/services';
import Feather from 'react-native-vector-icons/Feather';
import { EventRegister } from 'react-native-event-listeners';

export default class SideBarComponent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            username: "",
            phone: "",
            userImage: "",
            isLoading: true
        }
    }
    
    componentDidMount() {

        this.getEmployeeInfo();

    }

    async signout() {

        ToastAndroid.show("Logged out", ToastAndroid.SHORT);
		await AsyncStorage.setItem('IS_LOGGGED_IN', '0');
		await AsyncStorage.removeItem('@access_token');
		EventRegister.emit('LOGGGED_IN', 0);

	}

    async getEmployeeInfo() {

		this.token = await AsyncStorage.getItem('@access_token');
		await getEmployeeInfo(api.companyidValue , this.token).then((employeeInfo) => {
			if(employeeInfo.statusCode === 200) {

                if(employeeInfo.data.status != "failed") {

                    this.setState({ 
                        username: employeeInfo.data.data.userName,
                        phone: employeeInfo.data.data.phoneNumber,
                        userImage: (employeeInfo.data.data.image != null) ? employeeInfo.data.data.image : "",
                        isLoading: false
                    })

                } else {
                    ToastAndroid.show( employeeInfo.data.message, ToastAndroid.SHORT);
                    this.setState({ isLoading: false });
                }
            } else {
                ToastAndroid.show( "Failed to fetch user info", ToastAndroid.SHORT);
                this.setState({ isLoading: false });
            }
		}).catch((error) => {	
            ToastAndroid.show("Failed to fetch user info", ToastAndroid.SHORT);
            this.setState({ isLoading: false });
        })

	}

	render() {
		return(
            <SafeAreaView style = {{ flex: 1 }}>
                <View style={{ height: 100, backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
                    <Left style={{flex:0.6, padding: 10, justifyContent: 'center', alignItems: 'center'}}>
                        {

                            this.state.userImage != "" ?
                                <Image source={{ uri: this.state.userImage }} style={{width: 50, height: 50, borderRadius: Platform.OS === 'ios' ? 200/2 : 200, overflow:'hidden' }} resizeMode="contain"/>
                            :
                                <Feather name="user" size={50} color = {language.primary} />

                        }

                    </Left>
                    <Body style={{flex:2, alignItems:'flex-start', justifyContent:'center'}}>
                        
                        {

                            this.state.isLoading === true ?

                            <ActivityIndicator size="small" color={language.primary} />

                            :
                            <View>
                                <Text style={{fontSize: 18, fontFamily: 'Gilroy-Bold', padding: 2}}>{this.state.username}</Text>
                                <Text style={{fontSize: 14, fontFamily: 'Gilroy-light', padding: 2}}>{(this.state.phone.length == 10) ? "+91" : null} {this.state.phone}</Text>
                            </View>

                        }

                    </Body>
                </View>
                <ScrollView style = {{}}>
                    <DrawerItems {...this.props} />
                    <TouchableOpacity onPress = {() => this.signout()}>
                        <View style={styles.item}>
                            <View style={styles.iconContainer}>

                                <Feather name="log-out" size={20} color={language.black}/>
                            </View>
                            <Text style={styles.label}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
		)
	}

}


const styles = StyleSheet.create({
    item: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      margin: 16,
      fontWeight: 'bold',
      color: language.black
    },
    iconContainer: {
      marginHorizontal: 16,
      width: 24,
      alignItems: 'center',
    },
    icon: {
      width: 24,
      height: 24,
    }
});


