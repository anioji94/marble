import React, { Component } from 'react';
import { LogBox, ScrollView, TouchableOpacity, StyleSheet, View, Text, Button, KeyboardAvoidingView, Image, FlatList } from 'react-native';
import MarbleInput from './MarbleInput'
import Marble from './Marble'
import Profile from './profile';
import firebase from '../database/firebase'
import LottieView from 'lottie-react-native';

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

  LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
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
  return date + '/' + month + '/' + year;
}
handleAddMarble = (activity, cost) => {
  const costInt = parseFloat(cost);
  const date = this.getCurrentDate();
  this.setState({jarValue: this.state.jarValue + costInt})
  this.setState({activity: activity});
  this.setState({ marbles: [...this.state.marbles, {date: date, activity: activity, cost: costInt}] }, function() {
  this.storeMarble();
  })
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
  this.add_marble_animation.play(20, 63);
}

render() {

  const { marbles } = this.state;
  let recentHeading = ""
  marbles.length > 0 ? recentHeading = "Recent Marbles" : recentHeading = "" //render heading depends on marbles count
  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior="height">
      <ScrollView>
    <View style={styles.container}>


			<LottieView
            autoPlay={false}
						loop={false}
						ref={animation => {
              this.add_marble_animation = animation;
            }}
						style={styles.jar}
            source={require('../assets/animations/add-marble-gold.json')}
          />
      <Text style={styles.jarValue}>Jar Value: £ {(this.state.jarValue).toFixed(2)}</Text>
      <MarbleInput onSubmit={this.handleAddMarble}/>
      <Text style={styles.recentMarblesHeading}>{recentHeading}</Text>
     <View style={styles.recentMarbles}>

      <FlatList
      data={marbles.slice().reverse()}
      renderItem={({item}) => <Marble date = {item.date} activity={item.activity} cost={item.cost} />}
      keyExtractor={(item, index) => {
        return  index.toString();
       }}
       contentContainerStyle={{ paddingBottom: 20 }}
      />
      </View>
      <Button
          color="#3740FE"
          title="Logout"
          onPress={() => this.signOut()}
        />
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
},
title: {
  fontSize: 30,
  marginTop: 20,
  marginLeft: 10,
},
jar: {
  alignSelf: 'center',
  width: 280,
  position: 'absolute', top: 0,
},
jarValue: {
  marginTop: 260,
  textAlign: 'center',
  color: '#82A993',
  fontWeight: 'bold'
},
recentMarblesHeading: {
  fontSize: 20,
  marginLeft: 25,
  marginTop: 15,
  color: '#82A993',
  fontWeight: 'bold'
},
button: {
  backgroundColor: '#FAF5F0',
  width: 700,
  padding: 10,
  marginTop: 10,
  alignItems: 'center',
},
text: {
  color: '#567061',
  fontWeight: 'bold'
},
recentMarbles: {
  flex: 1,
  marginBottom: 10,
  marginTop: 10,
  backgroundColor: '#fffafa',
  borderRadius: 20,
  width: 350,
  alignSelf: 'center',
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
  elevation: 3,
  padding: 10
}
});
