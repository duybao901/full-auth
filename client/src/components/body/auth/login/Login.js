import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { showErrorMessage, showSuccessMessage } from '../../../ultis/notification/Notification'

import * as auth from '../../../../redux/actions/authAction'

const initialState = {
    email: '',
    password: '',
    err: '',
    success: '',
    loading: false
}

function Login() {
    const [user, setUser] = useState(initialState);
    const dispatch = useDispatch();
    const history = useHistory();
    const [socialLoaing, setSocialLoading] = useState(false)
    const { email, password, err, success, loading } = user;

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUser({
                ...user,
                loading: true
            })
            const res = await axios.post('/user/login', {
                email,
                password
            })
            setUser({
                ...user,
                success: res.data.msg,
                loading: false
            })
            localStorage.setItem('firstlogin', true);

            dispatch(auth.login());

            history.push('/');
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

    const responseGoogle = async (response) => {
        try {
            setSocialLoading(true);

            const res = await axios.post('/user/google_login', { tokenId: response.tokenId })
            setUser({
                ...user,
                success: res.data.msg,
                err: '',
                loading: true,
            })
            localStorage.setItem('firstlogin', true);
            setUser({
                loading: false,
            })
            setSocialLoading(false);

            dispatch(auth.login());

            history.push('/');
        } catch (err) {
            setSocialLoading(false);

            err.response.data.msg && setUser({
                ...user,
                err: err.response.data.msg, success: ''
            })
        }
    }

    const responseFacebook = async (response) => {
        try {
            setSocialLoading(true);

            const { accessToken, userID } = response;
            const res = await axios.post('/user/facebook_login', { accessToken, userID })
            setUser({
                ...user,
                success: res.data.msg,
                err: '',
                loading: true,
            })
            localStorage.setItem('firstlogin', true);
            setUser({
                loading: false,
            })
            setSocialLoading(false);

            dispatch(auth.login());

            history.push('/');
        } catch (err) {
            setSocialLoading(false);

            err.response.data.msg && setUser({
                ...user,
                err: err.response.data.msg, success: ''
            })
        }
    }
    console.log(socialLoaing)
    return (
        <div className='login'>
            <div className='login__header'>
                <h2>Login</h2>
                <i className="nes-mario"></i>
            </div>

            {err && showErrorMessage(err)}
            {success && showSuccessMessage(success)}

            <form className='login__form' onSubmit={onHandleSubmit}>
                <div className="login__form-item">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" name="email" id="email" placeholder="Enter your email..."
                        value={user.email} onChange={onHandleChange}
                        className='nes-input is-warning'
                    ></input>
                </div>
                <div className="login__form-item">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="Enter your password..."
                        value={user.password} onChange={onHandleChange}
                        className='nes-input is-warning'
                    ></input>
                </div>
                <div className="login__form-ct">
                    <button type="submit" className={loading ? "nes-btn  is-disabled" : "nes-btn is-warning"}>Login</button>
                    <Link to="/forgot">Forgot your password?</Link>
                </div>
                <p style={{ margin: "20px 0" }}>Or Login With</p>
                <div className='social-login'>
                    <div>{socialLoaing ? "Loading..." : ''}</div>
                    <GoogleLogin
                        clientId="376499416274-1vdl62rk3v202at8nbnejn8iq0h5p4ll.apps.googleusercontent.com"
                        buttonText="Login With Google"
                        onSuccess={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                    <FacebookLogin
                        appId="764239864202944"
                        autoLoad={false}
                        fields="name,email,picture" 
                        callback={responseFacebook} />
                </div>
                <div style={{ marginTop: '20px' }}>
                    <p>New Customer? <Link to="/register">Register</Link></p>
                </div>

            </form>
        </div>
    )
}

export default Login
