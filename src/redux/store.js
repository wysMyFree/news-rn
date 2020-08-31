import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { postReducer } from './reducers/post'
import { chatReducer } from './reducers/chat'

const rootReducer = combineReducers({
  post: postReducer,
  chat: chatReducer,
})
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const middleware = [thunk]

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)))

export default store
