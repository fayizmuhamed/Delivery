import React, {Component} from 'react';
import { Text, SafeAreaView, ScrollView, View, StyleSheet, TouchableOpacity, Platform, Linking, ToastAndroid } from 'react-native';
import * as language from '../constants/languages';
import InnerPageHeader from '../components/InnerPageHeader';
import SpinnerComponent from '../components/SpinnerComponent';
import Usericon from '../assets/images/Usericon';
import Communications from 'react-native-communications';
import { Card } from 'react-native-paper'
import Feather from 'react-native-vector-icons/Feather';
import { Button } from 'react-native-elements';
import ProductDetailsComponent from '../components/ProductDetailsComponent';
import PickupDetailsComponent from '../components/PickupDetailsComponent';
import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import { getOrderInfo, cancelDelivery, postponeDelivery, orderDelivery, cancelPickup, getReturnInfo, pickup } from '../services/services';
import * as api from '../constants/services';
import PhoneCallComponent from '../components/PhoneCallComponent';
import ButtonComponent from '../components/ButtonComponent';
import StatusComponent from '../components/StatusComponent';
import AlertComponent from '../components/AlertComponent';
import SignatureComponent from '../components/SignatureComponent';
import { EventRegister } from 'react-native-event-listeners';

export default class HomeScreen extends React.Component{

	constructor(props) {
		super(props);

		this.state = {

            isLoading: true,
            mode: this.props.navigation.getParam('mode'),
            orderId: this.props.navigation.getParam('orderId'),
            returnId: this.props.navigation.getParam('returnId'),
            type: this.props.navigation.getParam('type'),
            isReasonModal: false,
            savebuttonDisable: true,
            signatureSaveButton: true,
            postponeReason: "",
            postponeDisable: false,
            deliveryDisable: false,
            postponeLabel: language.postponeLabel,
            deliveryLabel: language.deliveryLabel,
            rejectLabel: language.rejectLabel,
            pickedLabel: language.pickedLabel,
            signImage: null,
            acceptorInfo: "",
            contactInfo: "",
            rejectDisable: false,
            pickedDisable: false,
            reasonText: "",
            deliveryState: false,
            pickupState: false,
            status: "",
            cancelDisabled: false,
            statusDisabled: false,
            statusModal: false,
            orderAddresses : null,
            orderPayments: null,
            orderItems: [],
            orderData: null,
            isCallModal: false,


            isCancelModal: false,
            isStatusModal: false,
            isSignatureModal: false,
            showAlert: false,
            alertMessage: "",
            isRejectModal: false,
            isPickUpModal: false,
            returnData: null,
            returnItems: [],
            returnRemarks: "",

        };
    }
    
    componentDidMount() {
        
        if(this.state.mode != "pickup") {

            if(this.state.mode == "history") {

                if(this.state.type == "DELIVERY") {

                    this.getOrderInfo();

                } else {

                    this.getReturnInfo();

                }

            } else {

                this.getOrderInfo();

            }

        } else {
            
            this.getReturnInfo();

        }
    
    }

    async confirmLogout() {

        await AsyncStorage.setItem('IS_LOGGGED_IN', '0');
        await AsyncStorage.removeItem('@access_token');
        EventRegister.emit('LOGGGED_IN', 0);

    }
    
    async getOrderInfo() {

        this.token = await AsyncStorage.getItem('@access_token');
		await getOrderInfo(api.companyidValue , this.token, this.state.orderId).then((orderInfo) => {
			console.log(orderInfo,"orderInfo");
			if(orderInfo.statusCode === 200) {
				if(orderInfo.data.status != "failed") {
					this.setState({ 
                        orderAddresses: orderInfo.data.data.orderAddresses[0],
                        orderItems: orderInfo.data.data.orderItems,
                        orderPayments: orderInfo.data.data.orderPayments[0],
                        orderData: orderInfo.data.data,
                        isLoading: false
                    });
				} else {
                    this.setState({ isLoading: false });
                    ToastAndroid.show( orderInfo.data.message, ToastAndroid.SHORT);
				}
			} else {

                if(orderInfo.statusCode === 401) {
					ToastAndroid.show(orderInfo.data.message, ToastAndroid.SHORT);
					this.confirmLogout();
				} else {
                    ToastAndroid.show( "Failed to fetch order info, please try again", ToastAndroid.SHORT);
					this.setState({ isLoading: false });
				}
			}
		}).catch((error) => {	
            this.setState({ isLoading: false });
            ToastAndroid.show("Failed to fetch order info, please try again", ToastAndroid.SHORT);
		})

    }

