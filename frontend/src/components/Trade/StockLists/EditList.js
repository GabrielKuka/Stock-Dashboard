import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, useField } from "formik";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

import { errorModal } from "../../../reducers/modalReducer";
import { useDispatch } from "react-redux";

import Helper from "../../../services/Helper";
import tradeService from "../../../services/trade";

import LoggedOut from "../../Core/LoggedOut";
import TickerRow from "./TickerRow";

import Button from "../../Core/button";

import "./editlist.scss";

const CustomTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <b>{label}</b>
      <input type="text" label={label} {...field} {...props} />

      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const AddStocks = ({ dispatch, listAction }) => {
  return (
    <div className="add-stock">
      <Formik
        initialValues={{
          stock: "",
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          resetForm();
          setSubmitting(false);
          const stock = values.stock;
          // Add the stock here
          if (!Helper.isStockValid(stock)) {
            dispatch(errorModal(`Ticker ${stock} is not valid.`));
          } else if (listAction({ type: "IS_PRESENT", data: stock })) {
            dispatch(errorModal(`Ticker ${stock} is already in the list.`));
          } else {
            listAction({ type: "ADD_STOCK", data: { ticker: stock } });
          }
        }}
      >
        {(props) => (
          <Form className={"form"}>
            <CustomTextInput name="stock" label="Add Stock" />
            <Button type="submit" text={"Add Stock"} className="info" />
          </Form>
        )}
      </Formik>
    </div>
  );
};

const EditList = ({ user }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const initialTitle = useParams().title;
  const [title, setTitle] = useState(initialTitle);
  const listId = useRef();
  const [tickerList, setTickerList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Retrieve list data
      const response = await tradeService.listAction("GET_LIST_DATA", title);
      setTickerList(response.stocks);
      listId.current = response.id;
    };

    fetchData();
  }, []);

  const listAction = (action) => {
    switch (action.type) {
      case "ADD_STOCK":
        addStock(action.data);
        break;
      case "REMOVE_STOCK":
        removeStock(action.data);
        break;
      case "IS_PRESENT":
        return isPresent(action.data);
      default:
        return null;
    }
  };

  const addStock = (stock) => {
    setTickerList((oldStocks) => [...oldStocks, stock]);
  };

  const removeStock = (ticker) => {
    setTickerList(tickerList.filter((t) => t.ticker !== ticker));
  };

  const isPresent = (ticker) => {
    for (let i = 0; i < tickerList.length; i++) {
      if (tickerList[i].ticker === ticker) {
        return true;
      }
    }

    return false;
  };

  const finishEdit = async () => {
    // Check if title is valid
    if (
      initialTitle !== title &&
      (await Helper.isTitleValid(title)) === false
    ) {
      dispatch(errorModal(`Title ${title} is invalid.`));
      return;
    }
    // Check  if the list is empty
    if (tickerList.length < 1) {
      dispatch(errorModal("List is empty."));
      return;
    }

    let tickers = [];
    tickerList.map((stock) => tickers.push(stock.ticker));
    const payload = {
      id: listId.current,
      tickers,
      title,
    };
    const result = await tradeService.listAction("UPDATE", payload);
    history.push(`/stocklist/${title}`);
  };

  if (!user) {
    return <LoggedOut />;
  }

  return (
    <div className={"edit-wrapper"}>
      <div className={"edit-wrapper__upper-section"}>
        <div className={"change-title"}>
          <label>
            <b>Change Title</b>
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <AddStocks dispatch={dispatch} listAction={listAction} />
      </div>
      <table className={"edit-wrapper__table"}>
        <thead>
          <tr key="header">
            <td>Stock</td>
            <td>Price</td>
            <td>% Change</td>
            <td>
              <Button
                onClick={finishEdit}
                className="success"
                text={"Finish Editing"}
              />
            </td>
          </tr>
        </thead>
        <tbody>
          {tickerList?.map?.((stonk) => {
            return (
              <TickerRow
                key={stonk.ticker}
                ticker={stonk.ticker}
                edit={true}
                listAction={listAction}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EditList;
