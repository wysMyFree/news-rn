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
import { EU } from 'react-native-mentions-editor'

const userList = [
  {
    id: 1,
    name: 'Andy',
    username: 'Kotlin',
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
    username: 'Pharell',
    image: 'https://via.placeholder.com/300.png/09f/fff',
  },
]

export class SecondChatScreen extends React.Component {
  constructor() {
    super()
    this.mentionsMap = new Map()
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
      modalVisible: false,
      isLoading: false,
      scrollOffset: null,
      userData: userList,
      inputText: '',
      menIndex: 0,
      text: '',
      selection: { start: 0, end: 0 },
    }
  }

  setModalVisible = (value) => {
    this.setState({
      modalVisible: value,
    })
  }
  updateMentionsMap(selection, count, shouldAdd) {
    this.mentionsMap = EU.updateRemainingMentionsIndexes(
      this.mentionsMap,
      selection,
      count,
      shouldAdd
    )
  }

  onSend(message = []) {
    console.log(this.mentionsMap)
    console.log(message)
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, message),
    }))
  }

  updateSuggestions = (keyword) => {
    this.setState({ isLoading: true }, () => {
      if (Array.isArray(userList)) {
        this.setState({
          userData: [
            ...userList.filter((obj) => {
              if (keyword.slice(1) === '') return true
              if (
                obj.name.toLowerCase().includes(keyword.slice(1).toLowerCase()) ||
                obj.username.toLowerCase().includes(keyword.slice(1).toLowerCase())
              )
                return true
            }),
          ],

          isLoading: false,
        })
      }
    })
  }

  identifyKeyword(val) {
    if (this.state.modalVisible) {
      const { selection, menIndex } = this.state
      const length = Platform.select({
        ios: selection.start - menIndex,
        android: selection.start - menIndex + 1,
      })
      this.updateSuggestions(val.substr(menIndex, length))
    }
  }

  checkForMention(inputText, selection) {
    /**
     * Open mentions list if user
     * start typing @ in the string anywhere.
     */
    const menIndex = Platform.select({ ios: selection.start - 1, android: selection.start })
    const lastChar = inputText.substr(menIndex, 1)
    console.log(selection)
    if (lastChar === '@') {
      this.setModalVisible(true)
      this.setState({ menIndex })
    } else if ((lastChar.trim() === '' && this.state.modalVisible) || inputText === '') {
      this.setModalVisible(false)
    }
    this.identifyKeyword(inputText)
  }

  getInitialAndRemainingStrings(inputText, menIndex) {
    /**
     * extractInitialAndRemainingStrings
     * this function extract the initialStr and remainingStr
     * at the point of new Mention string.
     * Also updates the remaining string if there
     * are any adjacent mentions text with the new one.
     */
    // const {inputText, menIndex} = this.state;
    let initialStr = inputText.substr(0, menIndex).trim()
    if (!EU.isEmpty(initialStr)) {
      initialStr = initialStr + ' '
    }
    /**
     * remove the characters adjacent with @ sign
     * and extract the remaining part
     */
    let remStr =
      inputText
        .substr(menIndex + 1)
        .replace(/\s+/, '\x01')
        .split('\x01')[1] || ''
    /**
     * check if there are any adjecent mentions
     * subtracted in current selection.
     * add the adjacent mentions
     * @tim@nic
     * add nic back
     */
    const adjMentIndexes = {
      start: initialStr.length - 1,
      end: inputText.length - remStr.length - 1,
    }
    const mentionKeys = EU.getSelectedMentionKeys(this.mentionsMap, adjMentIndexes)
    mentionKeys.forEach((key) => {
      remStr = `@${this.mentionsMap.get(key).username} ${remStr}`
    })
    return { initialStr, remStr }
  }

  renderComposer = (props) => {
    return (
      <View style={styles.composerContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={'Type something...'}
            ref={(input) => {
              this.msgInput = input
            }}
            value={this.state.inputText}
            onChangeText={this.onChange}
            //            selection={this.state.selection}
            selectionColor={'#000'}
            onSelectionChange={({ nativeEvent: { selection } }) => {
              this.setState({ selection })
            }}
            style={styles.textInput}
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

  onSuggestionTap = (user) => {
    /**
     * When user select a mention.
     * Add a mention in the string.
     * Also add a mention in the map
     */
    const { inputText, menIndex } = this.state
    const { initialStr, remStr } = this.getInitialAndRemainingStrings(inputText, menIndex)

    const username = `@${user.username}`
    const text = `${initialStr}${username} ${remStr}`
    //'@[__display__](__id__)' ///find this trigger parsing from react-mentions

    //set the mentions in the map.
    const menStartIndex = initialStr.length
    const menEndIndex = menStartIndex + (username.length - 1)
    this.mentionsMap.set([menStartIndex, menEndIndex], user)

    // update remaining mentions indexes
    let charAdded = Math.abs(text.length - inputText.length)
    this.updateMentionsMap({ start: menEndIndex + 1, end: text.length }, charAdded, true)

    this.setModalVisible(false)
    this.setState({
      inputText: text,
      userData: [...userList],
      text: this.formatTextWithMentions(text),
    })
  }

  formatTextWithMentions(inputText) {
    if (inputText === '' || !this.mentionsMap.size) return inputText
    let formattedText = ''
    let lastIndex = 0
    this.mentionsMap.forEach((men, [start, end]) => {
      const initialStr = start === 1 ? '' : inputText.substring(lastIndex, start)
      lastIndex = end + 1
      formattedText = formattedText.concat(initialStr)
      formattedText = formattedText.concat(`@[${men.username}](id:${men.id})`)
      if (EU.isKeysAreSame(EU.getLastKeyInMap(this.mentionsMap), [start, end])) {
        const lastStr = inputText.substr(lastIndex) //remaining string
        formattedText = formattedText.concat(lastStr)
      }
    })
    return formattedText
  }

  onChange = (inputText) => {
    let text = inputText
    const prevText = this.state.inputText

    let selection = { ...this.state.selection }

    if (text.length < prevText.length) {
      /**
       * if user is back pressing and it
       * deletes the mention remove it from
       * actual string.
       */

      let charDeleted = Math.abs(text.length - prevText.length)
      const totalSelection = {
        start: selection.start,
        end: charDeleted > 1 ? selection.start + charDeleted : selection.start,
      }
      /**
       * REmove all the selected mentions
       */
      if (totalSelection.start === totalSelection.end) {
        //single char deleting
        const key = EU.findMentionKeyInMap(this.mentionsMap, totalSelection.start)
        if (key && key.length) {
          this.mentionsMap.delete(key)
          /**
           * don't need to worry about multi-char selection
           * because our selection automatically select the
           * whole mention string.
           */
          const initial = text.substring(0, key[0]) //mention start index
          text = initial + text.substr(key[1]) // mentions end index
          charDeleted = charDeleted + Math.abs(key[0] - key[1]) //1 is already added in the charDeleted
          // selection = {
          //     start: ((charDeleted+selection.start)-1),
          //     end: ((charDeleted+selection.start)-1)
          // }
          this.mentionsMap.delete(key)
        }
      } else {
        //multi-char deleted
        const mentionKeys = EU.getSelectedMentionKeys(this.mentionsMap, totalSelection)
        mentionKeys.forEach((key) => {
          this.mentionsMap.delete(key)
        })
      }
      /**
       * update indexes on charcters remove
       * no need to worry about totalSelection End.
       * We already removed deleted mentions from the actual string.
       * */
      this.updateMentionsMap({ start: selection.end, end: prevText.length }, charDeleted, false)
    } else {
      //update indexes on new charcter add

      let charAdded = Math.abs(text.length - prevText.length)
      this.updateMentionsMap({ start: selection.end, end: text.length }, charAdded, true)
      /**
       * if user type anything on the mention
       * remove the mention from the mentions array
       * */
      if (selection.start === selection.end) {
        const key = EU.findMentionKeyInMap(this.mentionsMap, selection.start - 1)
        if (key && key.length) {
          this.mentionsMap.delete(key)
        }
      }
    }

    this.setState({ inputText: text })
    this.checkForMention(text, selection)
    // const text = `${initialStr} @[${user.username}](id:${user.id}) ${remStr}`; //'@[__display__](__id__)' ///find this trigger parsing from react-mentions
    this.setState({ text: this.formatTextWithMentions(text) })
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
          animationInTiming={600}
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
          onSend={(message) => this.onSend(message)}
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
          text={this.state.text}
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
  mention: {
    fontSize: 16,
    fontWeight: '400',
    backgroundColor: 'rgba(36, 77, 201, 0.05)',
    color: '#244dc9',
  },
})
