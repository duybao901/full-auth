import * as types from '../contants/index';

const initialState = {
    user: [],
    isLogged: false,
    isAdmin: false
}

const auth = (state = initialState, action) => {
    switch (action.type) {
        case types.LOGIN: {
            return {
                ...state,
                isLogged: true
            }
        }
        case types.GET_USER: {
            return {
                ...state,
                user: action.payload.user,
                isAdmin: action.payload.isAdmin
            }
        }
        default:
            return state
    }
}

export default auth;