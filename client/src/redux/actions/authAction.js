import * as types from '../contants/index';
import axios from 'axios'
export const login = () => {
    return {
        type: types.LOGIN
    }
}

export const getToken = (token) => {
    return {
        type: types.GET_TOKEN,
        payload: token
    }
}

export const fecthUser = async (token) => {
    const res = await axios.get('/user/infor', {
        headers: { Authorization: token }
    })
    return res
}

export const getUserInfor = (res) => {
    return {
        type: types.GET_USER,
        payload: {
            user: res.data,
            isAdmin: res.data.role === 1 ? true : false
        }
    }
}