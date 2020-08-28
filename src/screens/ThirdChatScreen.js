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
import Modal from 'react-native-modal'
import { GiftedChat, Composer } from 'react-native-gifted-chat'

export class ThirdChatScreen extends React.Component {
  constructor() {}

  _renderComposer = (props) => {
    return (
      <>
        {tagUser.tagDisplayActive && (
          <TagUserChatSelect
            userSelected={({ userId, userName }) => {
              // update state so we remove popop, and add selected user
              // to an array
              this.setState((prevState) => ({
                tagUser: {
                  ...this.state.tagUser,
                  tagDisplayActive: false,
                  taggedUsers: [...prevState.tagUser.taggedUsers, userId],
                },
              }))
              // add the selected user to the input field
              props.onTextChanged(`${props.text}${userName} `)
            }}
          />
        )}
        <View style={styles.composer}>
          <Composer
            {...props}
            onTextChanged={(text) => {
              let lastChar = text.substr(text.length - 1)
              this.setState({
                tagUser: {
                  ...this.state.tagUser,
                  tagDisplayActive: lastChar === '@' ? true : false,
                },
              })
              props.onTextChanged(text)
            }}
          />
        </View>
      </>
    )
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(messages) => this._sendMessage(messages)}
        user={{
          _id: userId,
          name: name,
          avatar: profileImg,
        }}
        renderComposer={this._renderComposer}
      />
    )
  }
}
