import React, { Component } from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { Foundation } from '@expo/vector-icons'
import { purple, white } from '../utils/colors'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import { calculateDirection } from '../utils/helpers'

export default class Live extends Component {

  //state
  state = {
    coords: null,
    status: null,
    direction: '',
    bounceValue: new Animated.Value(1)
  }

  //
  componentDidMount() {
    this.getPermission()
}

  //
  getPermission = () => {
    Permissions.getAsync(Permissions.LOCATION)
      .then(({ status }) => {
        if (status === 'granted') {
          return this.setLocation()
        }
        this.setState(() => ({ status }))
      })
      .catch((error) => {
        console.warn('Error asking Location permission: ', error)
        this.setState(() => ({ status: 'undetermined' }))
      })
  }

  //
  askPermission = () => {
    Permissions.askAsync(Permissions.LOCATION)
      .then(({ status }) => {
        if (status === 'granted') {
          return this.setLocation()
        }
        this.setState(() => ({ status }))
      })
      .catch((error) => {
        console.warn('Error asking Location permission: ', error)
        this.setState(() => ({ status: 'undetermined' }))
      })
  }

  //
  setLocation = () => {
    Location.watchPositionAsync({
      enableHighAccuracy: true,
      timeInterval: 1,
      distanceInterval: 1,
    }, ({ coords }) => {
      const newDirection = calculateDirection(coords.heading)
      const { direction, bounceValue } = this.state

      if (newDirection !== direction) {
        Animated.sequence([
          Animated.timing(bounceValue, {duration:200, toValue: 1.04} ),
          Animated.spring(bounceValue, {toValue: 1, friction: 4} )
        ]).start()
      }

      this.setState(() => ({
        coords,
        status: 'granted',
        direction: newDirection,
      }))
    })
}

  //
  render() {
    const { status, coords, direction, bounceValue } = this.state

    //if nothing has changed from the default state
    if (status === null) {
      return <ActivityIndicator style={{marginTop: 30}}/>
    }

    //if permission is denied
    if (status === 'denied') {
      return (
        <View>
          <Foundation name='alert' size={50} />
          <Text>Access was Denied. Enable from settings or below for this app section to work.</Text>
          <TouchableOpacity onPress={this.askPermission} style={styles.button}>
            <Text style={styles.buttonText}>
              Enable
            </Text>
          </TouchableOpacity>
        </View>
      )
    }

    //if permission is undertermined
    if (status === 'undetermined') {
      return (
        <View style={StyleSheet.center}>
          <Foundation name='alert' size={50} />
          <Text>Please enable location services for this app section.</Text>
          <TouchableOpacity onPress={this.askPermission} style={styles.button}>
            <Text style={styles.buttonText}>
              Enable
            </Text>
          </TouchableOpacity>
        </View>
      )
    }

    //if permission granted
    return (
      <View style={styles.container}>
        <View style={styles.directionContainer}>
          <Text style={styles.header}>You're heading</Text>
          <Animated.Text 
            style={[styles.direction, {transform: [{scale: bounceValue}]}]}>
              {direction}
          </Animated.Text>
        </View>
        <View style={styles.metricContainer}>
          <View style={styles.metric}>
            <Text style={[styles.header, {color: white}]}>Altitude</Text>
            <Text style={[styles.subHeader, {color: white}]}>
              {Math.round(coords.altitude * 3.2808)} Feet
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={[styles.header, {color: white}]}>
              Speed
            </Text>
            <Text style={[styles.subHeader, {color: white}]}>
              {Math.round(coords.speed * 2.2369).toFixed(1)} MPH
            </Text>
          </View>
        </View>
      </View>
    )


  }//render
}//class

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  button: {
    padding: 10,
    backgroundColor: purple,
    alignSelf: 'center',
    borderRadius: 5,
    margin: 20,
  },
  buttonText :{
    color: white,
    fontSize: 20,
  },
  directionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 35,
    textAlign: 'center',
  },
  direction: {
    color: purple,
    fontSize: 80,
    textAlign: 'center',
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: purple,
  },
  metric: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  subHeader: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 5,
  }
}) 