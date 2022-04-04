import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";

import { Formik, useField, useFormikContext, Form } from "formik";
import * as Yup from "yup";

import userService from "../../services/user";
import { errorAlert, successAlert } from "../../reducers/alertReducer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Helper from "../../services/Helper";

import "./register.scss";

export const DatePickerField = ({ label, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  const years = Helper.range(1970, parseInt(Helper.getYear(new Date())) + 1, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <>
      {label}
      <DatePicker
        {...field}
        {...props}
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div>
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
              {"<"}
            </button>
            <select
              value={Helper.getYear(date)}
              onChange={({ target: { value } }) => changeYear(value)}
            >
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={months[Helper.getMonth(date)]}
              onChange={({ target: { value } }) =>
                changeMonth(months.indexOf(value))
              }
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
              {">"}
            </button>
          </div>
        )}
        selected={(field.value && new Date(field.value)) || null}
        placeholderText="YYYY-MM-DD"
        dateFormat="yyyy-MM-dd"
        forceShowMonthNavigation={true}
        className="form-control"
        withPortal
        onChange={(val) => {
          setFieldValue(field.name, val);
        }}
      />
    </>
  );
};

const CustomTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
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

      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const Register = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector(({ user }) => user);

  if (user) {
    return <Redirect push to="/" />;
  }

  return (
    <>
      <div className="register-wrapper">
        <h2 style={{ fontSize: 20 }}>Register to Pernet</h2>
        <Formik
          initialValues={{
            fName: "",
            email: "",
            phone: "",
            pass: "",
            birthday: "",
          }}
          validationSchema={Yup.object({
            fName: Yup.string()
              .min(6, "Name must be at least 6 characters")
              .required("Required"),
            email: Yup.string()
              .email("Email is not valid")
              .required("Required"),
            pass: Yup.string()
              .min(6, "Password must be at least 6 characters")
              .required("Required")
              .matches(
                /^(?=.*[a-zA-Z])(?=.*[0-9])/,
                "Password must contain letters and numbers."
              ),
            phone: Yup.string()
              .matches(
                /\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                "Phone number is invalid"
              )
              .min(10, "Invalid phone number")
              .required("Required"),
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            resetForm();
            setSubmitting(false);
            const payload = {
              name: values.fName,
              email: values.email,
              password: values.pass,
              phone: values.phone,
              birthday: Helper.formatBirthday(values.birthday),
            };
            try {
              await userService.register(payload);
              dispatch(
                successAlert("Successfully Registered, now you can log in!")
              );
              setTimeout(() => dispatch(errorAlert("")), 3000);
              history.push("/login");
            } catch (exception) {
              dispatch(
                errorAlert("You cannot register with the provided credentials!")
              );
              setTimeout(() => dispatch(errorAlert("")), 3000);
            }
          }}
        >
          {(props) => (
            <Form className={"register-form"}>
              <CustomTextInput name="fName" label="Full Name" />
              <CustomTextInput name="email" label="Email" />
              <DatePickerField name="birthday" label="Date of birth" />
              <CustomTextInput name="pass" type="password" label="Password" />
              <CustomTextInput name="phone" label="Phone Number" />
              <button type="submit" className="btn btn-primary">
                {props.isSubmitting ? "Loading..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Register;
