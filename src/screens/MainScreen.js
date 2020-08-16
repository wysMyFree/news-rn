import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { AppHeaderIcon } from '../components/AppHeaderIcon'
import { getNews } from '../redux/reducers/post'
import { PostList } from '../components/PostList'
import { THEME } from '../theme'

export const MainScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const { newsPosts, loading } = useSelector(({ post }) => post)

  React.useEffect(() => {
    dispatch(getNews())
  }, [dispatch])

  const openPostHandler = (post) => {
    navigation.navigate('PostScreen', {
      postId: post.id,
      postTitle: post.title,
      booked: post.booked,
    })
  }
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={THEME.MAIN_COLOR} />
      </View>
    )
  }
  return <PostList data={newsPosts} onOpen={openPostHandler} />
}

MainScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: 'World News',
  headerRight: () => (
    <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
      <Item
        titel='Take photo'
        iconName='ios-camera'
        onPress={() => navigation.navigate('Create')}
      />
    </HeaderButtons>
  ),
  headerLeft: () => (
    <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
      <Item titel='Toggle Drawer' iconName='ios-menu' onPress={() => navigation.toggleDrawer()} />
    </HeaderButtons>
  ),
})
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
