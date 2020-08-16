import React from 'react'
import { StyleSheet, Text, TouchableOpacity, ImageBackground, View } from 'react-native'

export const NewsPost = ({ newsItem, onOpen }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onOpen(newsItem)}>
      <View style={styles.card}>
        <ImageBackground
          style={styles.image}
          source={
            newsItem.urlToImage
              ? { uri: newsItem.urlToImage }
              : require('../../assets/empty-image.png')
          }
        >
          <View style={styles.textWrap}>
            <Text style={styles.title}>{new Date(newsItem.publishedAt).toLocaleDateString()} </Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  textWrap: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: '#fff',
    fontFamily: 'roboto-regular',
  },
})
