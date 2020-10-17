import React, {Component} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import * as language from '../constants/languages';
import Communications from 'react-native-communications';
import Feather from 'react-native-vector-icons/Feather';

export default class PhoneCallComponent extends React.Component {

    async phoneCall(nbr) {
		
        this.props.dismissModal(false);
		Communications.phonecall(nbr, true);

	}


	render() {
		return(
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.isVisible}
                onRequestClose={() => this.props.dismissModal(false)}
                >
                <View style={style.centeredView}>
                    <View style={style.modalView}>

                    {
                        this.props.phoneList.map((val, index) => (
                            <View style={{flexDirection: 'row', padding: 5}} key={index}>
                                <View style={{ flex: 1.5, justifyContent: 'center', }}>
                                    <Text>{(val.length == 10) ? "+91" : null} {(val.trim() != "") ? val : "Invalid Number"}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <TouchableOpacity style={{...style.iconWrapper, width: 50}} onPress={() => this.phoneCall(val) }>
										<Feather name="phone" color={language.tertiary} size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    }

                    </View>
                </View>
            </Modal>
		)
	}

}

const style = StyleSheet.create({
 
	spinneWrapper :{
		flex:1,
		justifyContent: 'center',
		alignItems: 'center'
    },
    centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: 'rgba(100,100,100, 0.5)'
    },
    iconWrapper: {
		backgroundColor: language.primary,
		borderRadius: 10,
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalView: {
		margin: 35,
		backgroundColor: "white",
		borderRadius: 10,
		padding: 30,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
		  width: 0,
		  height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
    }
      
})