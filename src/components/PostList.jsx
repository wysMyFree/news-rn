import React from 'react'
import { NewsPost } from '../components/NewsPost'
import { StyleSheet, View, FlatList } from 'react-native'

export const PostList = ({ data, onOpen }) => {
  return (
    <View style={styles.wrapper}>
      <FlatList
        data={data}
        keyExtractor={(f) => f.id}
        renderItem={({ item }) => <NewsPost newsItem={item} onOpen={onOpen} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
})
