import * as types from '../contants/index';

const token = ''

const tokenReducer = (state = token, action) => {
    switch (action.type) {
        case types.GET_TOKEN: {
            return action.payload
        }
        default: return state
    }
}
export default tokenReducer;