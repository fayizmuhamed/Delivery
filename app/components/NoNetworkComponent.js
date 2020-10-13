import React, { Component} from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import * as language from '../constants/languages';

export default class NoNetworkComponent extends React.Component { 

	constructor(props) {
		super(props);
	}

	render() {
		return(
			<SafeAreaView style={style.contentWrapper}>
				<View style={{backgroundColor: language.danger, flex: 1, paddingVertical: 2 }}>
                    <Text style={{color: "#fff", textAlign:'center'}}>{language.network}</Text>
				</View>
			</SafeAreaView>
		)
	}
}

const style = StyleSheet.create({
	contentWrapper: {
		flex: 1,
		flexDirection: 'row', 
		alignItems: 'flex-end',
		
	}
})