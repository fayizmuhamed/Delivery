import React, {Component} from 'react';
import { Text, SafeAreaView, StyleSheet, ToastAndroid } from 'react-native';
import { Tab, Tabs, TabHeading } from 'native-base';
import * as language from '../constants/languages';
import HeaderComponent from '../components/HeaderComponent';
import ProductListComponent from '../components/ProductListComponent';
import PickupListComponent from '../components/PickupListComponent';
import HistoryListComponent from '../components/HistoryListComponent';
import AsyncStorage from '@react-native-community/async-storage';
import { getPendingOrders, getHistoryOrders, getPickupOrders } from '../services/services';
import * as api from '../constants/services';
import { EventRegister } from 'react-native-event-listeners';

export default class HomeScreen extends React.Component{

	constructor(props) {
		super(props);

		this.state = {
			deliveryList: [],
			pickupList: [],
			historyList: [],
			isLoading: true,
			currentTab: 0
		};
	}


	componentDidMount() {
		this.deliveryListener = EventRegister.addEventListener('refreshdelivery', (data) => {
			this.getDeliveryData();
		});

		this.pickupListener = EventRegister.addEventListener('refreshpickup', (data) => {
			this.getPickUpData();
		});

		this.getDeliveryData();
	}


	componentWillUnmount() {

		EventRegister.removeEventListener(this.deliveryListener);
		EventRegister.removeEventListener(this.pickupListener);

	}

	async getDeliveryData() {

		this.token = await AsyncStorage.getItem('@access_token');
		await getPendingOrders(api.companyidValue , this.token).then((pendingOrder) => {
			console.log(pendingOrder,"pendingOrder");
			if(pendingOrder.statusCode === 200) {
				if(pendingOrder.data.status != "failed") {
					this.setState({ deliveryList: pendingOrder.data.data, isLoading: false });
				} else {
					ToastAndroid.show( pendingOrder.data.message, ToastAndroid.SHORT);
					this.setState({ isLoading: false });
				}
			} else {
				if(pendingOrder.statusCode === 401) {
					ToastAndroid.show(pendingOrder.data.message, ToastAndroid.SHORT);
					this.confirmLogout();
				} else {
					ToastAndroid.show( "Failed to fetch delivery orders, Please try again", ToastAndroid.SHORT);
					this.setState({ isLoading: false });
				}
			}

		}).catch((error) => {	
			this.setState({ isLoading: false });
			console.log(error,"error");
			ToastAndroid.show("Failed to fetch pending orders", ToastAndroid.SHORT);
		})

	}



	async getHistoryData() {

		this.token = await AsyncStorage.getItem('@access_token');
		await getHistoryOrders(api.companyidValue , this.token).then((historyOrder) => {
			console.log(historyOrder,"historyOrder");
			if(historyOrder.statusCode === 200) {
				if(historyOrder.data.status != "failed") {
					this.setState({ historyList: historyOrder.data.data, isLoading: false });
				} else {
					ToastAndroid.show( historyOrder.data.message, ToastAndroid.SHORT);
					this.setState({ isLoading: false });
				}
			} else {
				if(historyOrder.statusCode === 401) {
					ToastAndroid.show(historyOrder.data.message, ToastAndroid.SHORT);
					this.confirmLogout();
				} else {
					ToastAndroid.show( "Failed to fetch history orders, Please try again", ToastAndroid.SHORT);
					this.setState({ isLoading: false });
				}
			}

		}).catch((error) => {	
			this.setState({ isLoading: false });
			ToastAndroid.show("Failed to fetch history orders", ToastAndroid.SHORT);
		})


	}

	async getPickUpData() {

		this.token = await AsyncStorage.getItem('@access_token');
		await getPickupOrders(api.companyidValue , this.token).then((pickupOrders) => {
			console.log(pickupOrders,"pickupOrders");
			if(pickupOrders.statusCode === 200) {
				if(pickupOrders.data.status != "failed") {
					this.setState({ pickupList: pickupOrders.data.data, isLoading: false });
				} else {
					ToastAndroid.show( pickupOrders.data.message, ToastAndroid.SHORT);
					this.setState({ isLoading: false });
				}
			} else {
				if(pickupOrders.statusCode === 401) {
					ToastAndroid.show(pickupOrders.data.message, ToastAndroid.SHORT);
					this.confirmLogout();
				} else {
					ToastAndroid.show( "Failed to fetch pending orders, Please try again", ToastAndroid.SHORT);
					this.setState({ isLoading: false });
				}
			}

		}).catch((error) => {	
			this.setState({ isLoading: false });
			ToastAndroid.show("Failed to fetch pickup orders", ToastAndroid.SHORT);
		})

	}

	async confirmLogout() {

        await AsyncStorage.setItem('IS_LOGGGED_IN', '0');
        await AsyncStorage.removeItem('@access_token');
        EventRegister.emit('LOGGGED_IN', 0);

    }


	async onTabChange(index) {

		this.setState({ isLoading: true, currentTab: index.i })
		const temp = index.i;

		if(temp == 0) {
			console.log("delivery tab");
			this.getDeliveryData();
		} else if(temp == 1) {
			console.log("pickup tab");
			this.getPickUpData();
		} else {
			console.log("history tab");
			this.getHistoryData();
		}

	}

	render() {
		return(
			<SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
				<HeaderComponent title = {language.dashboard} />
                <Tabs onChangeTab={(i) => this.onTabChange(i)}
                    	style={{height: 'auto', flex: 1,}}
                    	tabBarUnderlineStyle={{backgroundColor: language.primary,  alignSelf: 'center', width:'2%', margin: 'auto', borderRadius: 15, marginHorizontal: '9%'}} > 
						<Tab heading={
							  <TabHeading style={{backgroundColor: '#fff', borderWidth: 0}}>
							    <Text style={{ fontFamily: 'Gilroy-Bold', color: '#515151'}}>{language.delivery}</Text>
							  </TabHeading>
							}
							style={{height: 'auto', backgroundColor: 'transparent'}}
							activeTabStyle= {{ backgroundColor:'#fff', borderTopLeftRadius: 10, }}
							tabStyle= {{backgroundColor: '#fff', borderTopLeftRadius: 10, }}>
								
                            <ProductListComponent index = "delivery" isLoading = {this.state.isLoading} orderData = {this.state.deliveryList} />   

						</Tab>
						<Tab heading={
							  <TabHeading style={{backgroundColor: '#fff'}}>
							    <Text style={{ fontFamily: 'Gilroy-Bold', color: '#515151'}}>{language.pickup}</Text>
							  </TabHeading>
							}
							style={{height: 'auto', backgroundColor: 'transparent',}}
							activeTabStyle= {{ backgroundColor:'#fff', }}
							tabStyle= {{backgroundColor: '#fff', }}>
    
							<PickupListComponent index = "pickup" isLoading = {this.state.isLoading} orderData = {this.state.pickupList} />   

						</Tab>
						<Tab heading={
							  <TabHeading style={{backgroundColor: '#fff'}}>
							    <Text style={{ fontFamily: 'Gilroy-Bold', color: '#515151'}}>{language.history}</Text>
							  </TabHeading>
							}
							style={{height: 'auto', backgroundColor: 'transparent', overflow: "hidden"}}
							activeTabStyle= {{ backgroundColor:'#fff', borderTopRightRadius: 10, }}
							tabStyle= {{backgroundColor: '#fff', borderTopRightRadius: 10}}>
    
							<HistoryListComponent index = "history" isLoading = {this.state.isLoading} orderData = {this.state.historyList} />   
									
						</Tab>
					</Tabs>
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
	}
})