    async getReturnInfo() {

        this.token = await AsyncStorage.getItem('@access_token');
		await getReturnInfo(api.companyidValue , this.token, this.state.returnId).then((returnInfo) => {
			console.log(returnInfo,"returnInfo");
			if(returnInfo.statusCode === 200) {
				if(returnInfo.data.status != "failed") {
					this.setState({ 
                        returnItems: returnInfo.data.data.returnItems,
                        returnData: returnInfo.data.data,
                        isLoading: false
                    });
				} else {
                    this.setState({ isLoading: false });
                    ToastAndroid.show( returnInfo.data.message, ToastAndroid.SHORT);
				}
			} else {

                if(returnInfo.statusCode === 401) {
					ToastAndroid.show(returnInfo.data.message, ToastAndroid.SHORT);
					this.confirmLogout();
				} else {
                    ToastAndroid.show( "Failed to fetch return info, please try again", ToastAndroid.SHORT);
					this.setState({ isLoading: false });
				}

			}
		}).catch((error) => {	
            this.setState({ isLoading: false });
            ToastAndroid.show("Failed to fetch return info, please try again", ToastAndroid.SHORT);
		})

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
    
    async phoneCall(nbr) {

		Communications.phonecall(nbr, true);

	}

    // =============================================== Cancel Section ====================================================

    async reasonForCancel() {

        console.log("on cancel ");
        await this.setState({  isCancelModal : true });

    }

    async handleCancelClose() {

        await this.setState({ isCancelModal: false });

    }

    async handleCancelSave(reason, orderId) {
        await this.setState({ isCancelModal: false, isLoading: true });

        this.token = await AsyncStorage.getItem('@access_token');
		await cancelDelivery(api.companyidValue, this.token, orderId, reason).then((cancelInfo) => {
			if(cancelInfo.statusCode === 200) {
				if(cancelInfo.data.status != "failed") {
                    this.setState({ isLoading: false, showAlert: true, alertMessage: cancelInfo.data.message });
				} else {
                    this.setState({ isLoading: false });
                    ToastAndroid.show( cancelInfo.data.message, ToastAndroid.SHORT);
				}
			} else {
                this.setState({ isLoading: false });
                ToastAndroid.show( "Failed to cancel order", ToastAndroid.SHORT);
			}
		}).catch((error) => {	
            this.setState({ isLoading: false });
            ToastAndroid.show("Failed to cancel order", ToastAndroid.SHORT);
		})
    }

    // =============================================== Status Section ====================================================


    async reasonForStatus() {

        console.log("on status ");
        await this.setState({  isStatusModal : true });

    }

    async handleStatusClose() {

        await this.setState({ isStatusModal: false });

    }

    async handleStatusSave(reason, orderId) {
        await this.setState({ isStatusModal: false, isLoading: true });

        this.token = await AsyncStorage.getItem('@access_token');
		await postponeDelivery(api.companyidValue, this.token, orderId, reason).then((postponeInfo) => {
            console.log(postponeInfo,"postponeInfo");
			if(postponeInfo.statusCode === 200) {
				if(postponeInfo.data.status != "failed") {
                    this.setState({ isLoading: false, showAlert: true, alertMessage: "Status updated successfully" });
				} else {
                    this.setState({ isLoading: false });
                    ToastAndroid.show( postponeInfo.data.message, ToastAndroid.SHORT);
				}
			} else {
                this.setState({ isLoading: false });
                ToastAndroid.show( "Failed to cancel order", ToastAndroid.SHORT);
			}
		}).catch((error) => {	
            this.setState({ isLoading: false });
            ToastAndroid.show("Failed to cancel order", ToastAndroid.SHORT);
		})

    }

    // ======================================= Confirm alert ======================================================

    async confirmAlert() {
        console.log("alertt");
        this.setState({ showAlert: false });
        if(this.state.mode == "delivery") {

            EventRegister.emit('refreshdelivery', 0);
            this.props.navigation.popToTop();

        } else {
            
            EventRegister.emit('refreshpickup', 1);
            this.props.navigation.popToTop();

        }

    }

    //  =========================================== delivery / pickupp =============================================

    async handleSignatureClose() {

        await this.setState({  isSignatureModal : false });

    }

    async handleSignatureSave(acceptorName, acceptorContact, signature, remarks, orderId) {

        await this.setState({ isSignatureModal: false, isLoading: true });

        this.token = await AsyncStorage.getItem('@access_token');
		await orderDelivery(api.companyidValue, this.token, acceptorName, acceptorContact, signature, remarks, orderId).then((orderDelivery) => {
            console.log(orderDelivery,"orderDelivery");
			if(orderDelivery.statusCode === 200) {
				if(orderDelivery.data.status != "failed") {
                    this.setState({ isLoading: false, showAlert: true, alertMessage: language.orderAlert });
				} else {
                    this.setState({ isLoading: false });
                    ToastAndroid.show( orderDelivery.data.message, ToastAndroid.SHORT);
				}
			} else {
                this.setState({ isLoading: false });
                ToastAndroid.show("Failed to confirm delivery", ToastAndroid.SHORT);
			}
		}).catch((error) => {	
            this.setState({ isLoading: false });
            ToastAndroid.show("Failed to confirm delivery", ToastAndroid.SHORT);
		})

    }

    //  ================================================== reject ========================================================

    async reasonForReject() {

        await this.setState({ isRejectModal: true });

    }

    async handleRejectClose() {

        await this.setState({ isRejectModal: false });

    }

    async handleRejectSave(reason, orderId) {
        await this.setState({ isRejectModal: false, isLoading: true });

        this.token = await AsyncStorage.getItem('@access_token');
		await cancelPickup(api.companyidValue, this.token, orderId, reason).then((rejectInfo) => {
            console.log(rejectInfo,"rejectinfo");
			if(rejectInfo.statusCode === 200) {
				if(rejectInfo.data.status != "failed") {
                    this.setState({ isLoading: false, showAlert: true, alertMessage: rejectInfo.data.message });
				} else {
                    this.setState({ isLoading: false });
                    ToastAndroid.show( rejectInfo.data.message, ToastAndroid.SHORT);
				}
			} else {
                this.setState({ isLoading: false });
                ToastAndroid.show( "Failed to cancel order", ToastAndroid.SHORT);
			}
		}).catch((error) => {	
            this.setState({ isLoading: false });
            ToastAndroid.show("Failed to cancel order", ToastAndroid.SHORT);
		})
    }

    async handleReturnRemarks(remarks) {

        await this.setState({ returnRemarks: remarks });

    }

    async handlePickUpClose() {

        await this.setState({ isPickUpModal: false });

    }

    async handlePickUpSave(acceptorName, acceptorContact, signature, remarks, returnId) {

        await this.setState({ isPickUpModal: false, isLoading: true });

        this.token = await AsyncStorage.getItem('@access_token');
		await pickup(api.companyidValue, this.token, acceptorName, acceptorContact, signature, this.state.returnRemarks, returnId).then((pickUpOrder) => {
            console.log(pickUpOrder,"pickUpOrder");
			if(pickUpOrder.statusCode === 200) {
				if(pickUpOrder.data.status != "failed") {
                    this.setState({ isLoading: false, showAlert: true, alertMessage: language.pickAlert });
				} else {
                    this.setState({ isLoading: false });
                    ToastAndroid.show( pickUpOrder.data.message, ToastAndroid.SHORT);
				}
			} else {
                this.setState({ isLoading: false });
                ToastAndroid.show("Failed to pickup order", ToastAndroid.SHORT);
			}
		}).catch((error) => {	
            this.setState({ isLoading: false });
            ToastAndroid.show("Failed to pickup order", ToastAndroid.SHORT);
		})


    }

    // async handleReturn(returnId) {

	// 	let source=[...this.state.returnItems];
	// 	for(let data of source){
	// 	  if(data.salesreturnRequestId==returnId){
	// 		data.returnStatus = (data.returnStatus==="PENDING")?"INITIATED":"PENDING";
	// 		break;
	// 	  }
	// 	}
	// 	this.setState({source});

    // }

    deliveryOrder() {
        return (

        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 2, alignItems: 'flex-start', justifyContent: 'center'}}>
                <Text style={{fontSize: 14, fontFamily: 'Gilroy-Bold'}}>
                    {(this.state.orderData.orderNoPrefix != null) ? this.state.orderData.orderNoPrefix : null} {(this.state.orderData.orderNo != null) ? this.state.orderData.orderNo : null} {(this.state.orderData.orderNoSuffix != null) ? this.state.orderData.orderNoSuffix : null}
                </Text>
            </View>
                <View style={{flex: 1, alignItems: 'flex-end', flexDirection: 'row', justifyContent:'flex-end'}}>
                {

                    (this.state.orderAddresses.mobileNo1 != null && this.state.orderAddresses.mobileNo2 != null ) ?

                        <View style={{flex: 1, marginRight: 10 }}>
                            <TouchableOpacity style={{...style.iconWrapper}} onPress={() => this.setState({ isCallModal: true })}>
                            <Feather name="phone" color={language.tertiary} size={20} />
                            </TouchableOpacity>
                            
                            <PhoneCallComponent
                                isVisible = {this.state.isCallModal}
                                dismissModal = {(value) => this.setState({ isCallModal: false })}
                                phoneList = {[this.state.orderAddresses.mobileNo1, this.state.orderAddresses.mobileNo2]}
                            />

                        </View>

                    :
                    <View style={{flex: 1, marginRight: 10 }}>

                        <TouchableOpacity style={{...style.iconWrapper}}
                         onPress={() => this.phoneCall( (this.state.orderAddresses.mobileNo1 != null) ? this.state.orderAddresses.mobileNo1  : this.state.orderAddresses.mobileNo2 )}>
                                 <Feather name="phone" color={language.tertiary} size={20} />
                        </TouchableOpacity>

                    </View>

                }
                <View style={{flex: 1}}>
                    <TouchableOpacity style={{...style.iconWrapper}} onPress={() => this.openMaps((this.state.orderAddresses.latitude != "") ? this.state.orderAddresses.latitude: 0, (this.state.orderAddresses.longitude != "") ? this.state.orderAddresses.longitude: 0)}>
                        <Feather name="navigation" color={language.tertiary} size={20} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        );
    }

    pickupOrder() {

        return(

            <View style={{flexDirection: 'row'}}>
                <View style={{flex: 2, alignItems: 'flex-start', justifyContent: 'center'}}>
                    <Text style={{fontSize: 14, fontFamily: 'Gilroy-Bold'}}>RETURN NO : {this.state.returnData.salesreturnRequestId}</Text>
                </View>
                    <View style={{flex: 1, alignItems: 'flex-end', flexDirection: 'row', justifyContent:'flex-end'}}>
                    {

                        (this.state.returnData.customerMobileNo1 != null && this.state.returnData.customerMobileNo2 != null ) ?

                            <View style={{flex: 1, marginRight: 10 }}>
                                <TouchableOpacity style={{...style.iconWrapper}} onPress={() => this.setState({ isCallModal: true })}>
                                    <Feather name="phone" color={language.tertiary} size={20} />
                                </TouchableOpacity>
                                
                                <PhoneCallComponent
                                    isVisible = {this.state.isCallModal}
                                    dismissModal = {(value) => this.setState({ isCallModal: false })}
                                    phoneList = {[this.state.returnData.customerMobileNo1, this.state.returnData.customerMobileNo2]}
                                />

                            </View>

                        :
                        <View style={{flex: 1, marginRight: 10 }}>

                            <TouchableOpacity style={{...style.iconWrapper}} onPress={() => this.phoneCall( (this.state.returnData.customerMobileNo1 != null) ? this.state.returnData.customerMobileNo1  : this.state.returnData.customerMobileNo2 )}>
                                <Feather name="phone" color={language.tertiary} size={20} />
                            </TouchableOpacity>

                        </View>

                    }
                    <View style={{flex: 1}}>
                        <TouchableOpacity style={{...style.iconWrapper}} onPress={() => this.openMaps((this.state.returnData.customerLatitude != null) ? this.state.returnData.customerLatitude: 0, (this.state.returnData.customerLongitude != null) ? this.state.returnData.customerLongitude: 0)}>
                            <Feather name="navigation" color={language.tertiary} size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


        );

    }


    orderAddress() {

        return(

            <View>
                <Text>{this.state.orderAddresses.name}</Text>
                <Text>{this.state.orderAddresses.houseNo}</Text>
                <Text>{this.state.orderAddresses.area}</Text>
                <Text>{this.state.orderAddresses.city} - {this.state.orderAddresses.pincode}</Text>
                <Text>{this.state.orderAddresses.country}</Text>
            </View>

        );

    }

    returnAddress() {

        return(

            <View>
                <Text>{this.state.returnData.customerName}</Text>
                <Text>{this.state.returnData.customerHouseNo}</Text>
                <Text>{this.state.returnData.customerArea}</Text>
                <Text>{this.state.returnData.customerCity} - {this.state.returnData.customerPincode}</Text>
                <Text>{this.state.returnData.customerCountry}</Text>
            </View>

        );

    }

	render() {
		return(
			<SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
				<InnerPageHeader title = { (this.state.mode == "delivery") ? language.orderDetails : (this.state.mode == "pickup") ? language.returnDetails : (this.state.type == "DELIVERY") ? language.orderDetails : language.returnDetails} />

                {
                    this.state.isLoading == true ?
    
                        <SpinnerComponent />
                    
                    :

                    <ScrollView style={{flex: 1, paddingHorizontal: 15}} keyboardShouldPersistTaps={'always'}>
                        <View style={style.cardWrapper}>

                            {
                                this.state.mode != "pickup" ?

                                    this.state.mode == "history" ?

                                        this.state.type == "DELIVERY" ?

                                            this.deliveryOrder()

                                            :

                                            this.pickupOrder()

                                    :

                                    this.deliveryOrder()

                                :

                                this.pickupOrder()

                            }

                        </View>
                        
                        <View style={{...style.cardWrapper, paddingBottom: 10}}>
                            <View style={{flexDirection: 'row', padding: 10 }}>
                                <View style={{flex: 0.8}} >
                                    <Usericon width={85} height={85} />
                                </View>

                                <View style={{ flex: 1}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{flex: 1, alignItems: 'flex-start'}}>
                                            <Text style={{fontFamily: 'Gilroy-Heavy'}}>{language.addressLabel}</Text>
                                        </View>
                                    </View>

                                    {
                                        this.state.mode != "pickup" ?

                                            this.state.mode == "history" ?

                                                this.state.type == "DELIVERY" ?

                                                    this.orderAddress()

                                                    :

                                                    this.returnAddress()

                                            :

                                            this.orderAddress()

                                        :

                                        this.returnAddress()

                                    }

                                </View>
                            </View>
                        </View>

                        {

                            this.state.mode == "delivery" ?

                            <View style={{...style.cardWrapper, paddingBottom: 10}}>

                                <View style={{padding: 15, backgroundColor: language.primary, alignItems: 'center'}}>
                                    <Text style={{color: language.tertiary, fontWeight: 'bold'}}>{language.orderDetails}</Text>
                                </View>

                                <ProductDetailsComponent orderItems = { this.state.orderItems } mode = "delivery"/>

                                <View style={{...style.customCardWrapper, paddingBottom: 10}}>
                                    <View style={{flexDirection: 'row', padding: 5}}>
                                        <View style={{flex: 1, justifyContent: 'flex-start'}}>
                                            <Text style={{fontFamily: 'Gilroy-Bold'}}>{language.totalAmount}</Text>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Gilroy-Bold'}}>{language.currency} {(this.state.orderData.totalAmount != null) ? this.state.orderData.totalAmount : null}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{...style.customCardWrapper, paddingBottom: 10}}>
                                    <View style={{flexDirection: 'row', padding: 5 }}>
                                        <View style={{...style.iconWrapper}} >
                                            <Feather name="credit-card" size={20} color={language.tertiary}/>
                                        </View>

                                        <View style={{ flex: 2, marginLeft: 20}}>
                                            <View style={{flexDirection: 'row'}}>
                                                <View style={{flex: 1, alignItems: 'flex-start'}}>
                                                    <Text style={{color: language.textColor, fontWeight: 'bold'}}>{language.paymentLabel}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text>{(this.state.orderPayments.paymentProviderName != null) ? this.state.orderPayments.paymentProviderName : null}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                            </View>

                            :

                            this.state.mode == "pickup" ?

                                <View style={{...style.cardWrapper, paddingBottom: 10}}>

                                    <View style={{padding: 15, backgroundColor: language.primary, alignItems: 'center'}}>
                                        <Text style={{color: language.tertiary, fontWeight: 'bold'}}>{language.returnDetails}</Text>
                                    </View>

                                    <PickupDetailsComponent 
                                        returnItems = { this.state.returnItems } 
                                        handleReturnRemarks = {(remarks) => this.handleReturnRemarks(remarks)} 
                                        mode = "pickup"/>

                                </View>
                            :

                            <View style={{...style.cardWrapper, paddingBottom: 10}}>

                                <View style={{padding: 15, backgroundColor: language.primary, alignItems: 'center'}}>
                                    <Text style={{color: language.tertiary, fontWeight: 'bold'}}>{(this.state.type == "PICKUP") ? language.returnDetails : language.orderDetails}</Text>
                                </View>

                                {

                                    this.state.type == "PICKUP" ?

                                    <View>

                                    <PickupDetailsComponent 
                                        returnItems = { this.state.returnItems } 
                                        handleReturnRemarks = {(remarks) => this.handleReturnRemarks(remarks)} 
                                        mode = "history"/>

                                        <View style={{...style.customCardWrapper, paddingBottom: 10}}>
                                            <View style={{flexDirection: 'row', padding: 5 }}>
                                                <View style={{...style.iconWrapper}} >
                                                    <Feather name="eye" size={20} color={language.tertiary}/>
                                                </View>

                                                <View style={{ flex: 2, marginLeft: 20}}>
                                                    <View style={{flexDirection: 'row', justifyContent: "center", alignItems: "center"}}>
                                                        <View style={{flex: 1, alignItems: 'flex-start'}}>
                                                            <Text style={{color: language.textColor, fontWeight: 'bold'}}>Return Status : </Text>
                                                        </View>
                                                        <View>
                                                            <Text>{(this.state.returnData.returnStatus != null) ? this.state.returnData.returnStatus : null}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        {

                                            this.state.returnData.returnStatus == "RETURNED" ?

                                            <View style={{...style.customCardWrapper, paddingBottom: 10}}>
                                                <View style={{flexDirection: 'row'}}>
                                                    <View style={style.sourceTabelDataSWrapper}>
                                                        <Text style={{fontWeight: 'bold', color: language.textColor}}>RETURNED at {Moment(this.state.returnData.collectionDate).format('LT')} {Moment().format('DD-MM-YYYY')}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                            :

                                            null

                                        }
                                    </View>

                                    :

                                    <View>
                                        <ProductDetailsComponent orderItems = { this.state.orderItems } mode = "history"/>

                                        <View style={{...style.customCardWrapper, paddingBottom: 10}}>
                                            <View style={{flexDirection: 'row', padding: 5}}>
                                                <View style={{flex: 1, justifyContent: 'flex-start'}}>
                                                    <Text style={{fontFamily: 'Gilroy-Bold'}}>{language.totalAmount}</Text>
                                                </View>
                                                <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                                                    <Text style={{fontFamily: 'Gilroy-Bold'}}>{language.currency} {(this.state.orderData.totalAmount != null) ? this.state.orderData.totalAmount : null}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{...style.customCardWrapper, paddingBottom: 10}}>
                                            <View style={{flexDirection: 'row', padding: 5 }}>
                                                <View style={{...style.iconWrapper}} >
                                                    <Feather name="credit-card" size={20} color={language.tertiary}/>
                                                </View>

                                                <View style={{ flex: 2, marginLeft: 20}}>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{flex: 1, alignItems: 'flex-start'}}>
                                                            <Text style={{color: language.textColor, fontWeight: 'bold'}}>{language.paymentLabel}</Text>
                                                        </View>
                                                    </View>
                                                    <View>
                                                        <Text>{(this.state.orderPayments.paymentProviderName != null) ? this.state.orderPayments.paymentProviderName : null}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{...style.customCardWrapper, paddingBottom: 10}}>
                                            <View style={{flexDirection: 'row', padding: 5 }}>
                                                <View style={{...style.iconWrapper}} >
                                                    <Feather name="eye" size={20} color={language.tertiary}/>
                                                </View>

                                                <View style={{ flex: 2, marginLeft: 20}}>
                                                    <View style={{flexDirection: 'row', justifyContent: "center", alignItems: "center"}}>
                                                        <View style={{flex: 1, alignItems: 'flex-start'}}>
                                                            <Text style={{color: language.textColor, fontWeight: 'bold'}}>{language.status}</Text>
                                                        </View>
                                                        <View>
                                                            <Text>{(this.state.orderData.status != null) ? this.state.orderData.status : null}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        {

                                            this.state.orderData.status == "DELIVERED" ?

                                            <View style={{...style.customCardWrapper, paddingBottom: 10}}>
                                                <View style={{flexDirection: 'row'}}>
                                                    <View style={style.sourceTabelDataSWrapper}>
                                                        <Text style={{fontWeight: 'bold', color: language.textColor}}>DELIVERED at {Moment(this.state.orderData.deliveredDate).format('LT')} {Moment().format('DD-MM-YYYY')}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                            :

                                            null

                                        }

                                    </View>

                                }

                            </View>

                        }

                        {

                            this.state.mode != "history" ?

                                <Card style={{...style.footerWrapper}}>
                                
                                    {
                                        this.state.mode == "delivery" ?


                                            <View style={{flexDirection: 'row'}}>  

                                                <ButtonComponent
                                                    title= {language.cancelLabel}
                                                    buttonStyle={{borderRadius: 50, backgroundColor: '#f1f2f6', padding: 12}}
                                                    titleStyle={{fontFamily: 'Gilroy-Bold', color: language.textColor}}
                                                    onPress = {() => this.reasonForCancel()}
                                                />

                                                <ButtonComponent
                                                    title= {language.postponeLabel}
                                                    buttonStyle={{borderRadius: 50, backgroundColor: '#f1f2f6', padding: 12}}
                                                    titleStyle={{fontFamily: 'Gilroy-Bold', color: language.textColor}}
                                                    onPress = {() => this.reasonForStatus()}
                                                />

                                                <ButtonComponent
                                                    title= {language.deliveryLabel}
                                                    buttonStyle={{borderRadius: 50, backgroundColor: language.primary, padding: 12}}
                                                    titleStyle={{fontFamily: 'Gilroy-Bold', color: language.tertiary}}
                                                    onPress = {() => this.setState({ isSignatureModal: true })}
                                                />

                                            </View>


                                        :


                                        <View style={{flexDirection: 'row'}}>
                    

                                            <ButtonComponent
                                                title= {language.rejectLabel}
                                                buttonStyle={{borderRadius: 50, backgroundColor: '#f1f2f6', padding: 12}}
                                                titleStyle={{fontFamily: 'Gilroy-Bold', color: language.textColor}}
                                                onPress = {() => this.reasonForReject()}
                                            />

                                            <ButtonComponent
                                                title= {language.pickedLabel}
                                                buttonStyle={{borderRadius: 50, backgroundColor: language.primary, padding: 12}}
                                                titleStyle={{fontFamily: 'Gilroy-Bold', color: language.tertiary}}
                                                onPress = {() => this.setState({ isPickUpModal: true })}
                                            />  

                                        </View>


                                    }

                                </Card>

                            :


                                // this.state.orderData.status == "DELIVERED" ?

                                // <Card style={{...style.cardWrapper, backgroundColor: '#f7f7f7', marginBottom: 15 , marginTop: 10, padding: 0, paddingTop: 10, paddingBottom: 10}}>
                                //     <View style={{flexDirection: 'row'}}>
                                //         <View style={style.sourceTabelDataSWrapper}>
                                //             <Text style={{fontWeight: 'bold', color: "#575757"}}>DELIVERED at {Moment(this.state.orderData.deliveredDate).format('LT')} {Moment().format('DD-MM-YYYY')}</Text>
                                //         </View>
                                //     </View>
                                // </Card>	

                                // :

                                <View style={{  marginBottom: 15 , marginTop: 10, padding: 0, paddingTop: 10, paddingBottom: 10 }} ></View>


                        }

                    </ScrollView>
                }

                <StatusComponent
                    isVisible = {this.state.isCancelModal}
                    mode = {this.state.mode}
                    orderId = {this.state.orderId}
                    title = {language.cancellation}
                    handleStatusClose = {() => this.handleCancelClose()}
                    handleStatusSave = {(reason, id) => this.handleCancelSave(reason, id)}
                />

                <StatusComponent
                    isVisible = {this.state.isStatusModal}
                    mode = {this.state.mode}
                    orderId = {this.state.orderId}
                    title = {language.postpone}
                    handleStatusClose = {() => this.handleStatusClose()}
                    handleStatusSave = {(reason, id) => this.handleStatusSave(reason, id)}
                />

                <SignatureComponent
                    isVisible = {this.state.isSignatureModal}
                    mode = {this.state.mode}
                    orderId = {this.state.orderId}
                    title = {language.deliveryInfo}
                    handleSignatureClose = {() => this.handleSignatureClose()}
                    handleSignatureSave = {(name, contact, signature, remarks, id) => this.handleSignatureSave(name, contact, signature, remarks, id)}
                />

                <AlertComponent
                    isVisible = {this.state.showAlert}
                    mode = {this.state.mode}
                    alertMessage = {this.state.alertMessage}
                    confirmAlert = {() => this.confirmAlert()}
                />

                <StatusComponent
                    isVisible = {this.state.isRejectModal}
                    mode = {this.state.mode}
                    orderId = {this.state.orderId}
                    title = {language.describePIssueLabel}
                    handleStatusClose = {() => this.handleRejectClose()}
                    handleStatusSave = {(reason, id) => this.handleRejectSave(reason, id)}
                />

                <SignatureComponent
                    isVisible = {this.state.isPickUpModal}
                    mode = {this.state.mode}
                    orderId = {this.state.returnId}
                    title = {language.pickupInfo}
                    handleSignatureClose = {() => this.handlePickUpClose()}
                    handleSignatureSave = {(name, contact, signature, remarks, id) => this.handlePickUpSave(name, contact, signature, remarks, id)}
                />


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
    customCardWrapper: {
		padding: 10,
		borderWidth: 1,
		borderColor: '#f1f2f6',
		borderRadius: 15,
		backgroundColor: '#fff',
		marginTop: 10
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
    }

})