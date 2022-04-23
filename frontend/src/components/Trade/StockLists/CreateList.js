import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, useField, Form } from "formik";
import Button from "../../Core/button";

import Helper from "../../../services/Helper";
import { useDispatch } from "react-redux";

import tradeService from "../../../services/trade";

import LoggedOut from "../../Core/LoggedOut";
import { errorModal } from "../../../reducers/modalReducer";

import "./createlist.scss";

const CustomTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label style={{ fontSize: "15px" }}>{label}:</label>
      <input
        type="text"
        className="form-control"
        label={label}
        {...field}
        {...props}
      />
      <br />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const AddTitle = ({ setTitle, dispatch }) => {
  return (
    <Formik
      initialValues={{
        title: "",
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        resetForm();
        setSubmitting(false);
        if (await Helper.isTitleValid(values.title)) {
          setTitle(values.title);
        } else {
          dispatch(
            errorModal(
              "Title is invalid or another list with this name exists."
            )
          );
        }
      }}
    >
      {(props) => (
        <Form>
          <CustomTextInput name="title" label="Title" />
          <Button
            type={"submit"}
            className={"info"}
            text={props.isSubmitting ? "Wait.." : "Next"}
          />
        </Form>
      )}
    </Formik>
  );
};

const AddStocks = ({ dispatch, listAction }) => {
  const [fieldVal, setFieldVal] = useState("");

  const addStock = async () => {
    // Check whether the stock entered is valid and whether it already exists in the list
    if (!Helper.isStockValid(fieldVal)) {
      dispatch(errorModal("Ticker is not valid!"));
    } else if (listAction({ type: "IS_PRESENT", data: fieldVal })) {
      dispatch(errorModal("This ticker is already on this list."));
    } else {
      listAction({ type: "ADD_STOCK", data: fieldVal });
      setFieldVal("");
    }
  };

  return (
    <Formik
      initialValues={{
        stock: "",
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        resetForm();
        setSubmitting(false);
        if (!listAction({ type: "IS_EMPTY" })) {
          listAction({ type: "FINISHED", data: true });
        } else {
          dispatch(errorModal("No stocks have been selected so far."));
        }
      }}
    >
      {(props) => (
        <Form>
          <CustomTextInput
            name="stock"
            label="Add Stock"
            value={fieldVal}
            onChange={(e) => setFieldVal(e.target.value)}
          />
          <Button
            type="button"
            className={"ternary"}
            onClick={() => addStock()}
            text={"Add Stock"}
          />
          <span> </span>
          <Button
            type={"submit"}
            className={"success"}
            text={props.isSubmitting ? "Creating" : "Finish"}
          />
        </Form>
      )}
    </Formik>
  );
};

const CreateList = ({ user }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [title, setTitle] = useState();
  const [stocks, setStocks] = useState([]);
  const [finished, setFinished] = useState(false);

  if (!user) {
    return <LoggedOut />;
  }

  const listAction = (action) => {
    switch (action.type) {
      case "REMOVE_STOCK":
        removeStock(action.data);
        break;
      case "ADD_STOCK":
        addStock(action.data);
        break;
      case "IS_EMPTY":
        return isEmpty();
      case "IS_PRESENT":
        return isPresent(action.data);
      case "FINISHED":
        setFinished(action.data);
        break;
      default:
        return null;
    }
  };

  const removeStock = (stock) => {
    setStocks(stocks.filter((s) => s !== stock));
  };

  const addStock = (data) => {
    setStocks((oldStocks) => [...oldStocks, data]);
  };

  const isEmpty = () => {
    return true ? stocks.length === 0 : false;
  };

  const isPresent = (ticker) => {
    for (let i = 0; i < stocks.length; i++)
      if (ticker === stocks[i]) return true;
    return false;
  };

  const finishList = async () => {
    // Add entry to db
    const payload = {
      title: title,
      stocks: stocks,
    };
    try {
      await tradeService.listAction("ADD", payload);
      history.push("/lists");
    } catch (exception) {
      console.log("Error");
    }
  };

  const goBack = () => {
    // Empty fields
    setStocks([]);
    setFinished(false);
    setTitle("");
  };

  return (
    <section className="create-list-wrapper">
      <div className="create-list-wrapper__add-list-section">
        <h1>Create a List</h1>
        {!title && <AddTitle setTitle={setTitle} dispatch={dispatch} />}
        {title && !finished && (
          <AddStocks dispatch={dispatch} listAction={listAction} />
        )}
        {finished && title && (
          <div className="finished-state">
            <Button
              className={"success"}
              onClick={() => finishList()}
              text={"Create List"}
            />
            <Button
              className={"danger"}
              onClick={() => goBack()}
              text={"Go Back"}
            />
          </div>
        )}
      </div>
      <div className="create-list-wrapper__result-list-section">
        {stocks?.map?.((stock) => {
          return (
            <div key={stock} className={"result-item"}>
              <span className="">{stock}</span>
              <Button
                className={"danger"}
                onClick={() => removeStock(stock)}
                text={"X"}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CreateList;
