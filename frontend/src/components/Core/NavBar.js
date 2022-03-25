import React from "react";
import { Link } from "react-router-dom";
import "./navbar.scss";
import Button from "../Core/button";

import TopList from "../Trade/StockLists/TopList";

const LoggedInNav = ({ user, handleLogout }) => {
  return (
    <div className={"navigation-bar__logged-in"}>
      <TopList user={user} />
      <div className={"menu-buttons"}>
        <Link className="" to={"/lists"}>
          <Button text={"Stock Lists"} />
        </Link>

        <Link className="" to={"/profile/" + user.name}>
          <Button text={"Profile"} />
        </Link>

        <Button
          text={"Logout"}
          onClick={(e) => handleLogout(e)}
          testKey={"logout"}
        />
      </div>
    </div>
  );
};

const LoggedOutNav = () => {
  return (
    <div className={"navigation-bar__logged-out"}>
      <Link to="/register">
        <Button text={"Register"} />
      </Link>

      <Link to="/login">
        <Button text={"Login"} />
      </Link>
    </div>
  );
};

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav className="navigation-bar">
      <Link to={"/homepage"} className={"navigation-bar__header"}>
        Pernet
      </Link>

      {user ? (
        <LoggedInNav user={user} handleLogout={handleLogout} />
      ) : (
        <LoggedOutNav />
      )}
    </nav>
  );
};

export default NavBar;
