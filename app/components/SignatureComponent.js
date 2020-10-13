import React, {Component} from 'react';
import { Text, View, StyleSheet, Modal, TextInput, SafeAreaView, ScrollView, ToastAndroid, Keyboard } from 'react-native';
import * as language from '../constants/languages';
import { Button } from 'react-native-elements';
import SignaturePad from 'react-native-signature-pad';

export default class SignatureComponent extends React.Component {

    constructor(props) {
		super(props);

		this.state = {
            acceptorName: null,
            acceptorContact: null,
            acceptorSignature: null,
            remark: "",
            isSignature: false
        };
    }
    
    async acceptorDetails(text) {

       await this.setState({ 
            acceptorName: text,
       });

    }

    async contactDetails(text) {

        await this.setState({ 
            acceptorContact: text,
        });
 
     }

     async reset() {

        await this.setState({
            acceptorName: null,
            acceptorContact: null,
            acceptorSignature: null,
            remark: "",
            isSignature: false
        })

     }
 
     async remarks(text) {

        await this.setState({
            remark: text
        })

     }

    async close() {
        await this.reset();
        await this.props.handleSignatureClose()
    }   

    async getSignature() {

        Keyboard.dismiss();
        
        if((this.state.acceptorContact != null) && (this.state.acceptorContact.length == 10)) {

            this.setState({ isSignature: true })

        } else{

            ToastAndroid.show("Required field empty", ToastAndroid.SHORT);

        }

    }

    _signaturePadError = (error) => {
    
        ToastAndroid.show("Error in getting signature", ToastAndroid.SHORT);

    };

	_signaturePadChange = ({base64DataUrl}) => {
		this.setState({
			acceptorSignature: base64DataUrl 
        })
    };

    async saveSignature() {

        await this.props.handleSignatureSave(this.state.acceptorName, this.state.acceptorContact, this.state.acceptorSignature, this.state.remark, this.props.orderId);
        await this.reset();

    }

	render() {
		return(
            <Modal
                visible={this.props.isVisible}
                animationType="fade"
                onRequestClose={() => this.close() }
                >
                <SafeAreaView style={style.container}>
                    <ScrollView style={style.scrollView} keyboardShouldPersistTaps={'always'}>

                        <View style={{padding: 10, alignItems:'center'}} >
                            <Text style={{fontFamily: 'Gilroy-light', fontSize: 25}}>{this.props.title}</Text>
                        </View>

                        <View style={{flex: 1,borderRadius: 50, padding: 15}}>
                            <TextInput
                                placeholder={language.acceptor}
                                underlineColorAndroid='transparent'
                                returnKeyType="next"
                                onSubmitEditing={() => { this.contact.focus(); }}
                                style={style.TextInputStyleClass}
                                autoCapitalize={'none'}
                                maxLength={15}
                                onChangeText = {(text) => this.acceptorDetails(text)}
                            />
                        </View>

                        <View style={{flex: 1,borderRadius: 50 , padding: 15, marginTop: -15}}>
                            <TextInput
                                placeholder={language.contactNo}
                                keyboardType = "number-pad"
                                underlineColorAndroid='transparent'
                                returnKeyType="next"
                                onSubmitEditing={() => { this.remark.focus(); }}
                                ref={(input) => { this.contact = input; }}
                                style={style.TextInputStyleClass}
                                autoCapitalize={'none'}
                                maxLength={15}
                                onChangeText = {(text) => this.contactDetails(text)}
                            />
                        </View>

                        {

                            this.props.mode === "delivery" ?

                            <View style={{flex: 1,borderRadius: 50 , padding: 15, marginTop: -15}}>
                                <TextInput
                                    placeholder={language.remarks}
                                    underlineColorAndroid='transparent'
                                    returnKeyType="done"
                                    ref={(input) => { this.remark = input; }}
                                    style={{...style.TextInputStyleClass, height: 150, textAlignVertical: 'top'}}
                                    autoCapitalize={'none'}
                                    onChangeText = {(text) => this.remarks(text)}
                                />
                            </View>

                            :

                            null

                        }

                        <View style={{ flex: 1, flexDirection: 'row', padding: 10}}>

                            <View style={{flex: 1, marginRight: 5}}>
                                <Button 
                                    title={language.close}
                                    buttonStyle={{backgroundColor: language.danger, borderRadius: 50}}
                                    titleStyle={{fontFamily: 'Gilroy-Bold', color: '#fff'}}	
                                    onPress={() =>  this.close() }
                                />
                            </View>
                            <View style={{flex: 1, marginLeft: 5, justifyContent: 'center'}}>
                                <Button 
                                    title={language.signature}
                                    buttonStyle={{backgroundColor: language.primary, borderRadius: 50}}
                                    titleStyle={{fontFamily: 'Gilroy-Bold', color: '#fff'}}
                                    onPress={() => this.getSignature()}
                                />
                            </View>

                        </View>
 

                    </ScrollView>

                    <Modal 
                        visible={this.state.isSignature}>
                        <View style={{flex: 1}}>
                            {/*------- signature---------*/}
                            <View style={{padding: 10, alignItems:'center'}} >
                                <Text style={{fontFamily: 'DancingScript-Regular', fontSize: 35}}>Signature</Text>
                            </View>
                            <View style={{flex: 1, margin: 15, borderWidth: 1, borderColor: language.textColor}}>
                                <SignaturePad onError={this._signaturePadError}
                                    onChange={this._signaturePadChange}
                                    style={{flex: 1, backgroundColor: 'white', }}/>
                            </View>
                        </View>
                        <View>
                            <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'center', padding: 15}}>
                                <View style={{flex: 1, marginRight: 5}}>
                                    <Button 
                                        title={language.close}
                                        buttonStyle={{backgroundColor: language.danger, borderRadius: 50}}
                                        titleStyle={{fontFamily: 'Poppins-Bold', color: '#fff'}}	
                                        onPress={() => this.setState({isSignature: false, acceptorSignature: null})}
                                    />
                                </View>
                                <View style={{flex: 1, marginLeft: 5, justifyContent: 'center'}}>
                                    <Button 
                                        title={language.save}
                                        buttonStyle={{backgroundColor: language.primary, borderRadius: 50}}
                                        titleStyle={{fontFamily: 'Poppins-Bold', color: '#fff'}}
                                        onPress={() => this.saveSignature()}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>

                  
                </SafeAreaView>
            </Modal>
		)
	}

}

const style = StyleSheet.create({
    TextInputStyleClass:{
		padding: 10,
		borderWidth: 1,
		borderColor: '#d3d3d3',
		borderRadius: 20 ,
		backgroundColor : "#FFFFFF",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        width: 250,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
})