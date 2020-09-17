import React, { useState } from 'react'
import {
  Animated,
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  YellowBox,
} from 'react-native'
import { EU } from 'react-native-mentions-editor'
import { THEME } from '../../theme'
import { setInputText, setSuggestionsData, setTokenizedText } from '../../redux/reducers/mentions'
import { useSelector, useDispatch } from 'react-redux'

const { width } = Dimensions.get('window')
const suggestionRowHeight = new Animated.Value(0)

export const loadingComponent = () => {
  return (
    <View style={{ flex: 1, width, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
    </View>
  )
}

export const openSuggestionsPanel = (height) => {
  Animated.timing(suggestionRowHeight, {
    toValue: height ? height : suggestionRowHeight,
    duration: 100,
  }).start()
}

export const closeSuggestionsPanel = () => {
  Animated.timing(suggestionRowHeight, {
    toValue: 0,
    duration: 100,
  }).start()
}

export const SuggestionsComponent = ({ userList, mentionsMap }) => {
  const { modalVisible, inputText, mentionIndex, suggestionsData } = useSelector(
    ({ mentions }) => mentions
  )
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (modalVisible) {
      const height = suggestionsData.length * 55 >= 180 ? 180 : suggestionsData.length * 55
      openSuggestionsPanel(height)
    }
  }, [inputText])

  const getInitialAndRemainingStrings = (inputText, menIndex) => {
    /**
     * extractInitialAndRemainingStrings
     * this function extract the initialStr and remainingStr
     * at the point of new Mention string.
     * Also updates the remaining string if there
     * are any adjacent mentions text with the new one.
     */
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
    const mentionKeys = EU.getSelectedMentionKeys(mentionsMap, adjMentIndexes)
    mentionKeys.forEach((key) => {
      remStr = `@${mentionsMap.get(key).username} ${remStr}`
    })
    return { initialStr, remStr }
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
  const onSuggestionTap = (user) => {
    /**
     * When user select a mention.
     * Add a mention in the string.
     * Also add a mention in the map
     */

    const { initialStr, remStr } = getInitialAndRemainingStrings(inputText, mentionIndex)

    const username = `@${user.username}`
    const text = `${initialStr}${username} ${remStr}`
    //'@[__display__](__id__)' ///find this trigger parsing from react-mentions

    //set the mentions in the map.
    const menStartIndex = initialStr.length
    const menEndIndex = menStartIndex + (username.length - 1)
    mentionsMap.set([menStartIndex, menEndIndex], user)

    // update remaining mentions indexes
    let charAdded = Math.abs(text.length - inputText.length)
    EU.updateRemainingMentionsIndexes(
      mentionsMap,
      { start: menEndIndex + 1, end: text.length },
      charAdded,
      true
    )

    closeSuggestionsPanel()
    dispatch(setInputText(text))
    dispatch(setSuggestionsData(userList))
    dispatch(setTokenizedText(formatTextWithMentions(text, mentionsMap)))
  }
  return (
    <Animated.View style={[styles.suggestionsContainer, { height: suggestionRowHeight }]}>
      <FlatList
        keyboardShouldPersistTaps={'always'}
        horizontal={false}
        ListEmptyComponent={loadingComponent}
        enableEmptySections={true}
        data={suggestionsData}
        style={styles.suggestionsList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={(item, index) => renderSuggestionsRow(item, index)}
      />
    </Animated.View>
  )
}

export const formatTextWithMentions = (inputText, mentionsMap) => {
  if (inputText === '' || !mentionsMap.size) return inputText
  let formattedText = ''
  let lastIndex = 0
  mentionsMap.forEach((men, [start, end]) => {
    const initialStr = start === 1 ? '' : inputText.substring(lastIndex, start)
    lastIndex = end + 1
    formattedText = formattedText.concat(initialStr)
    formattedText = formattedText.concat(`@[${men.username}](id:${men.id})`)
    if (EU.isKeysAreSame(EU.getLastKeyInMap(mentionsMap), [start, end])) {
      const lastStr = inputText.substr(lastIndex) //remaining string
      formattedText = formattedText.concat(lastStr)
    }
  })
  return formattedText
}

const styles = StyleSheet.create({
  suggestionsContainer: {
    maxHeight: 180,
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
