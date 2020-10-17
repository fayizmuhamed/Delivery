import React, {Component} from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, ToastAndroid, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as language from '../constants/languages';
import Feather from 'react-native-vector-icons/Feather';
import InnerPageHeader from '../components/InnerPageHeader';
import SpinnerComponent from '../components/SpinnerComponent';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';
import { changePassword } from '../services/services';
import * as api from '../constants/services';

export default class ChangePasswordScreen extends React.Component{

	constructor(props) {
		super(props);

		this.state = {

            cpDisabled: true,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            isLoading: false,

        };
    }
    
    async proceedCP() {

        this.setState({ isLoading: true });

        if(this.state.oldPassword.trim() != "" && this.state.newPassword.trim() != "" &&  this.state.confirmPassword.trim() != "") {

            if(this.state.newPassword == this.state.confirmPassword ) {

                this.token = await AsyncStorage.getItem('@access_token');
                await changePassword(api.companyidValue , this.token, this.state.oldPassword, this.state.newPassword).then((passwordData) => {
                    if(passwordData.statusCode === 200) {
                        if(passwordData.data.status != "failed") {
                            this.setState({ isLoading: false });
                            ToastAndroid.show("Password Changed Succesfully, Please Log in", ToastAndroid.LONG);    
                            this.confirmLogout();
                        } else {
                            ToastAndroid.show( passwordData.data.message, ToastAndroid.SHORT);
                            this.setState({ isLoading: false });
                        }
                    } else {
                        ToastAndroid.show( "Failed to change password", ToastAndroid.SHORT);
                        this.setState({ isLoading: false });
                    }

                }).catch((error) => {	
                    this.setState({ isLoading: false });
                    ToastAndroid.show("Failed to change password", ToastAndroid.SHORT);
                })

            } else {
    
                ToastAndroid.show("Password Doesn't Match", ToastAndroid.LONG);
                this.setState({ isLoading: false });

            }

        } else {

            ToastAndroid.show("Required field empty", ToastAndroid.LONG);
            this.setState({ isLoading: false });

        }

    }

    async confirmLogout() {

        await AsyncStorage.setItem('IS_LOGGGED_IN', '0');
        await AsyncStorage.removeItem('@access_token');
        EventRegister.emit('LOGGGED_IN', 0);

    }

    async getOldPassword(text) {

        await this.setState({ 
            oldPassword: text
        })

    }

    async getNewPassword(text) {

        await this.setState({ 
            newPassword: text
        })

    }

    async confirmPassword(text) {

        await this.setState({ 
            confirmPassword: text
        })

    }


	render() {
		return(
			<KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}} alwaysBounceVertical="false" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                <SafeAreaView style = {{flex: 1}}>

                    <InnerPageHeader title = {language.changeText} />

                        <View style={{ flex: 1,paddingVertical: 5, paddingHorizontal: 20 , flexDirection: 'column'}}>

                            <View style={{alignItems: 'center'}}>
                                <View style={{...style.viewWrapper}}>
                                    {/* <Text style={{...style.headingStyle}}>{language.changeText}</Text>
                                    <View style={style.headingUnderline} /> */}
                                    <Text style={{...style.loginTextStyle}}>{language.changePasswordFirstText}</Text>
                                    <Text style={{...style.loginTextStyle}}>{language.changePasswordSecondText}</Text>
                                </View>

                                <View style={{marginTop: 20, flexDirection: 'row'}}>
                                    <View style={{position:'absolute', left: 15, right: 0, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1, width: 45}}>
                                         <Feather name='lock' size={20} color={language.primary}/>
                                    </View> 
                                    <View style={{flex: 1,borderRadius: 50,}}>
                                        <TextInput
                                            placeholder={language.oldPassword}
                                            underlineColorAndroid='transparent'
                                            style={style.TextInputStyleClass}
                                            autoCapitalize={'none'}
                                            returnKeyType="next"
                                            maxLength={15}
                                            secureTextEntry = {true}
                                            blurOnSubmit={false}
									        onSubmitEditing={() => { this.firstTextInput.focus(); }}
                                            onChangeText={(text) => this.getOldPassword(text)}/>
                                    </View>
                                </View>

                                <View style={{marginTop: 20, flexDirection: 'row'}}>
                                    <View style={{position:'absolute', left: 15, right: 0, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1, width: 45}}>
                                         <Feather name='lock' size={20} color={language.primary}/>
                                    </View> 
                                    <View style={{flex: 1,borderRadius: 50,}}>
                                        <TextInput
                                            placeholder={language.newPassword}
                                            underlineColorAndroid='transparent'
                                            style={style.TextInputStyleClass}
                                            autoCapitalize={'none'}
                                            returnKeyType="next"
                                            maxLength={15}
                                            secureTextEntry = {true}
                                            blurOnSubmit={false}
									        onSubmitEditing={() => { this.secondTextInput.focus(); }}
                                            ref={(input) => { this.firstTextInput = input; }}
                                            onChangeText={(text) => this.getNewPassword(text)}/>
                                    </View>
                                </View>

                                <View style={{marginTop: 20, flexDirection: 'row'}}>
                                    <View style={{position:'absolute', left: 15, right: 0, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1, width: 45}}>
                                         <Feather name='lock' size={20} color={language.primary}/>
                                    </View> 
                                    <View style={{flex: 1,borderRadius: 50,}}>
                                        <TextInput
                                            placeholder={language.confirmPassword}
                                            underlineColorAndroid='transparent'
                                            style={style.TextInputStyleClass}
                                            autoCapitalize={'none'}
                                            returnKeyType="done"
                                            maxLength={15}
                                            secureTextEntry = {true}
                                            ref={(input) => { this.secondTextInput = input; }}
                                            onChangeText={(text) => this.confirmPassword(text)}/>
                                    </View>
                                </View>

                                <View style={{...style.viewWrapper}}>
                                    <TouchableOpacity style={style.button} onPress={() => this.proceedCP()} title={language.cpLabel}>{ this.state.isLoading === true ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={style.buttonText}>{language.cpLabel}</Text>}</TouchableOpacity>
                                </View>
                            </View>

                        </View>

                     
                </SafeAreaView>
            </KeyboardAwareScrollView>
		)
	}

}

const style = StyleSheet.create({
	headingStyle: {
		fontFamily: 'Gilroy-Bold',
		color: language.textColor,
		fontSize: 22,
	},
	viewWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 25
	},
	TextInputStyleClass:{
		padding: 10,
		paddingHorizontal: 45,
		height: 45,
		borderWidth: 1,
		borderColor: '#d3d3d3',
		borderRadius: 20 ,
		backgroundColor : "#FFFFFF",
	},
	loginTextStyle: {
		fontSize: 13,
		marginTop: 5
	},
	headingUnderline: {
		borderColor: language.primary,
		borderBottomWidth: 5,
		width: '15%',
		borderRadius: 15,
		marginVertical: 5
    },
    button: {
		backgroundColor: language.primary,
		borderRadius: 15, 
		paddingVertical: 10,
		paddingHorizontal: 25
	},
	buttonText: {
		fontFamily: 'Gilroy-Bold', 
		color: language.tertiary
	}
})