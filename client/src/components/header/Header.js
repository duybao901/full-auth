import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
    const auth = useSelector(state => state.auth)

    const { user, isLogged } = auth


    const userLink = () => {
        if (Object.keys(user).length > 0) {
            return <Link className='header__user' to='/user/detail'>
                <img src={user.avatar.url} alt='user face'></img>
                {user.name}
            </Link>
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
                <div>
                    {isLogged ? userLink() : <Link to="/login">
                        Sign in
                    </Link>}

                </div>
            </div>
        </div>
    )
}

export default Header
