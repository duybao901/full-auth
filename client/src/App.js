import React, { useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import './App.css';
import { BrowserRouter as Router } from "react-router-dom"
import Header from './components/header/Header'
import Body from './components/body/Body'
import * as authActions from './redux/actions/authAction'

function App() {

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth)
  const token = useSelector(state => state.token)

  useEffect(() => {
    const firstlogin = localStorage.getItem("firstlogin");
    if (firstlogin) {
      const getToken = async () => {
        const res = await axios.get('/user/refresh_token');
        return dispatch(authActions.getToken(res.data.accessToken));
      }
      getToken();
    }
  }, [dispatch, auth.isLogged])

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        dispatch(authActions.login())
        return authActions.fecthUser(token).then(res => {
          dispatch(authActions.getUserInfor(res));
        })
      }
      getUser();
    }
  }, [token, dispatch])

  return (
    <Router>
      <div className="app">
        <Header />
        <Body />
      </div>
    </Router>
  );
}

export default App;
