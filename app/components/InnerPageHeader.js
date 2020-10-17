import React, {Component} from 'react';
import { Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import * as language from '../constants/languages';
import { withNavigation } from 'react-navigation';

class InnerPageHeader extends React.Component{

	render() {
		return(
            <View style={{flexDirection: 'row', padding: 15}}>
				<View style={{ flex:1, alignItems: 'flex-start', justifyContent: 'center'}}>
                    <TouchableOpacity onPress = {() => this.props.navigation.goBack(null)}>
                        <Feather name="chevron-left" size={22} color={language.primary}/>
                    </TouchableOpacity>
				</View>
                <View style={{ flex:2, alignItems: 'center', justifyContent: 'center'}}>
					<Text style={{fontFamily: 'Gilroy-Bold', fontSize: 17 ,color:language.textColor}}>{this.props.title}</Text>
				</View>
                <View style={{ flex:1, alignItems: 'center', justifyContent: 'center'}}></View>
			</View>
		)
    }
    
}

export default withNavigation(InnerPageHeader)