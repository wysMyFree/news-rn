import { MentionUtils } from '../../components/MentionsHelper/MentionUtils'
const SET_INPUT_TEXT = 'SET_INPUT_TEXT'
const SET_TOKENIZED_TEXT = 'SET_TOKENIZED_TEXT'
const SET_MENTION_INDEX = 'SET_MENTION_INDEX'
const SET_MODAL_VISIBLE = 'SET_MODAL_VISIBLE'
const SET_SUGGESTIONS_DATA = 'SET_SUGGESTIONS_DATA'
const FILTER_SUGGESTIONS_DATA = 'FILTER_SUGGESTIONS_DATA'
const UPD_REMAINING_MENTIONS_IND = 'UPD_REMAINING_MENTIONS_IND'
const ERASE_MENTION = 'ERASE_MENTION'
const ADD_MENTION = 'ADD_MENTION'

export const mentionsReducer = (
  state = {
    modalVisible: false,
    inputText: '',
    tokenizedText: '',
    mentionIndex: 0,
    suggestionsData: [],
    mentionsArr: [],
  },
  action
) => {
  switch (action.type) {
    case SET_INPUT_TEXT: {
      return { ...state, inputText: action.inputText }
    }
    case SET_TOKENIZED_TEXT: {
      return { ...state, tokenizedText: action.tokenizedText }
    }
    case SET_MENTION_INDEX: {
      return { ...state, mentionIndex: action.mentionIndex, modalVisible: true }
    }
    case SET_MODAL_VISIBLE: {
      return { ...state, modalVisible: action.value }
    }
    case SET_SUGGESTIONS_DATA: {
      return { ...state, suggestionsData: action.payload }
    }
    case FILTER_SUGGESTIONS_DATA: {
      return {
        ...state,
        suggestionsData: [
          ...state.suggestionsData.filter((obj) => {
            if (action.keyword.slice(1) === '') return true
            if (
              obj.name.toLowerCase().includes(action.keyword.slice(1).toLowerCase()) ||
              obj.username.toLowerCase().includes(action.keyword.slice(1).toLowerCase())
            )
              return true
          }),
        ],
      }
    }
    case UPD_REMAINING_MENTIONS_IND: {
      const { start, end, diff, shouldAdd } = action.payload
      console.log(state.mentionsArr)
      const keys = MentionUtils.getSelectedMentionKeys(state.mentionsArr, start, end)
      return {
        ...state,
        mentionsArr: keys.map((key) => {
          const newKey = shouldAdd
            ? { start: key[0] + diff, end: key[1] + diff }
            : { start: key[0] - diff, end: key[1] - diff }
          state.mentionsArr.map((u) => {
            if (u === key) {
              return { ...u, ...newKey }
            }
            return u
          })
        }),
      }
    }
    case ADD_MENTION: {
      return {
        ...state,
        mentionsArr: [
          ...state.mentionsArr,
          {
            start: action.payload.startIndex,
            end: action.payload.endIndex,
            user: action.payload.user,
          },
        ],
      }
    }
    case ERASE_MENTION: {
      return {
        ...state,
        mentionsArr: state.mentionsArr.filter((p) => p !== action.index),
      }
    }
    default:
      return state
  }
}

export const setInputText = (inputText) => ({ type: SET_INPUT_TEXT, inputText })
export const setTokenizedText = (tokenizedText) => ({ type: SET_TOKENIZED_TEXT, tokenizedText })
export const setMentionIndex = (mentionIndex) => ({ type: SET_MENTION_INDEX, mentionIndex })
export const setModalVisible = (value) => ({ type: SET_MODAL_VISIBLE, value })
export const setSuggestionsData = (payload) => ({ type: SET_SUGGESTIONS_DATA, payload })
export const filterSuggestionsData = (keyword) => ({ type: SET_SUGGESTIONS_DATA, keyword })
export const updateRemainingMentionsIndexes = (start, end, diff, shouldAdd) => ({
  type: UPD_REMAINING_MENTIONS_IND,
  payload: { start, end, diff, shouldAdd },
})
export const addMention = (startIndex, endIndex, user) => ({
  type: ADD_MENTION,
  payload: { startIndex, endIndex, user },
})
export const eraseMention = (index) => ({ type: ERASE_MENTION, index })
