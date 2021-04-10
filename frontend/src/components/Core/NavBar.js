import React from 'react';
import {Link} from 'react-router-dom'

 
const styles = {
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
    link: {
      margin:'5px',
      color:'white',
      
    },
 
}


const NavBar = ({user, handleLogout}) => {

    
    return(
      <nav id='nav'className="navbar navbar-expand-lg navbar-dark bg-primary rounded">
        <a className="navbar-brand" style={styles.link} href="/">Pernet</a>
      {
      user
      ?
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
          <Link style={styles.link} className="nav-link"  to="/me">My Profile</Link>
          </li>

          <li className="nav-item">
          <button  className="btn btn-danger" style={styles.link} onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      :
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
          <Link  to="/register"><button style={styles.link} className='btn'>Register</button></Link>
          </li>

          <li className="nav-item">
          <Link  to="/login"><button style={styles.link} className='btn'>Login</button></Link>
          </li>
        </ul>
      }
      </nav>
    )
}

export default NavBar;
