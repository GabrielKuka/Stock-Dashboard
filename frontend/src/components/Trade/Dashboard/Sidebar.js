import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import "./dashboard.css";
import { Formik, useField, Form } from "formik";
import tradeService from "../../../services/trade";
import { useDispatch } from "react-redux";
import { changeTicker, changeTickerView } from "../../../reducers/tradeReducer";
import Helper from "../../../services/Helper";
import { errorModal } from "../../../reducers/modalReducer";

const CustomTextInput = ({ label, ...props }) => {
  const [field] = useField(props);
  return (
    <>
      {label}
      <input
        type="text"
        className="form-control"
        label={label}
        {...field}
        {...props}
      />
      <br />
    </>
  );
};

const Sidebar = (props) => {
  const dispatch = useDispatch();

  const [currentView, setView] = useState("Overview");

  useEffect(() => {
    if (typeof props.ticker !== "undefined") {
      submitRequest({ ticker: props.ticker });
    }
  }, []);

  const submitRequest = async (values) => {
    try {
      if (values.ticker && values.ticker.length > 0) {
        if (Helper.isStockValid(values.ticker)) {
          // Store current ticker and tickerView
          dispatch(changeTickerView(currentView));
          dispatch(changeTicker(values.ticker));

          // Get Stonk data
          const result = await tradeService.getTickerData(
            values.ticker,
            currentView
          );
          const header = await tradeService.getHeader(values.ticker);

          // send data to dashboard
          props.tickerData(result, header);
        } else {
          dispatch(errorModal("That is not a valid ticker!"));
        }
      }
    } catch (exception) {
      dispatch(
        errorModal(
          `Something went wrong? IEX Cloud does not recognize ${values.ticker} as valid ticker.`
        )
      );
      //dispatch(errorAlert("Something went wrong!"));
      //setTimeout(() => dispatch(errorAlert("")), 2000);
    }
  };

  return (
    <Nav className="col-md-12 d-none d-md-block sidebar">
      <Nav.Item>
        <h3 className="sidebar-heading">Pernet</h3>
      </Nav.Item>

      <Formik
        initialValues={{
          ticker: typeof props.ticker !== "undefined " ? props.ticker : "",
          view: "Overview",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(false);
          submitRequest(values);
        }}
      >
        {(props) => (
          <Form>
            <CustomTextInput name="ticker" label="Ticker" />
            <span>View</span>
            <br />
            <select onChange={(e) => setView(e.target.value)} name="view">
              <option>Overview</option>
              <option>Stats</option>
              <option>News</option>
              <option>Technicals</option>
            </select>
            <span> </span>
            <button className="btn btn-primary" name="submit" type="submit">
              {props.isSubmitting ? "Loading" : "Search"}
            </button>
          </Form>
        )}
      </Formik>
    </Nav>
  );
};

export default Sidebar;
