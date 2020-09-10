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
  ScrollView,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'

import { GiftedChat, Composer } from 'react-native-gifted-chat'
import Editor, { EU } from 'react-native-mentions-editor'

const users = [
  { id: 1, name: 'Raza Dar', username: 'mrazadar', gender: 'male' },
  { id: 3, name: 'Atif Rashid', username: 'atif.rashid', gender: 'male' },
  { id: 4, name: 'Peter Pan', username: 'peter.pan', gender: 'male' },
  { id: 5, name: 'John Doe', username: 'john.doe', gender: 'male' },
  { id: 6, name: 'Meesha Shafi', username: 'meesha.shafi', gender: 'female' },
]

const formatMentionNode = (txt, key) => (
  <Text key={key} style={styles.mention}>
    {txt}
  </Text>
)

export class ThirdChatScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initialValue:
        'Hey @[mrazadar](id:1) this is good work. Tell @[john.doe](id:5) to use this package.',
      showEditor: true,
      message: null,
      messages: [],
      clearInput: false,
      showMentions: false /**use this parameter to programmatically trigger the mentionsList */,
    }
  }
  onChangeHandler = (message) => {
    /**
     * this callback will be called whenever input value change and will have
     * formatted value for mentioned syntax
     * @message : {text: 'Hey @(mrazadar)(id:1) this is good work.', displayText: `Hey @mrazadar this is good work`}
     * */

    this.setState({
      message,
      clearInput: false,
    })
  }
  sendMessage = () => {
    if (!this.state.message) return
    const messages = [this.state.message, ...this.state.messages]
    this.setState({
      messages,
      message: null,
      clearInput: true,
    })
  }

  toggleEditor = () => {
    /**
     * This callback will be called
     * once user left the input field.
     * This will handle blur event.
     */
    // this.setState({
    //   showEditor: false,
    // })
  }

  onHideMentions = () => {
    /**
     * This callback will be called
     * When MentionsList hide due to any user change
     */
    this.setState({
      showMentions: false,
    })
  }

  renderMessageListItem({ item: message, index }) {
    return (
      <View style={styles.messageListItem}>
        <Text style={styles.messageText}>
          {EU.displayTextWithMentions(message.text, formatMentionNode)}
        </Text>
      </View>
    )
  }
  renderMessageList() {
    return (
      <FlatList
        style={styles.messageList}
        keyboardShouldPersistTaps={'always'}
        horizontal={false}
        inverted
        enableEmptySections={true}
        data={this.state.messages}
        keyExtractor={(message, index) => `${message.text}-${index}`}
        renderItem={(rowData) => {
          return this.renderMessageListItem(rowData)
        }}
      />
    )
  }

  render() {
    return (
      <View style={styles.main}>
        <KeyboardAvoidingView behavior='position'>
          <View style={styles.container}>
            <ScrollView style={styles.messageList}>{this.renderMessageList()}</ScrollView>
            <View style={styles.footer}>
              <Editor
                list={users}
                initialValue={this.state.initialValue}
                clearInput={this.state.clearInput}
                onChange={this.onChangeHandler}
                showEditor={this.state.showEditor}
                toggleEditor={this.toggleEditor}
                showMentions={this.state.showMentions}
                onHideMentions={this.onHideMentions}
                placeholder='You can write here...'
              />
              <TouchableOpacity style={styles.sendBtn} onPress={this.sendMessage}>
                <Text style={styles.sendBtnText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    )
  }
}

ThirdChatScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Third Chat',
  headerLeft: () => (
    <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
      <Item titel='Toggle Drawer' iconName='ios-menu' onPress={() => navigation.toggleDrawer()} />
    </HeaderButtons>
  ),
})

const { width, height } = Dimensions.get('window')
const screenWidth = width < height ? width : height
const screenHeight = width < height ? height : width

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    height: screenHeight,
    marginTop: 5,
  },
  container: {
    height: screenHeight,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    // height: 200,
  },

  messageList: {
    paddingVertical: 50,
  },
  messageText: {},

  footer: {
    backgroundColor: 'lightgreen',
    height: 200,
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 100,
    padding: 15,
  },
  sendBtn: {
    width: 50,
    height: 40,
    backgroundColor: 'green',
    borderRadius: 6,
    marginLeft: 5,
    justifyContent: 'center',
    textAlign: 'center',
  },
  sendBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  mention: {
    fontSize: 16,
    fontWeight: '400',
    backgroundColor: 'rgba(36, 77, 201, 0.05)',
    color: '#244dc9',
  },
})
