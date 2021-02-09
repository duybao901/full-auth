import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { showErrorMessage, showSuccessRegisterMessage } from '../../../ultis/notification/Notification'
import { isEmpty, isLength, isMatch } from '../../../ultis/validation/Validation'
import axios from 'axios'
import { fetchAllUsers, getAllUsers } from '../../../../redux/actions/usersAction'

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
    const users = useSelector(state => state.users);
    const dispatch = useDispatch();
    const { user, isAdmin } = auth;
    const [data, setData] = useState(initialState);
    const [avatar, setAvatar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [callback, setCallback] = useState(false);

    const { name, password, cf_password, err, success } = data;

    useEffect(() => {
        if (isAdmin) {
            fetchAllUsers(token).then(res => {
                dispatch(getAllUsers(res));
            })
        }
    }, [isAdmin, users, dispatch, token, callback, users.role])

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
            await axios.post('/user/update', {
                name: name ? name : user.name,
                avatar: avatar ? avatar : user.avatar
            }, {
                headers: { Authorization: token }
            });
            setData({ ...data, err: '', success: 'Update name successfully' });
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
            if (isEmpty(cf_password) && !isEmpty(password)) {
                setData({ ...data, err: 'Password not match', success: '' });
                return null;
            }
            if (!isMatch(password, cf_password)) {
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

    const onHandleSubmit = (e) => {
        e.preventDefault();
        if (name) {
            updateInfor();
        }
        if (password) {
            updatePassword();
        }

    }

    const deleteUser = async (id) => {
        try {
            if (window.confirm("Are you sure want to delete this user")) {
                setLoading(true);
                const res = await axios.delete(`/user/delete/${id}`, {
                    headers: { Authorization: token }
                });
                setLoading(false)
                setCallback(!callback);
            }
        } catch (err) {
            setData({ ...err, err: err.response.data.msg, success: '' })
        }
    }

    return (
        <React.Fragment>
            {err && showErrorMessage(err)}
            {success && showSuccessRegisterMessage(success)}
            {loading && <span className="nes-text is-warning" style={{ fontSize: '20px', display: 'block' }}>Loading...</span>}
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
                        <form>
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
                                    // autoComplete=''

                                    onChange={onHandleChange}></input>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input type='password' name='cf_password' id='confirmPassword'
                                    placeholder="Enter your confirm password..." defaultValue={user.cf_password}
                                    className="nes-input is-warning"
                                    // autoComplete=''
                                    onChange={onHandleChange}></input>
                            </div>
                            <button type="submit" className="nes-btn is-warning" onClick={onHandleSubmit}>Update</button>
                        </form>
                    </div>
                </div>

                <div className='profile__right'>
                    <h2>My order</h2>
                    <div className='profile__customers'>
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
                                {users.map(user => {
                                    return <tr key={user._id}>
                                        <td className='profile__customers-id'>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td style={{ textAlign: 'center', transform: 'scale(.7)' }}>
                                            {
                                                user.role === 1 ?
                                                    <i className="nes-icon is-medium star"></i> :
                                                    <i className="nes-icon is-medium star is-empty"></i>

                                            }
                                        </td>
                                        <td className='profile__customers-action'>
                                            <Link to={`/edit_user/${user._id}`} ><i className="far fa-edit" title="Edit User"></i></Link>
                                            <button onClick={() => deleteUser(user._id)}><i className="far fa-trash-alt" title="Delete User"></i></button>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Profile
