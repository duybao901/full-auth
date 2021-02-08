import React, { useState } from 'react'
import axios from 'axios'
import { showErrorMessage, showSuccessRegisterMessage } from '../../../ultis/notification/Notification'
import { isEmail, isEmpty } from '../../../ultis/validation/Validation'
const initialState = {
    email: '',
    err: '',
    success: '',
    loading: false
}

function ForgotPassword() {

    const [data, setData] = useState(initialState);
    const { email, err, success, loading } = data;

    const onHandleChange = (e) => {
        setData({ ...data, email: e.target.value });
    }

    const onHandleSubmit = async (e) => {
        e.preventDefault();

        if (isEmpty(email)) {
            setData({ ...data, err: 'Please enter your email.', success: '' });
            return null;
        }
        if (!isEmail(email)) {
            setData({ ...data, err: 'Invalid email', success: '' });
            return null;
        }
        try {
            setData({ ...data, loading: true })
            const res = await axios.post('/user/forgot', { email });
            setData({ ...data, success: res.data.msg, err: '', loading: false });
        } catch (err) {
            if (err) {
                setData({ ...data, err: err.response.data.msg, success: '', loading: false });
            }
        }
    }

    return (
        <div className='forgot-password'>
            <h2>Forgot password</h2>
            {err && <div style={{ margin: "20px 0" }}>{showErrorMessage(err)}</div>}
            {success && <div style={{ margin: "20px 0" }}>{showSuccessRegisterMessage(success)}</div>}
            <form onSubmit={onHandleSubmit}>
                <label htmlFor="email">Email Address</label>
                <input type="email" name="email" id="email" placeholder="Enter your email..."
                    value={data.email} onChange={onHandleChange}
                    className='nes-input is-warning'
                ></input>
                <button type='submit' className={loading ? "nes-btn is-disabled" : "nes-btn is-warning"}>Verify Emaill Address</button>
            </form>
        </div>
    )
}

export default ForgotPassword
