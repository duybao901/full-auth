import * as types from '../contants/index'

const initialState = [];

const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_ALL_USERS: {
            return action.payload
        }
        default: {
            return state;
        }
    }
}

export default usersReducer;