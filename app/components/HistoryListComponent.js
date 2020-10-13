import React, {Component} from 'react';
import { Text, ScrollView, View, StyleSheet, TouchableOpacity, Linking, Platform, ToastAndroid } from 'react-native';
import * as language from '../constants/languages';
import SpinnerComponent from  './SpinnerComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import Communications from 'react-native-communications';
import { withNavigation } from 'react-navigation';
import PhoneCallComponent from './PhoneCallComponent';
import Moment from 'moment';

class HistoryListComponent extends React.Component{

	constructor(props) {
		super(props);

		this.state = {
			selectedIndex: 0,
			isCallModal: false
		};
	}

	// open map
	openMaps(lat,log) {
		if(lat != 0 && log != 0) {
			if(Platform.OS === 'android') {
				Linking.openURL('google.navigation:q=' + lat + ',' + log)
			} else {
				Linking.openURL('maps://app?saddr='+ lat +'+'+ log +'&daddr='+ lat +'+'+ log)
			}
		} else {
			ToastAndroid.show( "Invalid Location Info", ToastAndroid.SHORT);
		}
	}

	async detailScreen(mode, orderId, type) {

        if(type == "DELIVERY") {

            this.props.navigation.navigate('ProductDetailScreen', { mode: mode, orderId: orderId, type: type });

        } else {

            this.props.navigation.navigate('ProductDetailScreen', { mode: mode, returnId: orderId, type: type });

        }

	}

	async phoneCall(nbr) {

		Communications.phonecall(nbr, true);

	}


	render() {
		return(

			<View style={{flex: 1}}>
				{
					this.props.isLoading == true ?
						<SpinnerComponent />
					:

					<ScrollView style={{flex: 1, paddingHorizontal: 15}} keyboardShouldPersistTaps={'always'}>
						<View style={{...style.cardWrapper, paddingBottom: 20}}>

						{

							this.props.orderData.length != 0 ?

							this.props.orderData.map((data, index) => (

								<TouchableOpacity key={index} style={{...style.cardWrapper, backgroundColor: '#FFFFFF'}} onPress = {() => this.detailScreen(this.props.index, data.refId, data.type)}>
									<View style={{...style.cardHeaderWrapper}}>


										<View style={{flex: 2, marginLeft: 10, justifyContent: 'center'}}>

											<Text style={{fontFamily: 'Gilroy-Bold', fontSize: 14}}>{data.customerName}</Text>
											<Text style={{fontFamily: 'Gilroy-Bold', fontSize: 12, flexWrap: 'wrap'}}>

                                            {

                                            data.type == "DELIVERY" ?

                                            (data.refNoPrefix != null) ? data.refNoPrefix : null  : null }

                                            {

                                            data.type == "DELIVERY" ?

                                            (data.refNo != null) ? " " + data.refNo + " " : null  : null }

                                            {

                                            data.type == "DELIVERY" ?

                                            (data.refNoSuffix != null) ? data.refNoSuffix : null  : null }

                                            {

                                            data.type == "PICKUP" ?

                                            "RETURN NO : " + data.refNo : null }

                                            </Text>
											<Text style={{fontFamily: 'Gilroy-Bold', fontSize: 12, flexWrap: 'wrap'}}>STATUS : {data.status}</Text>

											<Text style={{fontFamily: 'Gilroy-Bold', fontSize: 12, flexWrap: 'wrap'}}>
												{(data.deliveredDate != null) ? Moment(data.deliveredDate).format('DD-MMM-YYYY') : null}
											</Text>

										</View>

                                        

										<View style={{flex: 1}}>
                                                
                                            <View style={{ backgroundColor: (data.type == "DELIVERY") ? language.primary : "yellow", padding: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
                                                <Text>{data.type}</Text>
                                            </View>
											
										</View>

									</View>

								</TouchableOpacity>

								))

							:

							<View style={{...style.cardHeaderWrapper}}>
								<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
									<Text style={{fontFamily: 'Gilroy-Bold', fontSize: 14}}>No Data Found</Text>
								</View>
							</View>

						}
						
						</View>
                </ScrollView>

				}
			</View>
							
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
		marginTop: 15,
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
})

export default withNavigation(HistoryListComponent)