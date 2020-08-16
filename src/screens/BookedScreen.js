import React from 'react'
import { useSelector } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { AppHeaderIcon } from '../components/AppHeaderIcon'
import { PostList } from '../components/PostList'

export const BookedScreen = ({ navigation }) => {
  const newsPosts = useSelector(({ post }) => post.newsPosts)

  const openPostHandler = (post) => {
    navigation.navigate('PostScreen', {
      postId: post.id,
      postTitle: post.title,
      booked: post.booked,
    })
  }

  return <PostList data={newsPosts.filter((post) => post.booked)} onOpen={openPostHandler} />
}

BookedScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Bookmarked',

  headerLeft: () => (
    <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
      <Item titel='Toggle Drawer' iconName='ios-menu' onPress={() => navigation.toggleDrawer()} />
    </HeaderButtons>
  ),
})
