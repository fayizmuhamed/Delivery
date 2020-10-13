import React, { Component } from 'react';
import { View, StatusBar, AppState } from 'react-native';
import { LoginNavigation, DashboardNavigation }  from './config/navigation';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';
import { fontfix } from './config/fontfix';
import NetInfo from "@react-native-community/netinfo";
import SpinnerNetwork from 'react-native-loading-spinner-overlay';
import NoNetworkComponent from './components/NoNetworkComponent';
import SplashScreen from 'react-native-splash-screen';
import * as language from './constants/languages';

export default class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {

			value: 0,
			isConnected: true,
			appState: AppState.currentState,
			isLoading:true,

		};

		fontfix()

	}

	componentWillMount() {
		this.checkLoggedState();
		this.listener = EventRegister.addEventListener('LOGGGED_IN', (data) => {
			console.log("listener");
            this.setState({
                value: data,
            })
		})
		
		AppState.addEventListener('change', this._handleAppStateChange);
		// get the network information on load
		const watchNetwork = NetInfo.addEventListener(state => {
			this.setState({
				isConnected: state.isConnected
			})
		});
	}

	// handle network with app state
	_handleAppStateChange = (nextAppState) => {
		if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			const watchNetwork = NetInfo.addEventListener(state => {
				this.state.isConnected = state.isConnected;
			});
		}
		this.setState({appState: nextAppState});
	};

	// network overlay
	renderOvelayLoading() {

	return(
		<View style={{flex: 1, width: '100%'}}>
			<NoNetworkComponent />
		</View>
	)
	}
	
	componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
    } 

	async checkLoggedState() {
		const storgeValue = await AsyncStorage.getItem('IS_LOGGGED_IN');
		this.setState({
			value: storgeValue
		})
		SplashScreen.hide();
	}

	render() {

		if(this.state.value == 1) {

			return(

				<View style={{flex: 1}}>
					<StatusBar backgroundColor={language.primary} />
					<DashboardNavigation />
					{
						this.state.isConnected == false ?
							<SpinnerNetwork
								visible={!this.state.isConnected}
								customIndicator = {this.renderOvelayLoading()}
							/>
						:
							null
					}
				</View>

			)

		}

		return(
			
			<View style={{flex: 1}}>
				<StatusBar backgroundColor={language.primary} />
				<LoginNavigation />
				{
                    this.state.isConnected == false ?
                         <SpinnerNetwork
                            visible={!this.state.isConnected}
                            customIndicator = {this.renderOvelayLoading()}
                        />
                    :
                        null
                }
			</View>

		)

	}

}