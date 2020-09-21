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
  setModalVisible,
  updateRemainingMentionsIndexes,
  eraseMention,
} from '../redux/reducers/mentions'
import {
  SuggestionsComponent,
  formatTextWithMentions,
  openSuggestionsPanel,
  closeSuggestionsPanel,
} from '../components/MentionsHelper/MentionsHelper'
import { MentionUtils } from '../components/MentionsHelper/MentionUtils'

export const ChatScreen = () => {
  const { messages, userList } = useSelector(({ chat }) => chat)
  const { modalVisible, inputText, mentionIndex, tokenizedText, mentionsArr } = useSelector(
    ({ mentions }) => mentions
  )
  const dispatch = useDispatch()
  const [selection, setSelection] = useState({ start: 0, end: 0 })

  const onSend = React.useCallback((message = []) => {
    console.log(message)
    dispatch(addMessage(message))
  }, [])

  React.useEffect(() => {
    dispatch(setSuggestionsData(userList))
  }, [userList])

  const onTextChange = (text) => {
    if (text.length < inputText.length) {
      // if user is back pressing and it deletes the mention remove it from actual string

      let charDeleted = Math.abs(text.length - inputText.length)
      const totalSelection = {
        start: selection.start,
        end: charDeleted > 1 ? selection.start + charDeleted : selection.start,
      }
      // REmove all the selected mentions

      if (totalSelection.start === totalSelection.end) {
        //single char deleting
        const index = MentionUtils.findMentionIndexInArr(mentionsArr, totalSelection.start)
        if (index && index.length) {
          dispatch(eraseMention(index))
          // don't need to worry about multi-char selection because our selection automatically
          //select the whole mention string.

          const initial = text.substring(0, index[0]) //mention start index
          text = initial + text.substr(index[1]) // mentions end index
          charDeleted = charDeleted + Math.abs(index[0] - index[1]) //1 is already added in the charDeleted

          dispatch(eraseMention(index))
        }
      } else {
        //multi-char deleted
        const mentionKeys = MentionUtils.getSelectedMentionKeys(mentionsArr, totalSelection)
        mentionKeys.forEach((index) => {
          dispatch(eraseMention(index))
        })
      }
      // update indexes on charcters remove no need to worry about totalSelection End.
      // We already removed deleted mentions from the actual string.

      dispatch(updateRemainingMentionsIndexes(selection.end, inputText.length, charDeleted, false))
    } else {
      //update indexes on new charcter add
      let charAdded = Math.abs(text.length - inputText.length)
      dispatch(updateRemainingMentionsIndexes(selection.end, text.length, charAdded, true))
      console.log('onTextChange:', mentionsArr)
      //if user type anything on the mention remove the mention from the mentions array
      if (selection.start === selection.end) {
        const ind = MentionUtils.findMentionIndexInArr(mentionsArr, selection.start - 1)
        if (ind && ind.length) {
          dispatch(eraseMention(ind))
        }
      }
    }
    dispatch(setInputText(text))
    checkForMention(text)
    dispatch(setTokenizedText(formatTextWithMentions(text, mentionsArr)))
  }

  const identifyKeyword = (val) => {
    if (modalVisible) {
      const lenght = selection.start - mentionIndex
      filterSuggestionsData(val.substr(mentionIndex, lenght))
    }
  }
  const filterSuggestionsData = (keyword) => {
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
  const checkForMention = (inputText) => {
    // Open mentions list if user start typing @ in the string anywhere.
    const index = Platform.select({ ios: selection.start - 1, android: selection.start })
    const lastChar = inputText.substr(index, 1)

    if (lastChar === '@') {
      openSuggestionsPanel()
      dispatch(setMentionIndex(index))
    } else if ((lastChar.trim() === '' && modalVisible) || inputText === '') {
      closeSuggestionsPanel()
      dispatch(setModalVisible(false))
    }
    identifyKeyword(inputText)
  }
  const renderComposer = (props) => {
    return (
      <View style={styles.wrapper}>
        <SuggestionsComponent userList={userList} />
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
