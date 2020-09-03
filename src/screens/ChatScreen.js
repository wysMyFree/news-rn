import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { AppHeaderIcon } from '../components/AppHeaderIcon'
import {
  Platform,
  Animated,
  StyleSheet,
  TextInput,
  View,
  Image,
  Text,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  YellowBox,
} from 'react-native'
import { GiftedChat, Send } from 'react-native-gifted-chat'
import { THEME } from '../theme'
import MessageBubble from '../components/MessageBubble/MessageBuble'
import { addMessage } from '../redux/reducers/chat'

const { width } = Dimensions.get('window')

export const ChatScreen = () => {
  const { messages, userList } = useSelector(({ chat }) => chat)
  const dispatch = useDispatch()
  const [messageText, setMessageText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [userData, setUserData] = useState(userList)
  const [keyword, setKeyword] = useState(' ')
  const [previousChar, setPreviousChar] = useState(' ')

  const [suggestionRowHeight] = useState(new Animated.Value(0))

  React.useEffect(() => {
    if (modalVisible) {
      const height = userData.length * 55 >= 180 ? 180 : userData.length * 55
      openSuggestionsPanel(height)
    }
  }, [messageText])

  const openSuggestionsPanel = (height) => {
    setModalVisible(true)
    Animated.timing(suggestionRowHeight, {
      toValue: height ? height : suggestionRowHeight,
      duration: 100,
    }).start()
  }

  const closeSuggestionsPanel = () => {
    setModalVisible(false)
    Animated.timing(suggestionRowHeight, {
      toValue: 0,
      duration: 100,
    }).start()
  }

  const onSend = React.useCallback((message = []) => {
    console.log(message)
    dispatch(addMessage(message))
  }, [])

  const updateSuggestions = (keyword) => {
    if (Array.isArray(userList)) {
      setUserData([
        ...userList.filter((obj) => {
          if (keyword.slice(1) === '') return true
          if (
            obj.name.toLowerCase().includes(keyword.slice(1).toLowerCase()) ||
            obj.username.toLowerCase().includes(keyword.slice(1).toLowerCase())
          )
            return true
        }),
      ])
      setKeyword(keyword)
    }
  }
  const identifyKeyword = (val) => {
    if (modalVisible) {
      const pattern = new RegExp(`\\B@[a-z0-9_-]+|\\B@`, `gi`)
      const keywordArray = val.match(pattern)
      if (keywordArray && !!keywordArray.length) {
        const lastKeyword = keywordArray[keywordArray.length - 1]
        updateSuggestions(lastKeyword)
      }
    }
  }
  const onTextChange = (value, props) => {
    props.onTextChanged(value)
    setMessageText(value)
    const lastChar = value.substr(value.length - 1)
    const wordBoundry = previousChar.trim().length === 0
    if (lastChar === '@' && wordBoundry) {
      openSuggestionsPanel()
    } else if ((lastChar === ' ' && modalVisible) || value === '') {
      closeSuggestionsPanel()
    }
    setPreviousChar(lastChar)
    identifyKeyword(value)
  }

  const renderComposer = (props) => {
    return (
      <View style={styles.wrapper}>
        <Animated.View style={[styles.suggestionsContainer, { height: suggestionRowHeight }]}>
          <FlatList
            keyboardShouldPersistTaps={'always'}
            horizontal={false}
            ListEmptyComponent={loadingComponent}
            enableEmptySections={true}
            data={userData}
            style={styles.suggestionsList}
            keyExtractor={(item) => `${item.id}`}
            renderItem={(item, index) => renderSuggestionsRow(item, index)}
          />
        </Animated.View>
        <View style={styles.composerContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              {...props}
              placeholder={'Type something...'}
              onChangeText={(value) => onTextChange(value, props)}
              style={styles.textInput}
              value={props.text}
              multiline={true}
            />
          </View>
          <Send {...props} containerStyle={styles.sendWrapperStyle}>
            <View style={styles.sendContainer}>
              <Image source={require('../../assets/Send.png')} style={styles.sendIconStyle} />
            </View>
          </Send>
        </View>
      </View>
    )
  }

  const loadingComponent = () => {
    return (
      <View style={{ flex: 1, width, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  const renderSuggestionsRow = ({ item }) => {
    return (
      <TouchableOpacity style={styles.suggestionClickStyle} onPress={() => onSuggestionTap(item)}>
        <View style={styles.suggestionRowContainer}>
          {item.image ? (
            <Image style={styles.userImage} source={{ uri: item.image }} />
          ) : (
            <View style={styles.userIconBox}>
              <Text style={styles.usernameInitials}>
                {!!item.name && item.name.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.userDetailsBox}>
            <Text style={styles.displayNameText}>{item.name}</Text>
            <Text style={styles.userNameText}>@{item.username}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const onSuggestionTap = (dataObj) => {
    closeSuggestionsPanel()
    const sliceText = messageText.slice(0, -keyword.length)

    setMessageText(sliceText + '@' + dataObj.name + ' ')
    setUserData([...userList])
    setKeyword(' ')
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderComposer={renderComposer}
        listViewProps={{
          style: styles.listContainer,
          contentContainerStyle: styles.msgListContainer,
        }}
        user={{ _id: 1 }}
        renderMessage={(props) => {
          return <MessageBubble messageObj={props.currentMessage} position={props.position} />
        }}
        renderAvatar={null}
        renderSend={() => null}
        text={messageText}
        alwaysShowSend={true}
        minComposerHeight={55}
        maxComposerHeight={55}
        bottomOffset={Platform.select({
          ios: 100,
          android: 0,
        })}
      />
      <KeyboardAvoidingView
        behavior={'padding'}
        enabled
        keyboardVerticalOffset={Platform.select({
          ios: 15,
          android: -160,
        })}
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
    flex: 1,
    padding: 10,
    width: '100%',
    backgroundColor: 'rgb(245, 245, 245)',
  },
  wrapper: {
    bottom: 0,
  },
  suggestionsContainer: {
    maxHeight: 180,
  },
  listContainer: {
    width: '100%',
  },
  sendIconStyle: {
    height: 30,
    width: 30,
  },
  composerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '85%',
  },
  textInput: {
    fontSize: 14,
    letterSpacing: 1,
    height: 50,
    borderWidth: 0,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  sendWrapperStyle: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionClickStyle: {
    height: 55,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgb(245, 245, 245)',
    padding: 10,
  },
  userAvatarBox: {
    width: 35,
    paddingTop: 2,
    paddingBottom: 2,
  },
  userIconBox: {
    height: 40,
    width: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.MAIN_COLOR,
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
  suggestionRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
})

YellowBox.ignoreWarnings(['Animated: `useNativeDriver` was not specified.'])
