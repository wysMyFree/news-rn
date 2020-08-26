import React from 'react'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { AppHeaderIcon } from '../components/AppHeaderIcon'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Button } from 'react-native'
import { THEME } from '../theme'
import MentionsTextInput from 'react-native-mentions'

const users = [
  { id: 1, name: 'Raza Dar', username: 'mrazadar', gender: 'male' },
  { id: 3, name: 'Atif Rashid', username: 'atif.rashid', gender: 'male' },
  { id: 4, name: 'Peter Pan', username: 'peter.pan', gender: 'male' },
  { id: 5, name: 'John Doe', username: 'john.doe', gender: 'male' },
  { id: 6, name: 'Meesha Shafi', username: 'meesha.shafi', gender: 'female' },
]
const { height, width } = Dimensions.get('window')

export const ChatScreen = () => {
  const [value, setValue] = React.useState('')
  const [keyword, setKeyword] = React.useState('')
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

  const onSuggestionTap = (username, hidePanel) => {
    hidePanel()
    const comment = value.slice(0, -keyword.length)
    setValue(comment + '@' + username + ' ')
  }
  const callback = (key) => {
    console.log(key)
    setKeyword(key)
  }

  return (
    <View style={styles.container}>
      <MentionsTextInput
        textInputStyle={{ borderColor: '#ebebeb', borderWidth: 1, padding: 5, fontSize: 15 }}
        suggestionsPanelStyle={{ backgroundColor: 'rgba(100,100,100,0.1)' }}
        loadingComponent={() => (
          <View style={{ flex: 1, width, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
          </View>
        )}
        textInputMinHeight={30}
        textInputMaxHeight={80}
        trigger={'@'}
        triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
        value={value}
        onChangeText={setValue}
        triggerCallback={callback}
        renderSuggestionsRow={renderSuggestionsRow}
        suggestionsData={users} // array of objects
        keyExtractor={(item, index) => item.username}
        suggestionRowHeight={45}
        horizontal={false} // defaut is true, change the orientation of the list
        MaxVisibleRowCount={3} // this is required if horizontal={false}
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
    height: 300,
    justifyContent: 'flex-end',
    paddingTop: 100,
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
})
