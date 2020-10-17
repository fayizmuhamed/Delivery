import React, {Component} from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import * as language from '../constants/languages';
import { Button } from 'react-native-elements';
import StatusComponent from './StatusComponent';

export default class PickupDetailsComponent extends React.Component{

    constructor(props) {
		super(props);

		this.state = {

            isVisible: false,
            remark: ""

        };
    }
    

    // async handleClose() {

    //     await this.setState({ isVisible: false });

    // }

    async handleSave(reason) {

        // await this.setState({ isVisible: false });  
        await this.props.handleReturnRemarks(reason);

    }

	render() {
		return(

			<View>

                {

                    this.props.returnItems.map((data, index) => (

                        <View key = {index} style={{...style.customCardWrapper}}>

                            <View style={{flexDirection: 'row'}}>
                                <View style={{ justifyContent: 'center', alignItems: 'center',  width: 65, height: 65, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)'}}>
                                    <Image source={{ uri: data.image}} style={{width: '100%', height: '100%'}} resizeMode="contain"/>
                                </View>
                                <View style={{flex: 2, marginLeft: 10}}>
                                    <View style={{justifyContent: 'center', flex: 1}}>
                                        <View style={{flexDirection: 'row',}}>
                                            <View style={{justifyContent: 'flex-start', flex: 3}}>
                                                <Text style={{fontSize: 16, fontFamily: 'Gilroy-Bold', flexWrap: 'wrap'}}>{data.name}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{justifyContent: 'center', flex: 1}}>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row'}}>
                                        <View style={{flex: 3, justifyContent: 'center', alignItems: 'flex-start'}}>
                                            <Text>Quantity : {data.quantity}</Text>
                                        </View>     
                                    </View>
                                </View>
                            </View>

                            {

                                this.props.mode != "history" ?

                                <View style={{flex: 1,borderRadius: 50, marginTop: 10}}>
                                    <TextInput
                                        underlineColorAndroid='transparent'
                                        placeholder = "Remarks here"
                                        style={{...style.TextInputStyleClass, height: 125, textAlignVertical: 'top'}}
                                        autoCapitalize={'none'}
                                        maxLength={255}
                                        multiline={true}
                                        onChangeText={(text) => this.handleSave(text)}/>
                                </View>

                                :

                                null

                            }

                            {/* <StatusComponent
                                isVisible = {this.state.isVisible}
                                mode = {this.props.mode}
                                orderId = {data.salesreturnRequestId}
                                title = "Pickup Remarks"
                                handleStatusClose = {() => this.handleClose()}
                                handleStatusSave = {(reason, id) => this.handleSave(reason, id)}
                            /> */}

                        </View>

                    ))


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
    customCardWrapper: {
		padding: 5,
		borderWidth: 1,
		borderColor: '#f1f2f6',
		borderRadius: 15,
		backgroundColor: '#fff',
		marginTop: 10
    },
    centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: 'rgba(100,100,100, 0.5)'
    },
	modalView: {
		margin: 15,
		backgroundColor: "white",
		borderRadius: 10,
		padding: 10,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
		  width: 0,
		  height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
        elevation: 5,
        height: 300
    }

})

