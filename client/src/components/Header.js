import React,{useContext, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'


function Header() {
  const {userInfo,setUserInfo} = useContext(UserContext)
  useEffect(()=>{
    fetch('http://localhost:4000/profile',{
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo)
      })
    })
  },[])

  function logout() {
    fetch('http://localhost:4000/logout',{
      credentials:'include',
      method: 'POST',
    });
    setUserInfo(null)
  }

  return (
    <header>
        <Link to="/" className="logo">
          My Blog
        </Link>
        <nav>
          {userInfo?.username && (
            <>
            <Link to='/create'>create post</Link>
            <a onClick={logout}>Logout</a>
            
            </>
          )}
           {!userInfo?.username && (
            <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            </>
          )}
          
        </nav>
      </header>
  )
}

export default Header