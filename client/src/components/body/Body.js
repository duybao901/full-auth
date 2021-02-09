import React from 'react'
import { useSelector } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

import Home from '../body/home/Home'
import Login from './auth/login/Login'
import Register from './auth/register/Register'
import ActivationEmail from './auth/activation/ActivationEmail'
import ForgotPassword from './auth/forgotPassword/ForgotPassword'
import ResetPassword from './auth/ressetPassword/ResetPassword'
import Profile from './auth/profile/Profile'
import EditUser from './auth/editUser/EditUser'
import PageNotFound from './PageNotFound'

function Body() {

    const auth = useSelector(state => state.auth)
    const { isLogged } = auth;

    return (
        <Switch>
            <Route path='/' component={Home} exact></Route>
            <Route path='/login' component={isLogged ? PageNotFound : Login} exact></Route>
            <Route path='/register' component={isLogged ? PageNotFound : Register} exact></Route>
            <Route path='/user/activate/:activation_token' component={ActivationEmail} ></Route>
            <Route path='/forgot' component={isLogged ? PageNotFound : ForgotPassword} exact ></Route>
            <Route path='/reset/:token' component={isLogged ? PageNotFound : ResetPassword} exact ></Route>
            <Route path='/profile' component={Profile} exact></Route>
            <Route path='/edit_user/:id' component={EditUser} exact></Route>
        </Switch>
    )
}

export default Body
