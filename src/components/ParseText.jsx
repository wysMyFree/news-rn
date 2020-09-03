import React from 'react'
import { StyleSheet, Text } from 'react-native'

export const ParseText = ({ text }) => {
  const inputText = text.split(/(\s)/g).map((item, i) => {
    if (/@[a-zA-Z0-9]+/g.test(item)) {
      return (
        <Text key={i} style={{ color: 'red' }}>
          {item}
        </Text>
      )
    }
    return item
  })
  return <Text style={styles.text}>{inputText}</Text>
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    letterSpacing: 1.9,
    color: 'white',
  },
})
