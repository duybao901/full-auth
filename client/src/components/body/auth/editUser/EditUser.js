import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { showErrorMessage, showSuccessMessage } from '../../../ultis/notification/Notification'

const initialState = {
    err: '',
    success: '',
}

function EditUser() {

    const { id } = useParams();
    const history = useHistory();
    const users = useSelector(state => state.users);
    const token = useSelector(state => state.token);

    const [editUser, setEditUser] = useState(false);
    const [adminCheck, setAdminCheck] = useState(false);
    const [status, setStatus] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const { err, success } = status;

    useEffect(() => {
        if (users.length !== 0) {
            users.forEach(user => {
                if (user._id === id) {
                    localStorage.setItem('user', JSON.stringify(user));
                    setEditUser(user);
                }
            });
        }
    }, [users])

    const handleCheck = (e) => {
        setAdminCheck({ ...adminCheck, [e.target.name]: e.target.checked })
    }
    const onHandleChange = async () => {
        try {
            setLoading(true);
            const res = await axios.patch(`/user/update_role/${id}`, {
                role: adminCheck ? 1 : 0,
            }, {
                headers: { Authorization: token }
            })

            setLoading(false);
            setStatus({ ...status, err: '', success: res.data.msg });

        } catch (err) {
            if (err) {
                setStatus({ ...status, err: err.response.data.msg, success:''});

            }
        }
    }

    const goBack = () => {
        history.goBack();
    }

    const user = JSON.parse(localStorage.getItem('user')) || false;

    return (
        <div className='edit-user'>
            <span className='edit-user__goback' onClick={goBack}><i className="fas fa-arrow-left"></i> Go Back</span>
            <div>
                <div className='edit-user__infor'>
                    <label>Name</label>
                    <input type='text' value={editUser.name ? editUser.name : user.name}
                        className="nes-input is-warning"
                        disabled
                    ></input>
                    <div>
                        <label>Email</label>
                        <input type='text' value={editUser.email ? editUser.email : user.email}
                            className="nes-input is-warning"
                            disabled
                        ></input>
                    </div>
                    <div style={{ backgroundColor: "#212529", padding: "1rem 2rem" }}>
                        <label>
                            <input type="checkbox" className="nes-checkbox is-dark" onChange={handleCheck} name='adminCheck' />
                            <span>Is Admin</span>
                        </label>
                    </div>
                    <div>
                        <button type="button" className={loading ? "nes-btn is-disable" : "nes-btn is-warning"} checked={adminCheck}
                            onClick={onHandleChange}
                        >Update</button>
                    </div>
                    <div>
                        {err && showErrorMessage(err)}
                        {success && showSuccessMessage(success)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditUser
