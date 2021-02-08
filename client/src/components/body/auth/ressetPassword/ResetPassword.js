import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { showErrorMessage, showSuccessRegisterMessage } from '../../../ultis/notification/Notification'
import { isEmpty, isLength, isMatch } from '../../../ultis/validation/Validation'
const initialState = {
    password: '',
    cf_password: '',
    err: '',
    success: '',
    loading: false
}

function ResetPassword() {

    const [data, setData] = useState(initialState);
    const { password, cf_password, err, success, loading } = data;

    const params = useParams();
    const { token } = params

    const onHandleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const onHandleSubmit = async (e) => {
        e.preventDefault();

        if (isEmpty(password) || isEmpty(cf_password)) {
            setData({ ...data, err: 'Please fill all the field', success: '' });
            return null;
        }
        if (isLength(password)) {
            setData({ ...data, err: 'Password must last at 6 characters', success: '' });
            return null;
        }
        if (!isMatch(password, cf_password)) {
            setData({ ...data, err: 'Password not match', success: '' });
            return null;
        }

        try {
            const res = await axios.post('/user/reset', { password }, {
                headers: { Authorization: token }
            });
            setData({ ...data, success: res.data.msg, err: '', loading: false });
        } catch (err) {
            if (err) {
                setData({ ...data, err: err.response.data.msg, success: '', loading: false });
            }
        }
    }

    return (
        <div className='forgot-password'>
            <h2>Reset password</h2>
            {err && <div style={{ margin: "20px 0" }}>{showErrorMessage(err)}</div>}
            {success && <div style={{ margin: "20px 0" }}>{showSuccessRegisterMessage(success)}</div>}
            <form onSubmit={onHandleSubmit}>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder="Enter your password..."
                    value={data.password} onChange={onHandleChange}
                    className='nes-input is-warning'
                ></input>
                <label htmlFor="cf_password">Confirm Password</label>
                <input type="password" name="cf_password" id="cf_password" placeholder="Enter your comfirm password..."
                    value={data.cf_password} onChange={onHandleChange}
                    className='nes-input is-warning'
                ></input>
                <button type='submit' className={loading ? "nes-btn is-disabled" : "nes-btn is-warning"}>Change Password</button>
            </form>
        </div>
    )
}

export default ResetPassword
