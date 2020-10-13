import React, {Component} from 'react';
import { Text, ScrollView, View, StyleSheet, TouchableOpacity, Linking, Platform, ToastAndroid } from 'react-native';
import * as language from '../constants/languages';
import SpinnerComponent from  './SpinnerComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import Communications from 'react-native-communications';
import { withNavigation } from 'react-navigation';
import PhoneCallComponent from './PhoneCallComponent';
import Moment from 'moment';

class ProductListComponent extends React.Component{

	constructor(props) {
		super(props);

		this.state = {
			selectedIndex: 0,
			isCallModal: false,
			phoneList: []
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

	async detailScreen(mode, orderId) {

		this.props.navigation.navigate('ProductDetailScreen', { mode: mode, orderId: orderId });

	}

	async phoneCall(nbr) {

		console.log(nbr,"nbr");
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

								<TouchableOpacity key={index} style={{...style.cardWrapper, backgroundColor: '#FFFFFF'}} onPress = {() => this.detailScreen(this.props.index, data.orderId)}>
									<View style={{...style.cardHeaderWrapper}}>

										<View style={{flex: 1, flexDirection: 'row', marginBottom: 2}}>
											<View style={{flex: 1, justifyContent: 'center'}}>
												<Text style={{fontFamily: 'Gilroy-Bold', fontSize: 14}}>{data.customerName}</Text>
											</View>
											<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
												<Text style={{fontFamily: 'Gilroy-Bold', fontSize: 12, flexWrap: 'wrap'}}>Order No: {(data.orderNo != null) ? data.orderNo : null}</Text>
											</View>
											<View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
												<Text style={{fontFamily: 'Gilroy-Bold', fontSize: 12, flexWrap: 'wrap'}}>
													{(data.expectedDeliveryDate != null) ? Moment(data.expectedDeliveryDate).format('DD-MMM-YYYY') : null}
												</Text>
											</View>
										</View>


										<View style={{flex: 1, flexDirection: 'row', marginBottom: 1}}>
											<View style={{flex: 2, justifyContent: 'center'}}>
												<Text style={{fontFamily: 'Gilroy-Medium', fontSize: 14}}>{data.orderAddresses[0].houseNo}</Text>
												<Text style={{fontFamily: 'Gilroy-Medium', fontSize: 14}}>{data.orderAddresses[0].area}</Text>
												<Text style={{fontFamily: 'Gilroy-Medium', fontSize: 14}}>{data.orderAddresses[0].city} - {data.orderAddresses[0].pincode}</Text>
												<Text style={{fontFamily: 'Gilroy-Medium', fontSize: 14}}>{data.orderAddresses[0].country}</Text>
											</View>
						
											<View style={{flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
												<View style={{flex: 0.5, marginRight: 10 }}>
													
													{

														(data.orderAddresses[0].mobileNo1 != null && data.orderAddresses[0].mobileNo2 != null ) ?

															<View>
																<TouchableOpacity style={{...style.iconWrapper}} onPress={() => this.setState({ isCallModal: true, phoneList: [data.orderAddresses[0].mobileNo1, data.orderAddresses[0].mobileNo2] })}>
																	<Icon name="phone" size={20} />
																</TouchableOpacity>
															</View>

														:

														<TouchableOpacity style={{...style.iconWrapper}} onPress={() => this.phoneCall( (data.orderAddresses[0].mobileNo1 != null) ? data.orderAddresses[0].mobileNo1  : data.orderAddresses[0].mobileNo2 )}>
																<Icon name="phone" size={20} />
														</TouchableOpacity>

													}
													
												</View>


												<View style={{flex: 0.5, }}>
													<TouchableOpacity style={{...style.iconWrapper}} onPress={() => this.openMaps((data.orderAddresses[0].latitude != "") ? data.orderAddresses[0].latitude: 0, (data.orderAddresses[0].longitude != "") ? data.orderAddresses[0].longitude: 0)}>
														<Icon name="location-arrow" size={20} />
													</TouchableOpacity>
												</View> 
											</View>
										</View>


										{/* <View style={{flex: 1, flexDirection: 'row', marginBottom: 0, marginTop: -5}}>
											<View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
												<Text style={{fontFamily: 'Gilroy-Bold', fontSize: 12}}>Quantity : {data.orderItems.length}</Text>
											</View>
										</View> */}

										{/* <View style={{flex: 2, marginLeft: 10, justifyContent: 'center'}}>
											<Text style={{fontFamily: 'Gilroy-Bold', fontSize: 14}}>{data.orderAddresses[0].name}</Text>
											<Text style={{fontFamily: 'Gilroy-Bold', fontSize: 12, flexWrap: 'wrap'}}>{(data.orderNoPrefix != null) ? data.orderNoPrefix : null} {(data.orderNo != null) ? data.orderNo : null} {(data.orderNoSuffix != null) ? data.orderNoSuffix : null}</Text>
											<Text style={{fontFamily: 'Gilroy-Bold', fontSize: 12, flexWrap: 'wrap'}}>
												{(data.expectedDeliveryDate != null) ? Moment(data.expectedDeliveryDate).format('DD-MMM-YYYY') : null}
											</Text>
										</View> */ }

								

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
				<PhoneCallComponent
						isVisible = {this.state.isCallModal}
						dismissModal = {() => this.setState({ isCallModal: false, phoneList: [] })}
						phoneList = {this.state.phoneList}
				/>
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
		flexDirection: 'column',
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

export default withNavigation(ProductListComponent)