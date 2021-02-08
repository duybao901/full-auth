import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from '../body/home/Home'
import Login from './auth/login/Login'
import Register from './auth/register/Register'
import ActivationEmail from './auth/activation/ActivationEmail'
import ForgotPassword from './auth/forgotPassword/ForgotPassword'
import ResetPassword from './auth/ressetPassword/ResetPassword'
import Profile from './auth/profile/Profile'

function Body() {
    return (
        <Switch>
            <Route path='/' component={Home} exact></Route>
            <Route path='/login' component={Login} exact></Route>
            <Route path='/register' component={Register} exact></Route>
            <Route path='/activate/:activation_token' component={ActivationEmail} exact></Route>
            <Route path='/forgot' component={ForgotPassword} exact ></Route>
            <Route path='/reset/:token' component={ResetPassword} exact ></Route>
            <Route path='/profile' component={Profile} exact></Route>
        </Switch>
    )
}

export default Body
