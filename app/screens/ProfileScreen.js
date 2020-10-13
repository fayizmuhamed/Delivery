import React, {Component} from 'react';
import { Text, SafeAreaView, ScrollView, View, StyleSheet, TouchableOpacity, Platform, Linking, Modal, TextInput, ToastAndroid, Image } from 'react-native';
import * as language from '../constants/languages';
import InnerPageHeader from '../components/InnerPageHeader';
import Icon from 'react-native-vector-icons/Feather';
import SpinnerComponent from '../components/SpinnerComponent';
import { Button } from 'react-native-elements';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';
import { getEmployeeInfo } from '../services/services';
import * as api from '../constants/services';

export default class ProfileScreen extends React.Component{

	constructor(props) {
		super(props);

		this.state = {

			isLoading: true,
			username: "",
			phone: "",
			email: ""

        };
    }

    componentDidMount() {

        this.getEmployeeInfo();

    }

    async getEmployeeInfo() {

		this.token = await AsyncStorage.getItem('@access_token');
		await getEmployeeInfo(api.companyidValue , this.token).then((employeeInfo) => {
			console.log(employeeInfo,"empo");
			if(employeeInfo.statusCode === 200) {

                if(employeeInfo.data.status != "failed") {

                    this.setState({ 
                        username: employeeInfo.data.data.userName,
						phone: employeeInfo.data.data.phoneNumber,
						email: employeeInfo.data.data.email,
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


	async signout() {

		await AsyncStorage.setItem('IS_LOGGGED_IN', '0');
		await AsyncStorage.removeItem('@access_token');
		EventRegister.emit('LOGGGED_IN', 0);

	}

	render() {
		return(
			<SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
				<InnerPageHeader title = {language.profileScreen} />

                {
                    this.state.isLoading == true ?
                    
                        <SpinnerComponent />
                    
                    :

                    <ScrollView style={{flex: 1, paddingHorizontal: 15}} keyboardShouldPersistTaps={'always'}>
                        
                        <View style={{...style.cardWrapper, paddingBottom: 10}}>

							<View style={{flexDirection: 'row', padding: 5, marginBottom: 10}}>
                                <View style={{flex: 0.8}} >
									<Image source={require('../assets/images/Rectangle275.png')} style={{width: 100, height: 100, borderRadius: 5}} resizeMode="contain"/>
                                </View>

                                <View style={{ flex: 1}}>
                                    <View style={{flexDirection: 'row', padding: 2}}>
                                        <View style={{flex: 1, alignItems: 'flex-start'}}>
                                            <Text style={{fontFamily: 'Gilroy-Bold'}}>{language.profileName}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', padding: 2}}>
                                        <Text>{this.state.username}</Text>
                                    </View>
									<View style={{flexDirection: 'row' , padding: 2}}>
                                        <View style={{flex: 1, alignItems: 'flex-start'}}>
                                            <Text style={{fontFamily: 'Gilroy-Bold'}}>{language.profileEmail}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', padding: 2}}>
                                        <Text>{this.state.email}</Text>
                                    </View>
									<View style={{flexDirection: 'row' , padding: 2}}>
                                        <View style={{flex: 1, alignItems: 'flex-start'}}>
                                            <Text style={{fontFamily: 'Gilroy-Bold'}}>{language.profileContact}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', padding: 2}}>
                                        <Text>+91 {this.state.phone}</Text>
                                    </View>
                                </View>
                            </View>
						
                        </View>

						<View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'center'}}>
							<View style={{flex: 1}}>
								<Button 
									title={language.signout}
									buttonStyle={{backgroundColor: '#f7f7f7', borderRadius: 10}}
									titleStyle={{fontFamily: 'Gilroy-Bold', color: language.black}}	
									onPress={() => this.signout()}
								/>
							</View>
						</View>

                    </ScrollView>

                }

			</SafeAreaView>
		)
	}

}

const style = StyleSheet.create({
	cardWrapper: {
		padding: 10,
		borderRadius: 10,
		borderColor: '#f1f2f6',
		backgroundColor: '#f7f7f7',
		elevation: 0,
		borderWidth: 1,
		marginTop: 20,
	},
	cardHeaderWrapper: {
		flexDirection: 'row',
		padding: 10,
		paddingVertical: 15,
		flex: 1
	},
	iconWrapper: {
		backgroundColor: language.primary,
		borderRadius: 10,
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center'
    },
    sourceTabelDataSWrapper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
    },
    footerWrapper: {
		paddingVertical: 20,
		paddingHorizontal: 10,
		backgroundColor: '#fff',
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
    },
    TextInputStyleClass:{
		padding: 10,
		height: 45,
		borderWidth: 1,
		borderColor: '#d3d3d3',
		borderRadius: 20 ,
		backgroundColor : "#FFFFFF",
	},

})