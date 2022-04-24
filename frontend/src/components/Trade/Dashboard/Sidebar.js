import React, { useState, useEffect } from "react";
import "./dashboard.scss";
import { Formik, useField, Form, Field } from "formik";
import tradeService from "../../../services/trade";
import { useDispatch } from "react-redux";
import { changeTicker, changeTickerView } from "../../../reducers/tradeReducer";
import Helper from "../../../services/Helper";
import { errorModal } from "../../../reducers/modalReducer";
import "./sidebar.scss";

import Button from "../../Core/button";

const CustomTextInput = ({ label, ...props }) => {
  const [field] = useField(props);
  return (
    <>
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

  const [currentTicker, setCurrentTicker] = useState("");
  const [currentView, setView] = useState("Overview");

  useEffect(() => {
    if (typeof props.ticker !== "undefined") {
      submitRequest({ ticker: props.ticker });
    }
  }, []);

  const getDataAndUpdateUI = async (ticker, view) => {
    // Make request to retrieve data
    const result = await tradeService.getTickerData(ticker, view);
    const header = await tradeService.getHeader(ticker);

    // send data to dashboard
    props.tickerData(result, header);
  };

  const handleViewChange = async (view) => {
    if (currentTicker !== "") {
      // Change viewtype
      setView(view);
      dispatch(changeTickerView(view));

      getDataAndUpdateUI(currentTicker, view);
    }
  };

  const submitRequest = async (values) => {
    try {
      if (values.ticker && values.ticker.length > 0) {
        if (Helper.isStockValid(values.ticker)) {
          //Change components state
          setView(values.viewtype);
          setCurrentTicker(values.ticker);

          // Store current ticker and tickerView in redux
          dispatch(changeTickerView(values.viewtype));
          dispatch(changeTicker(values.ticker));

          getDataAndUpdateUI(values.ticker, values.viewtype);
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
    }
  };

  return (
    <div className="sidebar">
      <h3 className="sidebar-heading">Pernet</h3>

      <Formik
        initialValues={{
          ticker: typeof props.ticker !== "undefined " ? props.ticker : "",
          viewtype: "Overview",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(false);
          submitRequest(values);
        }}
      >
        {(props) => (
          <Form>
            <div className="ticker-input-submit-container">
              <CustomTextInput
                name="ticker"
                label="Ticker"
                id="ticker-input-field"
                placeholder={"Enter ticker..."}
              />
              <Button
                className="info"
                text={props.isSubmitting ? "Loading" : "Search"}
                name="submit"
                type="submit"
              />
            </div>
            <div role="view-group" className={"view-group-container"}>
              <label>
                <Field
                  type="radio"
                  name="viewtype"
                  value="Overview"
                  onClick={() => handleViewChange("Overview")}
                />
                Overview
              </label>
              <label>
                <Field
                  type="radio"
                  name="viewtype"
                  value="Stats"
                  onClick={() => handleViewChange("Stats")}
                />
                Stats
              </label>
              <label>
                <Field
                  type="radio"
                  name="viewtype"
                  value="News"
                  onClick={() => handleViewChange("News")}
                />
                News
              </label>
              <label>
                <Field
                  type="radio"
                  name="viewtype"
                  value="Technicals"
                  onClick={() => handleViewChange("Technicals")}
                />
                Technicals
              </label>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Sidebar;
