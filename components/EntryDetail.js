import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { white } from '../utils/colors'
import MetricCard from './MetricCard'
import { addEntry } from '../actions'
import { removeEntry } from '../utils/api'
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import TextButton from './TextButton'

//
class EntryDetail extends Component {
  
  //
  setTitle = (formattedDate) =>{
    //const year = entryId.slice(0,4)
    //const month = entryId.slice(5,7)
    //const day = entryId.slice(8)
    this.props.navigation.setOptions({
      title: formattedDate // `${month}/${day}/${year}`
    })
  }

  //for resetting the day's entry
  reset = () =>{
    const { remove, goBack, entryId } = this.props
    remove()
    goBack()
    removeEntry(entryId)
  }
  
  // This is a build-in function that defines rules for rendering the component.
  shouldComponentUpdate(nextProps){
    //nextProps.metrics is available.
    //!nextProps.metrics.today is falsy
    return nextProps.metrics && !nextProps.metrics.today;
  }

  //
  render() {
    //const { entryId } = this.props.route.params
    const { metrics, formattedDate } = this.props
    this.setTitle(formattedDate)

    //this.setTitle(entryId)    
    return (
      <View style= {styles.container}>
        <MetricCard metrics={metrics} />
        <TextButton onPress={this.reset} style={{margin:20}}>RESET</TextButton>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
      flex: 1,
      backgroundColor: white,
      padding: 15
  }
})

//
function mapStateToProps(state, { route } ){
  const { entryId, formattedDate } = route.params
  return{
      entryId, 
      formattedDate,
      metrics: state[entryId]
  }
}


// Add dispatch handlers. This returns functions that uses dispatch
function mapDispatchToProps(dispatch, { route, navigation }){
  const { entryId } = route.params

  return{
     remove: () => dispatch(addEntry({
         [entryId]: timeToString() === entryId
         ? getDailyReminderValue()
         : null
     })),
     goBack: () => navigation.goBack()
  }
}

//
export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail)

