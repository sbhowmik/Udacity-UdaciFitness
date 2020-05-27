import React from 'react'
import { Text } from 'react-native'
import { purple } from '../utils/colors'

//stateless functional component
export default function DateHeader ({ date }) {
  return (
    <Text style={{color: purple, fontSize: 25}}>
      {date}
    </Text>
  )
}