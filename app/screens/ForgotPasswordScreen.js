import React, {Component} from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, ToastAndroid, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Profile from '../assets/images/profile';
import * as language from '../constants/languages';
import Feather from 'react-native-vector-icons/Feather';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import InnerPageHeader from '../components/InnerPageHeader';
import SpinnerComponent from '../components/SpinnerComponent';
import { EventRegister } from 'react-native-event-listeners';

export default class ForgotPasswordScreen extends React.Component{

	constructor(props) {
		super(props);

		this.state = {

            forgotDisabled: true,
            username: "",
            mobile: "",
            isLoading: false,

        };
    }
    
    async proceedForgot() {

        this.setState({ isLoading: true });

        if(this.state.username.trim() != "" && this.state.mobile.trim() != "" && this.state.mobile.length == 10 ) {

            setTimeout(() => {
                this.setState({
                    isLoading: false,
                });
                this.props.navigation.goBack(null);
            }, 1000);

        } else {

            ToastAndroid.show("Empty data field", ToastAndroid.LONG);

        }

    }

    async getUsername(text) {

        await this.setState({ 
            username: text
        })

		if((text.trim() != '') && (this.state.mobile.trim() != '') && (this.state.mobile.length == 10)) {
			await this.setState({
				forgotDisabled: false
			})
		} else {
			await this.setState({
				forgotDisabled: true
			})
		}

    }

    async getMobile(text) {

        await this.setState({ 
            mobile: text
        })

		if((text.trim() != '') && (this.state.username.trim() != '')) {
			await this.setState({
				forgotDisabled: false
			})
		} else {
			await this.setState({
				forgotDisabled: true
			})
		}

    }



	render() {
		return(
			<KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}} alwaysBounceVertical="false" showsVerticalScrollIndicator={false}>
                <SafeAreaView style = {{flex: 1}}>

                    {

                        this.state.isLoading == true ?

                        <SpinnerComponent />

                        :


                        <View style={{ flex: 1,paddingVertical: 20, paddingHorizontal: 20 , flexDirection: 'column'}}>

                            <View style={{alignItems: 'center'}}>
                                <View style={{...style.viewWrapper}}>
                                    <Text style={{...style.headingStyle}}>{language.forgotText}</Text>
                                    <View style={style.headingUnderline} />
                                    <Text style={{...style.loginTextStyle}}>{language.forgotPasswordFirstText}</Text>
                                    <Text style={{...style.loginTextStyle}}>{language.forgotPasswordSecondText}</Text>
                                </View>

                                <View style={{marginTop: 20, flexDirection: 'row'}}>
                                    <View style={{position:'absolute', left: 15, right: 0, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1, width: 45}}>
                                       <Feather name='user' size={20} color={language.primary}/>
                                    </View> 
                                    <View style={{flex: 1,borderRadius: 50,}}>
                                        <TextInput
                                            placeholder={language.username}
                                            underlineColorAndroid='transparent'
                                            returnKeyType="next"
                                            onSubmitEditing={() => { this.password.focus(); }}
                                            style={style.TextInputStyleClass}
                                            autoCapitalize={'none'}
                                            maxLength={15}
                                            onChangeText={(text) => this.getUsername(text)}/>
                                    </View>
                                </View>

                                <View style={{marginTop: 20, flexDirection: 'row'}}>
                                    <View style={{position:'absolute', left: 15, right: 0, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1, width: 45}}>
                                       <Feather name='lock' size={20} color={language.primary}/>
                                    </View> 
                                    <View style={{flex: 1,borderRadius: 50,}}>
                                        <TextInput
                                            placeholder={language.mobile}
                                            underlineColorAndroid='transparent'
                                            style={style.TextInputStyleClass}
                                            keyboardType = 'number-pad'
                                            returnKeyType="done"
                                            ref={(input) => { this.password = input; }}
                                            maxLength={10}
                                            onChangeText={(text) => this.getMobile(text)}/>
                                    </View>
                                </View>

                                <View style={{...style.viewWrapper}}>
                                     <View style={{flexDirection: 'row'}}>
                                        <Button
                                            title= "Cancel"
                                            buttonStyle={{borderRadius: 50, backgroundColor: '#f1f2f6', padding: 12}}
                                            titleStyle={{fontFamily: 'Gilroy-Light', marginLeft: 5, color: language.textColor}}
                                            containerStyle={{flex: 1, marginHorizontal: 2.5, }}
                                            onPress = {() => this.props.navigation.navigate('LoginScreen')}
                                        />

                                        <Button
                                            title={language.forgotLabel}
                                            disabled={this.state.forgotDisabled}
                                            buttonStyle={{borderRadius: 50, backgroundColor: language.primary, padding: 12}}
                                            titleStyle={{fontFamily: 'Gilroy-Light', marginLeft: 5, color: language.tertiary}}
                                            containerStyle={{flex: 1, marginHorizontal: 2.5, }}
                                            onPress={() => this.proceedForgot()}
                                        />

                                    </View>
                                </View>

                               
                            </View>

                        </View>

                    }
                     
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
		marginTop: 15
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
})