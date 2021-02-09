import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'

function Header() {
    const auth = useSelector(state => state.auth)

    const { user, isLogged } = auth

    const showMenu = () => {
        if (isLogged) {
            const userMenu = document.querySelector('.header__user-menu');
            // const userArrow = document.querySelector('.header__user-arrow');
            // userArrow.classList.toggle('active')
            userMenu.classList.toggle('active')
        }
    }

    const logout = async () => {
        try {
            localStorage.clear();
            const res = await axios.get('/user/logout');
            alert(res.data.msg);
            window.location.href = "/";
        } catch (err) {
            if (err) throw err;
        }
    }

    const userLink = () => {
        if (Object.keys(user).length > 0) {
            return <div className='header__user' onClick={showMenu}>
                <img src={user.avatar} alt='user face'></img>
                <span> {user.name}</span>
                {/* <i className="fas fa-sort-down header__user-arrow"></i> */}
                <div className="header__user-menu">
                    <div>
                        <Link to="/profile">Profile</Link>
                    </div>
                    <div><button href="#" onClick={logout}>logout</button></div>
                </div>
            </div>
        }
    }

    return (
        <div className="header">
            <div className="header__logo">
                <Link to="/">
                    <i className="nes-octocat animate"></i>
                </Link>
            </div>
            <div className="header__right">
                <div style={{color:"white"}}>
                    {isLogged ? userLink() : <Link to="/login" style={{color:'white'}}>
                        Sign in
                    </Link>}
                </div>
            </div>
        </div>
    )
}

export default Header
