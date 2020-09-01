import React from 'react'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { AppHeaderIcon } from '../components/AppHeaderIcon'
import {
  Platform,
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  Image,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'
import { GiftedChat, Send } from 'react-native-gifted-chat'
import Modal from 'react-native-modal'
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
    image: '',
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

export class SecondChatScreen extends React.Component {
  constructor() {
    super()

    this.scrollViewRef = React.createRef()

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
      scrollOffset: null,
      userData: userList,
      keyword: ' ',
      previousChar: ' ',
    }
  }

  setModalVisible = (value) => {
    this.setState({
      modalVisible: value,
    })
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
          const userDataList = userList.filter(
            (obj) => obj.name.toLowerCase().search(keyword.slice(1).toLowerCase()) !== -1
          )
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
      this.setModalVisible(true)
    } else if ((lastChar === ' ' && this.state.modalVisible) || value === '') {
      this.setModalVisible(false)
    }
    this.setState({ previousChar: lastChar })
    this.identifyKeyword(value)
  }

  renderComposer = (props) => {
    return (
      <View style={styles.composerContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            {...props}
            placeholder={'Type something...'}
            ref={(input) => {
              this.msgInput = input
            }}
            onChangeText={(value) => this.onTextChange(value, props)}
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
    )
  }

  handleOnScroll = (event) => {
    this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y,
    })
  }

  handleScrollTo = (point) => {
    if (this.scrollViewRef.current) {
      this.scrollViewRef.current.scrollTo(point)
    }
  }

  renderSuggestionsRow = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.suggestionClickStyle}
        onPress={() => this.onSuggestionTap(item)}
      >
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

  onSuggestionTap(dataObj) {
    this.setModalVisible(false)
    const sliceText = this.state.messageText.slice(0, -this.state.keyword.length)
    this.setState({
      messageText: sliceText + '@' + dataObj.name + ' ',
      keyword: ' ',
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          isVisible={this.state.modalVisible}
          coverScreen={false}
          deviceHeight={400}
          onBackdropPress={() => this.setModalVisible(false)}
          backdropColor={'transparent'}
          scrollTo={this.handleScrollTo}
          scrollOffset={this.state.scrollOffset}
          scrollOffsetMax={300 - 200}
          animationIn='fadeIn'
          animationInTiming={200}
          animationOut='fadeOut'
          onModalShow={() => {
            this.msgInput.focus()
          }}
          style={styles.modalContainer}
        >
          <View style={styles.suggestionContainer}>
            {this.state.isLoading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                contentContainerStyle={styles.suggestionListStyle}
                data={this.state.userData}
                renderItem={(item, index) => this.renderSuggestionsRow(item, index)}
                keyExtractor={(item) => `${item.id}`}
                keyboardShouldPersistTaps='always'
              />
            )}
          </View>
        </Modal>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          renderComposer={this.renderComposer}
          listViewProps={{
            style: styles.listContainer,
            contentContainerStyle: styles.msgListContainer,
          }}
          user={{
            _id: 1,
          }}
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

SecondChatScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Gifted Chat',
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
    height: 55,
    flexDirection: 'row',
    paddingTop: 5,
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
    minWidth: 250,
    maxWidth: 250,
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
    alignItems: 'center',
    height: 60,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgb(245, 245, 245)',
    padding: 10,
  },
  suggestionRowContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  userDetailsBox: {
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 15,
    width: '90%',
  },
  displayNameText: {
    fontSize: 13,
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
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
  modalContainer: {
    position: 'absolute',
    bottom: 0, // Give bottom as per your requirement here
    justifyContent: 'flex-end',
    alignSelf: 'center',
    margin: 0,
    ...Platform.select({
      android: {
        marginBottom: 70,
      },
      ios: {
        marginBottom: 95,
      },
    }),
  },
  suggestionContainer: {
    maxHeight: 190,
    backgroundColor: 'rgba(0,0,0,0.08)',
    width: '100%',
  },
  suggestionListStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
