import React from 'react'
import ReactDOM  from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { GoogleOAuthProvider } from '@react-oauth/google';
import thunk from 'redux-thunk' 
import App from './App'
import './index.css'

import reducers from './reducers'

const store = createStore(reducers, compose(applyMiddleware(thunk)))

ReactDOM.render(
    <GoogleOAuthProvider clientId="534419389505-tfek9np1i5uj04u376rlc7q9hg5sj3i1.apps.googleusercontent.com">
        <Provider store={store}>
            <App />
        </Provider>
    </GoogleOAuthProvider>
   , 
    document.getElementById('root')
);