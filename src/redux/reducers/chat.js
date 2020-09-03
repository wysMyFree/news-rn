import { GiftedChat } from 'react-native-gifted-chat'

const ADD_MSG = 'ADD_MSG'

export const chatReducer = (
  state = {
    messages: [
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'RNgc',
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
    userList: [
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
    ],
  },
  action
) => {
  switch (action.type) {
    case ADD_MSG: {
      return { ...state, messages: GiftedChat.append(state.messages, action.message) }
    }
    default:
      return state
  }
}

export const addMessage = (message) => {
  return { type: ADD_MSG, message }
}
