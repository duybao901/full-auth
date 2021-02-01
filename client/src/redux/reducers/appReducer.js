import { combineReducers } from 'redux'
import auth from './authReducer';
import token from './tokenReducer'

const myReducer = combineReducers({
    auth,
    token
})

export default myReducer;

