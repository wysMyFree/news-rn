import { newsAPI } from '../../api/api'

const SET_NEWS = 'SET_NEWS'
const HANDLE_ERROR = 'HANDLE_ERROR'
const REMOVE_POST = 'REMOVE_POST'
const TOGGLE_BOOKED = 'TOGGLE_BOOKED'
const ADD_POST = 'ADD_POST'

export const postReducer = (state = { newsPosts: [], error: '', loading: true }, action) => {
  switch (action.type) {
    case SET_NEWS: {
      return { ...state, newsPosts: action.payload, loading: false }
    }
    case TOGGLE_BOOKED:
      const newsPosts = state.newsPosts.map((post) => {
        if (post.id === action.id) {
          post.booked = !post.booked
        }
        return post
      })
      return { ...state, newsPosts }
    case REMOVE_POST: {
      return {
        ...state,
        newsPosts: state.newsPosts.filter((p) => p.id !== action.id),
      }
    }
    case ADD_POST: {
      return { ...state, newsPosts: [{ ...action.payload }, ...state.newsPosts] }
    }
    case HANDLE_ERROR: {
      return { ...state, error: action.error }
    }
    default:
      return state
  }
}
export const setNews = (payload) => ({ type: SET_NEWS, payload })
export const toggleBooked = (id) => ({ type: TOGGLE_BOOKED, id })
export const removePost = (id) => ({ type: REMOVE_POST, id })
export const addPost = (post) => {
  post.id = Date.now().toString()
  return { type: ADD_POST, payload: post }
}
export const handleError = (error) => ({ type: HANDLE_ERROR, error })
export const getNews = () => async (dispatch) => {
  try {
    const response = await newsAPI.fetchNews()
    const payload = Object.keys(response).map((i) => {
      return { ...response[i], booked: false, id: response[i].publishedAt + response[i].author }
    })
    dispatch(setNews(payload))
  } catch (error) {
    dispatch(handleError(error.message))
  }
}
