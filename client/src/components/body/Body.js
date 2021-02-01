import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Login from './auth/login/Login'
import Register from './auth/register/Register'
import ActivationEmail from './auth/activation/ActivationEmail'
function Body() {
    return (
        <Switch>
            <Route path='/login' component={Login}></Route>
            <Route path='/register' component={Register}></Route>
            <Route path='/user/activate/:activation_token' component={ActivationEmail}></Route>
        </Switch>
    )
}

export default Body
