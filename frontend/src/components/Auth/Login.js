import React from "react";
import "./login.scss";
import { Formik, useField, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { user_login } from "../../reducers/userReducer";
import { Redirect } from "react-router-dom";

const Login = () => {
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

  const dispatch = useDispatch();

  const user = useSelector(({ user }) => user);

  if (user) return <Redirect push to="/homepage" />;

  return (
    <>
      <div className="login-wrapper">
        <h2 className={"login-wrapper__header"}>Login to e-Project</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const payload = { email: values.email, password: values.password };
            resetForm();
            setSubmitting(false);
            dispatch(user_login(payload));
          }}
        >
          {(props) => (
            <Form>
              <CustomTextInput name="email" label="Email" />
              <CustomTextInput
                name="password"
                type="password"
                label="Password"
              />
              <button type="submit" className="btn btn-primary">
                {props.isSubmitting ? "Loading..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Login;
