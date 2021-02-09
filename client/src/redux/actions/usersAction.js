import * as types from '../contants/index'
import axios from 'axios'

export const fetchAllUsers = async (token) => {
    const res = await axios.get('/user/all_infor', {
        headers: { Authorization: token }
    });
    return res;
}

export const getAllUsers = (res) => {
    return {
        type: types.GET_ALL_USERS,
        payload: res.data
    }
}