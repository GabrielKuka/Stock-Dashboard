import React from "react";
import Dashboard from "./Dashboard";
import { Provider } from "react-redux";
import App from "../../../App";
import { BrowserRouter as Router } from "react-router-dom";
import store from "../../../store";

import { fireEvent, render } from "@testing-library/react";

const user = {
  email: "elton@gmail.com",
  name: "Elton Kuka",
  phone: "0698567596",
  birthday: "2022-02-08",
};

describe("Dashboard component", () => {
  it("Should render", () => {
    render(
      <Provider store={store}>
        <Router>
          <App>
            <Dashboard user={user} />
          </App>
        </Router>
      </Provider>
    );
  });
});
