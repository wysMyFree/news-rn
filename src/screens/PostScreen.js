import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, View, Text, Button, Image, ScrollView, Alert, YellowBox } from 'react-native'
import { THEME } from '../theme'
import { removePost, toggleBooked } from '../redux/reducers/post'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { AppHeaderIcon } from '../components/AppHeaderIcon'

export const PostScreen = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const newsPosts = useSelector(({ post }) => post.newsPosts)
  const postId = route.params.postId
  const post = newsPosts.find((p) => p.id === postId)
  const booked = newsPosts.filter((i) => i.booked === true).find((post) => post.id === postId)

  React.useEffect(() => {
    navigation.setParams({ booked })
  }, [booked])

  const toggleHandler = React.useCallback(() => {
    //    console.log(postId)
    dispatch(toggleBooked(postId))
  }, [dispatch, postId])

  React.useEffect(() => {
    navigation.setParams({ toggleHandler })
  }, [toggleHandler])

  const removeHandler = () => {
    Alert.alert(
      'Delete',
      'Are You sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress() {
            navigation.navigate('MainScreen')
            dispatch(removePost(postId))
          },
        },
      ],
      { cancelable: false }
    )
  }
  if (!post) {
    return null
  }
  return (
    <ScrollView>
      <Image
        source={
          post.urlToImage ? { uri: post.urlToImage } : require('../../assets/empty-image.png')
        }
        style={styles.image}
      />
      <View style={styles.textWrap}>
        <Text> {post.description} </Text>
      </View>
      <Button title='Remove' color={THEME.DANGER_COLOR} onPress={removeHandler} />
    </ScrollView>
  )
}

PostScreen.navigationOptions = ({ route }) => {
  const postTitle = route.params.postTitle
  const booked = route.params.booked
  const toggleHandler = route.params.toggleHandler
  const iconName = booked ? 'ios-star' : 'ios-star-outline'
  return {
    headerTitle: postTitle,
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
        <Item titel='Take photo' iconName={iconName} onPress={toggleHandler} />
      </HeaderButtons>
    ),
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
  },
  textWrap: {
    padding: 10,
  },
  title: {
    fontFamily: 'roboto-regular',
  },
})
YellowBox.ignoreWarnings(['Non-serializable values were found in the navigation state'])
