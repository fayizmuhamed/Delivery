import React, {Component} from 'react';
import { Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import * as language from '../constants/languages';
import { withNavigation } from 'react-navigation';
import Feather from 'react-native-vector-icons/Feather';
class HeaderComponent extends React.Component{

	render() {
		return(
            <View style={{flexDirection: 'row', padding: 15}}>
				<View style={{ flex:1, alignItems: 'flex-start', justifyContent: 'center'}}>
                    <TouchableOpacity onPress = {() => this.props.navigation.openDrawer()}>
                            <Feather name="menu" size={25} color={language.primary}/>
                    </TouchableOpacity>
				</View>
                <View style={{ flex:2, alignItems: 'center', justifyContent: 'center'}}>
					<Text style={{fontFamily: 'Gilroy-Bold', fontSize: 17}}>{this.props.title}</Text>
				</View>
                <View style={{ flex:1, alignItems: 'center', justifyContent: 'center'}}></View>
			</View>
		)
	}


}
const style = StyleSheet.create({
	headingUnderline: {
		borderColor: language.primary,
		borderBottomWidth: 5,
		width: '35%',
		borderRadius: 15,
		marginTop: 5
	}
})
export default withNavigation(HeaderComponent)