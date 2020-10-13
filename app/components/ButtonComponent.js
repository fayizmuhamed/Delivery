import React from 'react';
import { Button } from 'react-native-elements';
import * as language from '../constants/languages';

export default (props) => {    

    return (
        <Button
            titleStyle={{fontFamily: 'Gilroy-Light', color: language.tertiary, justifyContent: 'center', alignItems: 'center' , flexWrap: 'wrap'}}
            containerStyle={{flex: 1, marginHorizontal: 2.5, }}
            {...props}
        />
    )
}
