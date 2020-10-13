import React, { Component} from 'react';
import { Text, TextInput } from 'react-native';

export const fontfix = () => {
  const oldRender = Text.render
  const oldRenderTextInput = TextInput.render
  Text.render = function (...args) {
    const origin = oldRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [{fontFamily: 'Gilroy-Medium', color: '#515151'}, origin.props.style]
    })
  }
  TextInput.render = function (...args) {
    const origin = oldRenderTextInput.call(this, ...args);
    return React.cloneElement(origin, {
      style: [{fontFamily: 'Gilroy-Medium', color: '#515151'}, origin.props.style]
    })
  }


}