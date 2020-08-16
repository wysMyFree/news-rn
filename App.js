import React from 'react'
import { AppLoading } from 'expo'
import { Provider } from 'react-redux'
import { AppNavigation } from './src/navigation/AppNavigation'
import { bootstrap } from './src/bootstrap'
import store from './src/redux/store'

export default function App() {
  const [isReady, setIsReady] = React.useState(false)
  if (!isReady) {
    return (
      <AppLoading
        startAsync={bootstrap}
        onFinish={() => setIsReady(true)}
        onError={(err) => console.log(err)}
      />
    )
  }
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  )
}
