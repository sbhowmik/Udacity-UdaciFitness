import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import UdaciSteppers from './UdaciStepper'
import UdaciSlider from './UdaciSlider'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import  TextButton  from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions' 
import { white, purple, grey, lightPurp } from '../utils/colors'
//import { CommonActions } from '@react-navigation/core';


//SubmitBtn class
function SubmitBtn ({ onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn, 
                           disabled ? styles.disabled : null]} 
      onPress={onPress}
      disabled={disabled}
      >
      <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  )
}

//AddEntry class
class AddEntry extends Component {
  
  //metrics for each item
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  }

  //stepper increment
  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState((state) => {
      const count = state[metric] + step
      //
      return {
        ...state,
        [metric]: count > max ? max : count
      }

    })
  }

  //stepper decrement
  decrement = (metric) => {

    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step
      //
      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })
  }

  //slider value capture
  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value, 
    }))
  }

  //submit a current day
  submit = () => {
    const key = timeToString()
    const entry = this.state

    // Update Redux
    this.props.dispatch(addEntry({
      [key]: entry
    }))
    this.setState(() => ({ run: 0, bike: 0, swim: 0, sleep: 0, eat: 0 }))

    // Navigate to home
    this.props.goBack()

    // Save to "DB"...ie local storage
    submitEntry({key, entry})

    // Clear local notification
  }

  //reset a day
  reset = () => {
    const key = timeToString()

    //Update redux
    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue()
    }))

    //Navigate to Home
    this.props.goBack()

    // Save to "DB"...ie local storage
    removeEntry(key)

  }

  //render
  render() {
    const metaInfo = getMetricMetaInfo()
    const NotFilled = Object.keys(this.state).map((key) => this.state[key])
                                .filter((filt) => filt != 0)
    
    //if data is logged...show and exit
    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name = {Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
            size = {100}
          />
          <Text>You already logged your information for today.</Text>
          <TextButton 
            style={{padding: 10}}
            onPress={this.reset}>
            RESET
          </TextButton>
        
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {/* <Text>{JSON.stringify(this.state)}</Text> */}
        
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest  } = metaInfo[key]
          const value = this.state[key]

          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                    />
                : <UdaciSteppers
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                    />
              }
            </View>
          )//inside_return
        })}
        <SubmitBtn 
          onPress={this.submit} 
          disabled={NotFilled.length ===0 ? true : false}
        />
      </View>
    ) 
  }
}

//create styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30
  },
  disabled: {
    backgroundColor:lightPurp, 
    color: grey
  }
})

//
function mapStateToProps (state) {
  const key = timeToString() //key for today

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

//
function mapDispatchToProps(dispatch, { navigation }){
  return{
      dispatch,
      goBack: () => navigation.goBack()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEntry)
