import React from "react";
import { Link } from "react-router-dom";
import "./navbar.scss";
import Button from "../Core/button";

import TopList from "../Trade/StockLists/TopList";

const LoggedInNav = ({ user, handleLogout }) => {
  return (
    <>
      <TopList user={user} />
      <Link className="" to={"/lists"}>
        Stock Lists
      </Link>

      <Link className="" to={"/profile/" + user.name}>
        My Profile
      </Link>

      <Button
        text={"Logout"}
        type={"action"}
        onClick={() => handleLogout}
        testKey={"logout"}
      />
    </>
  );
};

const LoggedOutNav = () => {
  return (
    <div className="">
      <Link to="/register">
        <button className="btn">Register</button>
      </Link>

      <Link to="/login">
        <button className="btn">Login</button>
      </Link>
    </div>
  );
};

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav className="navbar-wrapper">
      <a className="navbar-wrapper__brand" href="/homepage">
        Pernet
      </a>
      {user ? (
        <LoggedInNav user={user} handleLogout={handleLogout} />
      ) : (
        <LoggedOutNav />
      )}
    </nav>
  );
};

export default NavBar;
