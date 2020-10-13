import React, {Component} from 'react';
import { Text, View, StyleSheet, TouchableHighlight, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as language from '../constants/languages';

export default class AlertComponent extends React.Component {


	render() {
		return(
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.isVisible}
                >
                <View style={style.centeredView}>
                    <View style={style.modalView}>

                      <Text style={style.headerText}>Success</Text>

                      <Text style={style.modalText}>{this.props.alertMessage}</Text>

                      <TouchableHighlight
                        style={{ ...style.openButton, backgroundColor: language.primary }}
                        onPress={() => {
                          this.props.confirmAlert()
                        }}
                      >
                        <Text style={style.textStyle}>PROCEED</Text>
                      </TouchableHighlight>

                    </View>
                </View>
            </Modal>
		)
	}

}

const style = StyleSheet.create({
 
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(100,100,100, 0.5)',  
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: language.primary,
    borderRadius: 10,
    marginBottom: -15, 
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: 'Gilroy-Light'
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: 'Gilroy-Bold'
  },
  headerText: {
    color: language.primary,
    marginBottom: 15,
    fontSize: 18,
    textAlign: "center",
    fontFamily: 'Gilroy-Bold'
  }
      
})