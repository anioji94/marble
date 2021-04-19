import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, KeyboardAvoidingView, Image, FlatList } from 'react-native';
import MarbleInput from './MarbleInput'
import Marble from './Marble'
import firebase from '../database/firebase'
import LottieView from 'lottie-react-native';

export default class About extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <Text>About us.</Text>
    )
  }
}