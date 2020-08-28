import React from 'react'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { AppHeaderIcon } from '../components/AppHeaderIcon'
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button,
  Platform,
  KeyboardAvoidingView,
  YellowBox,
} from 'react-native'
import { THEME } from '../theme'
import MentionsTextInput from 'react-native-mentions'
import { GiftedChat, Send } from 'react-native-gifted-chat'

const users = [
  { id: 1, name: 'Raza Dar', username: 'mrazadar', gender: 'male' },
  { id: 3, name: 'Atif Rashid', username: 'atif.rashid', gender: 'male' },
  { id: 4, name: 'Peter Pan', username: 'peter.pan', gender: 'male' },
  { id: 5, name: 'John Doe', username: 'john.doe', gender: 'male' },
  { id: 6, name: 'Meesha Shafi', username: 'meesha.shafi', gender: 'female' },
]

const messages = [
  {
    _id: 1,
    text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
    createdAt: new Date(),
    quickReplies: {
      type: 'radio', // or 'checkbox',
      keepIt: true,
      values: [
        {
          title: '😋 Yes',
          value: 'yes',
        },
        {
          title: '📷 Yes, let me show you with a picture!',
          value: 'yes_picture',
        },
        {
          title: '😞 Nope. What?',
          value: 'no',
        },
      ],
    },
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 2,
    text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
    createdAt: new Date(),
    quickReplies: {
      type: 'checkbox', // or 'checkbox',
      values: [
        {
          title: 'Yes',
          value: 'yes',
        },
        {
          title: 'Yes, let me show you with a picture!',
          value: 'yes_picture',
        },
        {
          title: 'Nope. What?',
          value: 'no',
        },
      ],
    },
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 9,
    text: 'You are officially rocking GiftedChat.',
    createdAt: new Date(),
    system: true,
  },
]
const { height, width } = Dimensions.get('window')

export const ChatScreen = () => {
  const [value, setValue] = React.useState('')
  const [keyword, setKeyword] = React.useState('')

  const onSuggestionTap = (username, hidePanel) => {
    hidePanel()
    const comment = value.slice(0, -keyword.length)
    setValue(comment + '@' + username + ' ')
  }
  const callback = (key) => {
    setKeyword(key)
  }
  const onChangeText = (e) => {
    // here we will check the hole Value for the ' @'
    setValue(e)
  }
  const onSend = () => {}
  const renderSuggestionsRow = ({ item }, hidePanel) => {
    return (
      <TouchableOpacity onPress={() => onSuggestionTap(item.username, hidePanel)}>
        <View style={styles.suggestionsRowContainer}>
          <View style={styles.userIconBox}>
            <Text style={styles.usernameInitials}>
              {!!item.name && item.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userDetailsBox}>
            <Text style={styles.displayNameText}>{item.name}</Text>
            <Text style={styles.usernameText}>@{item.username}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  const renderComposer = (props) => {
    return (
      <View style={styles.composerContainer}>
        <View style={styles.inputContainer}>
          <MentionsTextInput
            textInputStyle={styles.textInputStyle}
            suggestionsPanelStyle={{ backgroundColor: 'rgba(100,100,100,0.1)' }}
            loadingComponent={() => (
              <View style={{ flex: 1, width, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
              </View>
            )}
            textInputMinHeight={40}
            textInputMaxHeight={90}
            trigger={'@'}
            triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
            value={value}
            onChangeText={onChangeText}
            triggerCallback={callback}
            renderSuggestionsRow={renderSuggestionsRow}
            suggestionsData={users} // array of objects
            keyExtractor={(item, index) => item.username}
            suggestionRowHeight={45}
            horizontal={false} // defaut is true, change the orientation of the list
            MaxVisibleRowCount={3} // this is required if horizontal={false}
          />
        </View>
        <Send {...props}>
          <View style={styles.sendContainer}>
            <Image source={require('../../assets/Send.png')} style={styles.sendIconStyle} />
          </View>
        </Send>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        renderComposer={renderComposer}
        user={{ _id: 1 }}
        renderAvatar={null}
        renderSend={() => null}
        alwaysShowSend={true}
        minComposerHeight={40}
        maxComposerHeight={90}
        bottomOffset={Platform.select({
          ios: 200,
          android: 0,
        })}
      />
      <KeyboardAvoidingView
        behavior={'padding'}
        enabled
        keyboardVerticalOffset={Platform.select({
          ios: 15,
          android: 0,
        })}
      />
      <Button
        title='Clear textinput'
        color={THEME.MAIN_COLOR}
        onPress={() => {
          setValue('')
        }}
      />
    </View>
  )
}

ChatScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Gifted Chat & Mentions ',
  headerLeft: () => (
    <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
      <Item titel='Toggle Drawer' iconName='ios-menu' onPress={() => navigation.toggleDrawer()} />
    </HeaderButtons>
  ),
})

const styles = StyleSheet.create({
  container: {
    height: 400,
  },
  suggestionsRowContainer: {
    flexDirection: 'row',
  },
  userAvatarBox: {
    width: 35,
    paddingTop: 2,
  },
  userIconBox: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#54c19c',
  },
  usernameInitials: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 15,
  },
  displayNameText: {
    fontSize: 13,
    fontWeight: '500',
  },
  usernameText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },
  sendIconStyle: {
    height: 40,
    width: 40,
  },
  sendWrapperStyle: {
    width: '10%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  sendContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  inputContainer: {
    width: '90%',
  },
  composerContainer: {
    flexDirection: 'row',
    width: width,
  },
  textInputStyle: {
    borderColor: '#ebebeb',
    borderWidth: 1,
    padding: 5,
    fontSize: 15,
  },
})

YellowBox.ignoreWarnings(['Animated: `useNativeDriver` was not specified.'])
