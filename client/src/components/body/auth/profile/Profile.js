import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { showErrorMessage, showSuccessRegisterMessage } from '../../../ultis/notification/Notification'
import { isLength, isMatch } from '../../../ultis/validation/Validation'
import axios from 'axios'

const initialState = {
    name: '',
    password: '',
    cf_password: '',
    err: '',
    success: '',
}

function Profile() {
    const auth = useSelector(state => state.auth);
    const token = useSelector(state => state.token);
    const { user, isAdmin } = auth;
    const [data, setData] = useState(initialState);
    const [avatar, setAvatar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [callback, setCallback] = useState(false);

    const { name, password, cf_password, err, success } = data;

    const onHandleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const onHandleChangeAvatar = async (e) => {
        try {
            e.preventDefault();
            const formData = new FormData();
            const file = e.target.files[0];
            if (!file) {
                setData({ ...data, err: 'No files were uploaded', success: '' });
                return null;
            }
            if (file.size > 1024 * 1024) {
                setData({ ...data, err: 'Please upload a picture smaller than 1 MB.', success: '' });
                return null;
            }
            if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') {
                setData({ ...data, err: 'Files format is incorrect', success: '' });
                return null;
            }
            setLoading(true);
            formData.append('file', file);
            const res = await axios.post('/api/upload_avatar', formData, {
                headers: { 'content-type': 'multipatch/form-data', Authorization: token }
            })
            setAvatar(res.data.url);

            setLoading(false);
        } catch (err) {

        }
    }

    const updateInfor = async (e) => {
        try {
            console.log(avatar);
            // const formData = new FormData();
            const res = await axios.post('/user/update', {
                name: name ? name : user.name,
                avatar: avatar ? avatar : user.avatar
            }, {
                headers: { Authorization: token }
            });
            setData({ ...data, err: '', success: res.data.msg });
        } catch (err) {
            if (err) {
                setData({ ...data, err: err.response.data.msg, success: '' })
            }
        }
    }

    const updatePassword = async () => {
        try {
            if (isLength(password)) {
                setData({ ...data, err: 'Password must last at 6 characters', success: '' });
                return null;
            }
            if (isMatch(password, cf_password)) {
                setData({ ...data, err: 'Password not match', success: '' });
                return null;
            }
            const res = await axios.post('/user/reset', { password }, {
                headers: { Authorization: token }
            })
            setData({ ...data, err: '', success: res.data.msg });
        } catch (err) {
            if (err) {
                setData({ ...data, err: err.response.data.msg, success: '' })
            }
        }
    }

    const onHandleSubmit = () => {

        updateInfor();

        if (password || cf_password) {
            updatePassword();
        }
    }

    return (
        <React.Fragment>
            {err && showErrorMessage(err)}
            {success && showSuccessRegisterMessage(success)}
            {loading && "loading..."}
            <div className='profile'>
                <div className='profile__left'>
                    <h2>{isAdmin ? "Admin Profile" : "User profile"}</h2>
                    <div className='profile__avatar'>
                        <img src={avatar ? avatar : user.avatar} alt=''></img>
                        <div>
                            <i className="fa fa-camera" aria-hidden="true"></i>
                            <span>Change</span>
                            <input type='file' id="file_up" onChange={onHandleChangeAvatar}></input>
                        </div>
                    </div>
                    <div className='profile__infor'>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input type='text' name='name' id='name'
                                placeholder="Enter your name..." defaultValue={user.name}
                                className="nes-input is-warning"
                                onChange={onHandleChange}></input>
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input type='email' name='email' id='email'
                                placeholder="Enter your email..." defaultValue={user.email} disabled
                                className="nes-input is-warning"
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input type='password' name='password' id='password'
                                placeholder="Enter your password..." defaultValue={user.password}
                                className="nes-input is-warning"
                                onChange={onHandleChange}></input>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type='password' name='cf_password' id='confirmPassword'
                                placeholder="Enter your confirm password..." defaultValue={user.cf_password}
                                className="nes-input is-warning"
                                onChange={onHandleChange}></input>
                        </div>
                        <button type="submit" className="nes-btn is-warning" onClick={onHandleSubmit}>Update</button>
                    </div>
                </div>
                <div className='profile__right'>
                    <h2>My order</h2>
                    <table className='customers'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Admin</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td>@mdo</td>
                            </tr>
                            {/* <tr>
                            <th>2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th>3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr> */}
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Profile
