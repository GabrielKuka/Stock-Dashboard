import userService from "../services/user";
import { errorAlert, successAlert } from "./alertReducer";

import Cookies from "js-cookie";

const userReducer = (state = null, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.data;

    case "SET_USER":
      return action.data;

    case "LOGOUT":
      Cookies.remove("user");
      return null;

    default:
      return state;
  }
};

export const user_login = (payload) => {
  return async (dispatch) => {
    try {
      const dataToken = await userService.login(payload);
      tokenizeServices(dataToken.token);
      const data = await userService.getUser();

      const localUser = {
        token: dataToken.token,
        data,
      };
      // window.localStorage.setItem('user', JSON.stringify(localUser) )
      Cookies.set("user", JSON.stringify(localUser), { secure: true });

      dispatch({
        type: "LOGIN",
        data,
      });
    } catch (exception) {
      dispatch(errorAlert("Invalid credentials"));
      setTimeout(() => dispatch(errorAlert("")), 4000);
    }
  };
};

export const set_user_from_ls = (user) => {
  return {
    type: "SET_USER",
    data: user.data,
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch({
      type: "LOGOUT",
    });
  };
};

const tokenizeServices = (token) => {
  userService.setToken(token);
};

export default userReducer;
