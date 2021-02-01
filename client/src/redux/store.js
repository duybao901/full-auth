
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import myReducer from './reducers/appReducer';

const store = createStore(myReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)


function DataProvider({ children }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default DataProvider
