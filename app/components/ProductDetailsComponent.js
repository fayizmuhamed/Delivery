import React, {Component} from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import * as language from '../constants/languages';

export default class ProductDetailsComponent extends React.Component{

    constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return(

			<View>

                {

                    this.props.orderItems.map((data, index) => (

                        <View key = {index} style={{...style.customCardWrapper}}>

                            <View style={{flexDirection: 'row'}}>
                                <View style={{ justifyContent: 'center', alignItems: 'center',  width: 65, height: 65, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)'}}>
                                    <Image source={{ uri: data.image}} style={{width: '100%', height: '100%'}} resizeMode="contain"/>
                                </View>
                                <View style={{flex: 2, marginLeft: 10}}>
                                    <View style={{justifyContent: 'center', flex: 1}}>
                                        <View style={{flexDirection: 'row',}}>
                                            <View style={{justifyContent: 'flex-start', flex: 2}}>
                                                <Text style={{fontSize: 16, fontFamily: 'Gilroy-Bold', flexWrap: 'wrap'}}>{data.name}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{justifyContent: 'center', flex: 1}}>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row'}}>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                                            <Text>Quantity : {data.quantity}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

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
	}

})

