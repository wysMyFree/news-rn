import React from 'react'
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
import { GiftedChat, Send, Composer } from 'react-native-gifted-chat'
import { THEME } from '../theme'
import MessageBubble from '../components/MessageBubble/MessageBuble'

const userList = [
  {
    id: 1,
    name: 'Andy',
    username: 'andy',
    image: 'https://via.placeholder.com/300.png/09f/fff',
  },
  {
    id: 2,
    name: 'Boromir',
    username: 'boromir',
    image: 'https://via.placeholder.com/300.png/09f/fff',
  },
  {
    id: 3,
    name: 'Luc',
    username: 'luc',
    image: 'https://via.placeholder.com/300.png/09f/fff',
  },
  {
    id: 4,
    name: 'Angel',
    username: 'angel',
    image: 'https://via.placeholder.com/300.png/09f/fff',
  },
  {
    id: 5,
    name: 'Casedy',
    username: 'casedy',
    image: 'https://via.placeholder.com/300.png/09f/fff',
  },
  {
    id: 6,
    name: 'User6',
    username: 'user6',
    image: 'https://via.placeholder.com/300.png/09f/fff',
  },
]

export class ChatScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
      messageText: '',
      modalVisible: false,
      isLoading: false,
      userData: userList,
      keyword: ' ',
      previousChar: ' ',
      suggestionRowHeight: new Animated.Value(0),
    }
  }

  openSuggestionsPanel(height) {
    Animated.timing(this.state.suggestionRowHeight, {
      toValue: height ? height : this.props.suggestionRowHeight,
      duration: 100,
    }).start()
  }

  closeSuggestionsPanel() {
    Animated.timing(this.state.suggestionRowHeight, {
      toValue: 0,
      duration: 100,
    }).start()
  }

  onSend(message = []) {
    console.log(message)
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, message),
    }))
  }

  updateSuggestions = (keyword) => {
    this.setState({ isLoading: true }, () => {
      if (Array.isArray(userList)) {
        if (keyword.slice(1) === '') {
          this.setState({
            userData: [...userList],
            keyword,
            isLoading: false,
          })
        } else {
          const userDataList = userList.filter((obj) => obj.name.indexOf(keyword.slice(1)) !== -1)
          this.setState({
            userData: [...userDataList],
            keyword,
            isLoading: false,
          })
        }
      }
    })
  }
  identifyKeyword(val) {
    if (this.state.modalVisible) {
      console.log(val)
      const pattern = new RegExp(`\\B@[a-z0-9_-]+|\\B@`, `gi`)
      const keywordArray = val.match(pattern)
      if (keywordArray && !!keywordArray.length) {
        const lastKeyword = keywordArray[keywordArray.length - 1]
        this.updateSuggestions(lastKeyword)
      }
    }
  }
  onTextChange = (value, props) => {
    props.onTextChanged(value)
    this.setState({ messageText: value })
    const lastChar = value.substr(value.length - 1)
    const wordBoundry = this.state.previousChar.trim().length === 0
    if (lastChar === '@' && wordBoundry) {
      this.openSuggestionsPanel(200)
    } else if ((lastChar === ' ' && this.state.modalVisible) || value === '') {
      this.closeSuggestionsPanel()
    }
    this.setState({ previousChar: lastChar })
    this.identifyKeyword(value)
  }

  renderComposer = (props) => {
    return (
      <View style={styles.wrapper}>
        <Animated.View
          style={[styles.suggestionsContainer, { height: this.state.suggestionRowHeight }]}
        >
          <FlatList
            keyboardShouldPersistTaps={'always'}
            horizontal={false}
            ListEmptyComponent={this.loadingComponent}
            enableEmptySections={true}
            data={this.state.userData}
            keyExtractor={(item) => `${item.id}`}
            renderItem={(item, index) => this.renderSuggestionsRow(item, index)}
          />
        </Animated.View>
        <View style={styles.composerContainer}>
          <View style={styles.inputContainer}>
            <Composer
              {...props}
              placeholder={'Type something...'}
              ref={(input) => {
                this.msgInput = input
              }}
              onTextChanged={(value) => this.onTextChange(value, props)}
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

  loadingComponent = () => {
    return (
      <View style={{ flex: 1, width, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  renderSuggestionsRow = ({ item }) => {
    const profileImage = item.image === null ? Images.userLogo : { uri: item.image }
    return (
      <TouchableOpacity
        style={styles.suggestionClickStyle}
        onPress={() => this.onSuggestionTap(item)}
      >
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

  onSuggestionTap(dataObj) {
    this.closeSuggestionsPanel()
    const sliceText = this.state.messageText.slice(0, -this.state.keyword.length)
    this.setState({
      messageText: sliceText + '@' + dataObj.name + ' ',
      keyword: ' ',
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          renderComposer={this.renderComposer}
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
          text={this.state.messageText}
          alwaysShowSend={true}
          minComposerHeight={55}
          maxComposerHeight={55}
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
            android: -160,
          })}
        />
      </View>
    )
  }
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
    justifyContent: 'flex-end',
  },
  msgListContainer: {
    width: '100%',
  },
  listContainer: {
    width: '100%',
  },
  sendIconStyle: {
    height: 30,
    width: 30,
  },
  composerContainer: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
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
    height: '100%',
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
  suggestionsContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 55,
  },

  suggestionsRowContainer: {
    flexDirection: 'row',
  },
  userAvatarBox: {
    width: 35,
    paddingTop: 2,
    paddingBottom: 2,
  },
  userIconBox: {
    height: 40,
    width: 40,
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
})

YellowBox.ignoreWarnings(['Animated: `useNativeDriver` was not specified.'])
