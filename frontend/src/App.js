import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";

import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Trade/Dashboard/Dashboard";
import NavBar from "./components/Core/NavBar";
import Profile from "./components/Core/Profile";

import Homepage from "./components/Homepage/Homepage";

import StockLists from "./components/Trade/StockLists/StockLists";
import StockList from "./components/Trade/StockLists/StockList";
import CreateList from "./components/Trade/StockLists/CreateList";
import EditList from "./components/Trade/StockLists/EditList";

import WebSocketProvider, {
  WebSocketContext,
} from "./components/Test/websocket";
import Test from "./components/Test/test";

import { useDispatch, useSelector } from "react-redux";
import { set_user_from_ls, logout } from "./reducers/userReducer";

import CustomAlert from "./components/Core/CustomAlert";
import CustomModal from "./components/Core/modals/CustomModal";

import Cookies from "js-cookie";

const App = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(({ user }) => user);

  useEffect(() => {
    const loggedUser = Cookies.get("user");

    if (loggedUser) {
      const userOk = JSON.parse(loggedUser);
      dispatch(set_user_from_ls(userOk));
    }
  }, [dispatch]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    history.push("/login");
  };

  return (
    <div>
      <Router>
        <CustomAlert />
        <CustomModal />
        <WebSocketProvider>
          <NavBar user={user} handleLogout={handleLogout} />

          <Switch>
            <Route exact path="/homepage">
              <Homepage user={user} />
            </Route>

            <Route exact path="/test">
              <Test />
            </Route>

            <Route exact path="/profile/:name">
              <Profile user={user} />
            </Route>

            <Route exact path="/dashboard">
              <Dashboard user={user} />
            </Route>

            <Route exact path="/lists">
              <StockLists user={user} />
            </Route>

            <Route exact path="/createlist">
              <CreateList user={user} />
            </Route>

            <Route exact path="/editlist/:title">
              <EditList user={user} />
            </Route>

            <Route exact path="/stocklist/:title">
              <StockList />
            </Route>

            <Route exact path="/register">
              <Register />
            </Route>

            <Route exact path="/login">
              <Login />
            </Route>
          </Switch>
        </WebSocketProvider>
      </Router>
    </div>
  );
};

export default App;
