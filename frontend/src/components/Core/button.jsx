import React from "react";
import "./button.scss";
/*
Custom Button
Props:
1. text: The text that appears in the button
2. testKey: Used for uniqely identifying buttons in unit-tests (optional)
3. onClick: onclick functionality
4. data: onClick parameters
*/
const Button = (props) => {
  if (props.type === "action") {
    return (
      <>
        {console.log(props.onClick)}
        <button
          type="button"
          className={"action-button"}
          data-testid={props.testKey ? `${props.testKey}-action` : "action"}
          onClick={() => props.onClick(props.data)}
        >
          {props.text}
        </button>
      </>
    );
  } else if (props.type === "submit") {
    return (
      <>
        <button
          type="submit"
          value={props.text}
          className={"submit-button"}
          data-testid={props.testKey ? `${props.testKey}-submit` : "submit"}
          onClick={() => props.onClick(props.data)}
        >
          {props.text}
        </button>
      </>
    );
  }
};

export default Button;
