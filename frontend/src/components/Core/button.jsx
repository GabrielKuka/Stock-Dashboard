import React from "react";
import "./button.scss";
/*
Custom Button
Props:
1. text: The text that appears in the button
2. testKey: Used for uniqely identifying buttons in unit-tests (optional)
3. onClick: onclick functionality
4. className: optional
*/
const Button = (props) => {
  const buttonType =
    !props.type || props.type === "button" ? "button" : "submit";
  return (
    <button
      type={buttonType}
      className={
        props.className ? `${props.className} ${buttonType}` : buttonType
      }
      data-testid={
        props.testKey ? `${props.testKey}-${buttonType}` : `${buttonType}`
      }
      onClick={buttonType === "button" ? props.onClick : false}
    >
      {props.text}
    </button>
  );
};

export default Button;