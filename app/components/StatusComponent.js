import React, {Component} from 'react';
import { Text, View, StyleSheet, Modal, TextInput, SafeAreaView, ScrollView, ToastAndroid } from 'react-native';
import * as language from '../constants/languages';
import { Button } from 'react-native-elements';

export default class StatusComponent extends React.Component {

    constructor(props) {
		super(props);

		this.state = {
            reasonForStatus: "",
        };
    }
    
    async getReasonForStatus(text) {

       await this.setState({ 
            reasonForStatus: text,
       });

    }

    async reset() {

        this.setState({ reasonForStatus: "" })

    }

    async save() {

        if(this.state.reasonForStatus.trim() != "") {

            await this.props.handleStatusSave(this.state.reasonForStatus, this.props.orderId);
            await this.reset();


        } else{

            ToastAndroid.show("Required field empty", ToastAndroid.SHORT);

        }

    }

    async close() {

        await this.reset();
        await this.props.handleStatusClose()
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
                            <Text style={{fontFamily: 'Gilroy-light', fontSize: 25}}>{language.statusHeader}</Text>
                        </View>
                        <View style={{padding: 15}}>
           
                            <Text style={{fontFamily: 'Gilroy-Bold'}}>{this.props.title}</Text>

                            <View style={{flex: 1,borderRadius: 50, marginTop: 10}}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    placeholder = "Text here"
                                    style={{...style.TextInputStyleClass, height: 150, textAlignVertical: 'top'}}
                                    autoCapitalize={'none'}
                                    maxLength={255}
                                    multiline={true}
                                    onChangeText={(text) => this.getReasonForStatus(text)}/>
                            </View>
                        </View>

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
                                    title={language.save}
                                    buttonStyle={{backgroundColor: language.primary, borderRadius: 50}}
                                    titleStyle={{fontFamily: 'Gilroy-Bold', color: language.tertiary}}
                                    onPress={() => this.save()}
                                />
                            </View>

                        </View>

                    </ScrollView>
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
    container: {
        flex: 1,
    }
     
})