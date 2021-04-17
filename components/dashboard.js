import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, KeyboardAvoidingView, Image, FlatList } from 'react-native';
import MarbleInput from './MarbleInput'
import Marble from './Marble'
import firebase from '../database/firebase';

export default class Dashboard extends Component {

  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate('Login')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }

constructor(props) {
  super(props);
  this.dbRef = firebase.firestore().collection('marbles');
  this.state = {
    jarValue: 0,
    activity: '',
    marbles: [],
    uid: '',
    isLoading: false, 
    email: '',
  }
}
componentDidMount() {
  const user = firebase.auth().currentUser
  const dbRef = this.dbRef.doc(user.email)
  dbRef.get().then((res) => {
    if (res.exists) {
      const marbles = res.data();
      this.setState({
        jarValue: marbles.marbleValue,
        marbles: marbles.marbles,
        email: user.email,
        isLoading: false
      });
    } else {
      console.log("Document does not exist!");
    }
  });
}
getCurrentDate = () => {
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  //return date in the desired format
  return date + '/' + month + '/' + year;
}
handleAddMarble = (activity, cost) => {
  const costInt = parseInt(cost);
  const date = this.getCurrentDate();
  this.setState({jarValue: this.state.jarValue + costInt})
  this.setState({activity: activity});
  this.setState({ marbles: [...this.state.marbles, {date: date, activity: activity, cost: costInt}] }, function() {
    this.storeMarble();
  })
  this.updateMarble();
}
storeMarble() {
  const user = firebase.auth().currentUser
  this.setState({isLoading: true,});
  this.dbRef.doc(user.email).set({
    uid: user.email,
    marbleValue: this.state.jarValue,
    marbles: this.state.marbles,
  }).then((res) => {
    this.setState({
      isLoading: false,    
    });
  })
}
updateMarble() {

}
render() {
  const { marbles } = this.state;
  let recentHeading = ""
  marbles.length > 0 ? recentHeading = "Recent Marbles" : recentHeading = "" //render heading depends on marbles count
  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior="height">
    <View style={styles.container}>
      <Text style={styles.title}>Marble</Text>
      <Image style={styles.jar} source={require('../assets/jar.gif')}/>
      <Text style={styles.jarValue}>Jar Value: £ {this.state.jarValue}</Text>
      <MarbleInput onSubmit={this.handleAddMarble}/>
      <Text style={styles.recentMarblesHeading}>{recentHeading}</Text>

      <FlatList
      data={marbles}
      renderItem={({item}) => <Marble date = {item.date} activity={item.activity} cost={item.cost} />}
      keyExtractor={(item, index) => {
        return  index.toString();
       }}
      />

      <Button
          color="#3740FE"
          title="Logout"
          onPress={() => this.signOut()}
        />

    </View>
    </KeyboardAvoidingView>
  );
}
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#e6fffa',
},
title: {
  fontSize: 30,
  marginTop: 20,
  marginLeft: 10,
},
jar: {
  alignSelf: 'center',
  resizeMode: 'contain',
  width: 180,
  position: 'absolute', top: -100,
},
jarValue: {
  marginTop: 260,
  textAlign: 'center'
},
recentMarblesHeading: {
  fontSize: 20,
  marginLeft: 10,
  marginTop: 10,
}
});
