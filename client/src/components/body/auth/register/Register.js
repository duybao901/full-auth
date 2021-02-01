import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import { showErrorMessage, showSuccessRegisterMessage } from '../../../ultis/notification/Notification'
import { isEmpty, isEmail, isLength, isMatch } from '../../../ultis/validation/Validation';

const initialState = {
    name: '',
    email: '',
    password: '',
    cf_password: '',
    err: '',
    success: '',
    loading: false
}

function Login() {
    const [user, setUser] = useState(initialState);
    const { name, email, password, cf_password, err, success, loading } = user;

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        if (isEmpty(email) || isEmpty(password) || isEmpty(name) || isEmpty(cf_password))
            return setUser({
                ...user,
                [e.target.name]: e.target.value, err: "Please fill all the fields", success: ''
            })

        if (!isEmail(email))
            return setUser({
                ...user,
                [e.target.name]: e.target.value, err: "Invalid email", success: ''
            })

        if (isLength(password))
            return setUser({
                ...user,
                [e.target.name]: e.target.value, err: "Password must last at 6 characters", success: ''
            })

        if (!isMatch(password, cf_password))
            return setUser({
                ...user,
                [e.target.name]: e.target.value, err: "Password not match", success: ''
            })
        try {
            setUser({
                ...user,
                loading: true,
            })
            const res = await axios.post('/user/register', {
                name, email, password
            })
            setUser({
                ...user,
                success: res.data.msg,
                loading: false,
            })
        } catch (err) {
            err.response.data.msg && setUser({
                ...user,
                [e.target.name]: e.target.value, err: err.response.data.msg, success: ''
            })
        }
    }

    const onHandleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
            err: '',
            success: ''
        })
    }

    return (
        <div className='login'>
            <div className='login__header'>
                <h2>Register</h2>
                <i className="nes-charmander is-small"></i>
            </div>

            {err && showErrorMessage(err)}
            {success && showSuccessRegisterMessage(success)}

            <form className='login__form' onSubmit={onHandleSubmit}>
                <div className="login__form-item">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" placeholder="Enter your name..."
                        value={name} onChange={onHandleChange}
                        className='nes-input is-warning'
                    ></input>
                </div>
                <div className="login__form-item">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" name="email" id="email" placeholder="Enter your email..."
                        value={email} onChange={onHandleChange}
                        className='nes-input is-warning'
                    ></input>
                </div>
                <div className="login__form-item">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="Enter your password..."
                        value={password} onChange={onHandleChange}
                        className='nes-input is-warning'
                    ></input>
                </div>
                <div className="login__form-item">
                    <label htmlFor="confirm password">confirm password</label>
                    <input type="password" name="cf_password" id="confirm password" placeholder="Enter your confirm password..."
                        value={cf_password} onChange={onHandleChange}
                        className='nes-input is-warning'
                    ></input>
                </div>
                <div className="login__form-ct">
                    <button type="submit" className={loading ? "nes-btn  is-disabled" : "nes-btn is-warning"}>Register</button>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <p>Already an account? <Link to="/login">Login</Link></p>
                </div>

            </form>
        </div >
    )
}

export default Login
