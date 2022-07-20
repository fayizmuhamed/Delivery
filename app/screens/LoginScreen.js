import React, { Component } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, ToastAndroid, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Feather from 'react-native-vector-icons/Feather';
import Profile from '../assets/images/profile';
import * as language from '../constants/languages';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';
import { loginUser } from '../services/services';
import * as api from '../constants/services';


export default class LoginScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

			username: "",
			password: "",
			loading: false

		}
	}

	async getUsername(text) {
		await this.setState({
			username: text
		})
	}

	async getPassword(text) {
		await this.setState({
			password: text
		})
	}

	async proceedLogin() {

		this.setState({ loading: true })


		if (this.state.username.trim() != "" && this.state.password.trim() != "") {

			await loginUser(api.companyidValue, this.state.username, this.state.password).then((loginData) => {
				console.log(loginData, "loginData");
				if (loginData.statusCode === 200 ) {

					this.setState({ loading: false });
					ToastAndroid.show("Success !!", ToastAndroid.SHORT);
					AsyncStorage.setItem('@access_token', loginData.data.access_token);
					AsyncStorage.setItem('IS_LOGGGED_IN', '1');
					EventRegister.emit('LOGGGED_IN', 1);

				} else {

					ToastAndroid.show(loginData.data.error, ToastAndroid.SHORT);
					this.setState({ loading: false });

				}

			}).catch((error) => {

				console.log(error, 'error login');
				this.setState({ loading: false });
				ToastAndroid.show("Error in login", ToastAndroid.SHORT);

			})

		} else {

			ToastAndroid.show("Required field empty", ToastAndroid.SHORT);
			this.setState({ loading: false })

		}

	}


	render() {

		return (
			<KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} alwaysBounceVertical="false" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
				<SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, flexDirection: 'column' }}>


					<View style={{ alignItems: 'center' }}>
						<View style={{ justifyContent: 'center' }}>
							<View style={{ backgroundColor: language.primary, justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 17 }}>
								<Feather name="user" color={language.tertiary} size={40} />
							</View>
						</View>
						<View style={{ ...style.viewWrapper }}>
							<Text style={{ ...style.headingStyle }}>{language.loginText}</Text>
							<View style={style.headingUnderline} />
							<Text style={{ ...style.loginTextStyle }}>{language.loginFirstText}</Text>
							<Text style={{ ...style.loginTextStyle }}>{language.loginSecondText}</Text>
						</View>

						<View style={{ marginTop: 20, flexDirection: 'row' }}>
							<View style={{ position: 'absolute', left: 15, right: 0, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1, width: 45 }}>
								<Feather name='user' size={20} color={language.primary} />
							</View>
							<View style={{ flex: 1, borderRadius: 50, }}>
								<TextInput
									placeholder={language.username}
									underlineColorAndroid='transparent'
									returnKeyType="next"
									style={style.TextInputStyleClass}
									autoCapitalize={'none'}
									keyboardType={'number-pad'}
									maxLength={15}
									blurOnSubmit={false}
									onSubmitEditing={() => { this.secondTextInput.focus(); }}
									onChangeText={(text) => this.getUsername(text)} />
							</View>
						</View>
						<View style={{ marginTop: 20, flexDirection: 'row' }}>

							<View style={{ position: 'absolute', left: 15, right: 0, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1, width: 45 }}>
								<Feather name='lock' size={20} color={language.primary} />
							</View>
							<View style={{ flex: 1, borderRadius: 50, }}>
								<TextInput
									placeholder={language.password}
									underlineColorAndroid='transparent'
									style={style.TextInputStyleClass}
									autoCapitalize={'none'}
									returnKeyType="done"
									maxLength={15}
									ref={(input) => { this.secondTextInput = input; }}
									secureTextEntry={true}
									onChangeText={(text) => this.getPassword(text)} />
							</View>
						</View>

						<View style={{ ...style.viewWrapper }}>
							<TouchableOpacity style={style.button} onPress={() => this.proceedLogin()} title={language.loginLabel}>{this.state.loading === true ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={style.buttonText}>{language.loginLabel}</Text>}</TouchableOpacity>
						</View>

						<View style={{ ...style.viewWrapper }}>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPasswordScreen')}>
								<Text style={{ ...style.loginTextStyle }}>{language.forgotpassword}</Text>
							</TouchableOpacity>
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
		marginTop: 30
	},
	TextInputStyleClass: {
		padding: 10,
		paddingHorizontal: 45,
		height: 45,
		borderWidth: 1,
		borderColor: '#d3d3d3',
		borderRadius: 20,
		backgroundColor: "#FFFFFF",
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