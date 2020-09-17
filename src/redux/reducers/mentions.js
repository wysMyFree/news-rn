const SET_SELECTION = 'SET_SELECTION'
const SET_INPUT_TEXT = 'SET_INPUT_TEXT'
const SET_TOKENIZED_TEXT = 'SET_TOKENIZED_TEXT'
const SET_MENTION_INDEX = 'SET_MENTION_INDEX'
const SET_MODAL_VISIBLE = 'SET_MODAL_VISIBLE'
const SET_SUGGESTIONS_DATA = 'SET_SUGGESTIONS_DATA'
const FILTER_SUGGESTIONS_DATA = 'FILTER_SUGGESTIONS_DATA'

export const mentionsReducer = (
  state = {
    modalVisible: false,
    inputText: '',
    tokenizedText: '',
    mentionIndex: 0,
    selection: { start: 0, end: 0 },
    suggestionsData: [],
  },
  action
) => {
  switch (action.type) {
    case SET_SELECTION: {
      return { ...state, selection: action.selection }
    }
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
    default:
      return state
  }
}

export const setSelection = (selection) => ({ type: SET_SELECTION, selection })
export const setInputText = (inputText) => ({ type: SET_INPUT_TEXT, inputText })
export const setTokenizedText = (tokenizedText) => ({ type: SET_TOKENIZED_TEXT, tokenizedText })
export const setMentionIndex = (mentionIndex) => ({ type: SET_MENTION_INDEX, mentionIndex })
export const setModalVisible = (value) => ({ type: SET_MODAL_VISIBLE, value })
export const setSuggestionsData = (payload) => ({ type: SET_SUGGESTIONS_DATA, payload })
export const filterSuggestionsData = (keyword) => ({ type: SET_SUGGESTIONS_DATA, keyword })
