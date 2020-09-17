import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { AppHeaderIcon } from '../components/AppHeaderIcon'
import { Platform, StyleSheet, TextInput, View, Image, KeyboardAvoidingView } from 'react-native'
import { GiftedChat, Send } from 'react-native-gifted-chat'
import { THEME } from '../theme'
import MessageBubble from '../components/MessageBubble/MessageBuble'
import { addMessage } from '../redux/reducers/chat'
import {
  setMentionIndex,
  setSuggestionsData,
  setTokenizedText,
  setInputText,
} from '../redux/reducers/mentions'
import {
  SuggestionsComponent,
  formatTextWithMentions,
  openSuggestionsPanel,
  closeSuggestionsPanel,
} from '../components/MentionsHelper/MentionsHelper'
import { EU } from 'react-native-mentions-editor'

export const ChatScreen = () => {
  const { messages, userList } = useSelector(({ chat }) => chat)
  const { modalVisible, inputText, mentionIndex, tokenizedText } = useSelector(
    ({ mentions }) => mentions
  )
  const dispatch = useDispatch()
  const [mentionsMap] = useState(new Map())
  const [selection, setSelection] = useState({ start: 0, end: 0 })

  const onSend = React.useCallback((message = []) => {
    console.log(message)
    dispatch(addMessage(message))
  }, [])

  React.useEffect(() => {
    dispatch(setSuggestionsData(userList))
  }, [userList])

  const onTextChange = (text) => {
    const prevText = inputText
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
      // REmove all the selected mentions

      if (totalSelection.start === totalSelection.end) {
        //single char deleting
        const key = EU.findMentionKeyInMap(mentionsMap, totalSelection.start)
        if (key && key.length) {
          mentionsMap.delete(key)
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
          mentionsMap.delete(key)
        }
      } else {
        //multi-char deleted
        const mentionKeys = EU.getSelectedMentionKeys(mentionsMap, totalSelection)
        mentionKeys.forEach((key) => {
          mentionsMap.delete(key)
        })
      }
      /**
       * update indexes on charcters remove
       * no need to worry about totalSelection End.
       * We already removed deleted mentions from the actual string.
       * */
      EU.updateRemainingMentionsIndexes(
        mentionsMap,
        { start: selection.end, end: prevText.length },
        charDeleted,
        false
      )
    } else {
      //update indexes on new charcter add

      let charAdded = Math.abs(text.length - prevText.length)
      EU.updateRemainingMentionsIndexes(
        mentionsMap,
        { start: selection.end, end: text.length },
        charAdded,
        true
      )
      //if user type anything on the mention remove the mention from the mentions array
      if (selection.start === selection.end) {
        const key = EU.findMentionKeyInMap(mentionsMap, selection.start - 1)
        if (key && key.length) {
          mentionsMap.delete(key)
        }
      }
    }
    dispatch(setInputText(text))
    checkForMention(text)
    dispatch(setTokenizedText(formatTextWithMentions(text, mentionsMap)))
  }
  const checkForMention = (inputText) => {
    // Open mentions list if user start typing @ in the string anywhere.
    const index = Platform.select({ ios: selection.start - 1, android: selection.start })
    const lastChar = inputText.substr(index, 1)

    if (lastChar === '@') {
      openSuggestionsPanel()
      dispatch(setMentionIndex(index))
    } else if ((lastChar.trim() === '' && modalVisible) || inputText === '') {
      closeSuggestionsPanel()
    }
    identifyKeyword(inputText)
  }

  const identifyKeyword = (val) => {
    if (modalVisible) {
      const lenght = selection.start - mentionIndex
      console.log('selection:', selection)
      filterSuggestionsData(val.substr(mentionIndex, lenght))
    }
  }
  const filterSuggestionsData = (keyword) => {
    console.log(keyword)
    if (Array.isArray(userList)) {
      dispatch(
        setSuggestionsData([
          ...userList.filter((obj) => {
            if (keyword.slice(1) === '') return true
            if (
              obj.name.toLowerCase().includes(keyword.slice(1).toLowerCase()) ||
              obj.username.toLowerCase().includes(keyword.slice(1).toLowerCase())
            )
              return true
          }),
        ])
      )
    }
  }
  const renderComposer = (props) => {
    return (
      <View style={styles.wrapper}>
        <SuggestionsComponent userList={userList} mentionsMap={mentionsMap} />
        <View style={styles.composerContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={'Type something...'}
              onChangeText={onTextChange}
              style={styles.textInput}
              value={inputText}
              multiline
              onSelectionChange={({ nativeEvent: { selection } }) => {
                setSelection(selection)
              }}
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
        text={tokenizedText}
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
})
