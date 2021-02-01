import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { showErrorMessage, showSuccessMessage } from '../../../ultis/notification/Notification'

const initialState = {
    err: '',
    success: ''
}

function ActivationEmail() {

    const [state, setState] = useState(initialState);

    const { activation_token } = useParams();
    const { err, success } = state;
    useEffect(() => {
        if (activation_token) {
            const activate = async () => {
                try {
                    const res = await axios.post('/user/activation_email', {
                        activation_token
                    })
                    setState({ success: res.data.msg })
                } catch (err) {
                    err.response.data.msg && setState({ err: err.response.data.msg })
                }
            }
            activate();
        }

    }, [activation_token])

    return (
        <div>
            {err && showErrorMessage(err)}
            {success && showSuccessMessage(success)}
        </div>
    )
}

export default ActivationEmail;
