import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

import TopList from "../Trade/StockLists/TopList";

const styles = {
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  link: {
    margin: "5px",
    color: "white",
  },
};

const LoggedInNav = ({ user, handleLogout }) => {
  return (
    <>
      <TopList user={user} />
      <ul className="navbar-nav ml-auto">
        <li className="nav-item active">
          <Link
            style={styles.link}
            className="btn btn-success"
            to={"/dashboard"}
          >
            Dashboard
          </Link>
        </li>
        <li className="nav-item active">
          <Link style={styles.link} className="btn btn-secondary" to={"/lists"}>
            Stock Lists
          </Link>
        </li>

        <li className="nav-item active">
          <Link
            style={styles.link}
            className="btn btn-info"
            to={"/profile/" + user.name}
          >
            Profile
          </Link>
        </li>

        <li className="nav-item">
          <button
            className="btn btn-danger"
            style={styles.link}
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </>
  );
};

const LoggedOutNav = () => {
  return (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link to="/register">
          <button style={styles.link} className="btn">
            Register
          </button>
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/login">
          <button style={styles.link} className="btn">
            Login
          </button>
        </Link>
      </li>
    </ul>
  );
};

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav id="nav" className="navbar pt-2 pb-2 navbar-expand-lg sticky-top">
      <a className="navbar-brand" style={styles.link} href="/homepage">
        Pernet
      </a>
      {user ? (
        <div className="collapse navbar-collapse">
          <LoggedInNav user={user} handleLogout={handleLogout} />
        </div>
      ) : (
        <LoggedOutNav />
      )}
    </nav>
  );
};

export default NavBar;
