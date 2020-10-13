import React, {Component} from 'react';
import { View,  StyleSheet,  ActivityIndicator } from 'react-native';
import * as language from '../constants/languages';


export default class SpinnerComponent extends React.Component {


	render() {
		return(
			<View style={style.spinneWrapper}>
				<ActivityIndicator size="large" color={language.primary} />
			</View>
		)
	}

}

const style = StyleSheet.create({
 
	spinneWrapper :{
		flex:1,
		justifyContent: 'center',
		alignItems: 'center'
	},
})