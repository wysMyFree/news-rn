import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { AppHeaderIcon } from '../components/AppHeaderIcon'
import { THEME } from '../theme'
import { addPost } from '../redux/reducers/post'
import { PhotoPicker } from '../components/PhotoPicker'

export const CreateScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const [text, setText] = React.useState('')
  const imgRef = React.useRef()

  const saveHandler = () => {
    const post = {
      author: 'own',
      publishedAt: new Date().toJSON(),
      description: text,
      booked: false,
      urlToImage: imgRef.current,
    }
    dispatch(addPost(post))
    navigation.navigate('MainScreen')
  }
  const photoPickHandler = (uri) => {
    imgRef.current = uri
  }
  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Create new post</Text>
          <TextInput
            style={styles.textarea}
            placeholder='Enter text'
            value={text}
            onChangeText={setText}
            multiline
          />
          <PhotoPicker onPick={photoPickHandler} />
          <Button
            title='Create post'
            color={THEME.MAIN_COLOR}
            onPress={saveHandler}
            disabled={!text}
          />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  )
}

CreateScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Create Post',
  headerLeft: () => (
    <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
      <Item titel='Toggle Drawer' iconName='ios-menu' onPress={() => navigation.toggleDrawer()} />
    </HeaderButtons>
  ),
})

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'roboto-regular',
    marginVertical: 10,
  },
  textarea: {
    padding: 10,
    marginBottom: 10,
  },
})
