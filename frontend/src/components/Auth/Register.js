import React from 'react'
import '../style.css'

import {Formik, useField, Form} from 'formik'
import * as Yup from 'yup'

import userService from '../../services/user'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useHistory } from 'react-router-dom'
import {errorAlert, successAlert} from '../../reducers/alertReducer'

const CustomTextInput = ({label, ...props}) => {
  const [field, meta] = useField(props)
  return(
    <>
      {label}
      <input type='text' className='form-control' label={label}  {...field} {...props} />

    <br/>
    {meta.touched && meta.error ? (
    <div className='error'>{meta.error}</div>
    ): null}
    </>
  );
}

const styles = {
  form:{padding:10, marginTop:10}
}

const Register = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const user = useSelector( ({user}) => user )

    if (user) {
      return <Redirect push to="/"/> 
    } 
  
    return (
      <>
      <div className='register'>
        <h2 style={{fontSize:20}}>Register to Pernet</h2>
        <Formik
          initialValues={{
            fName: '',
            email: '',
            pass: '',
          }}
          validationSchema={
            Yup.object({
            fName: Yup.string().min(6, 'Name must be at least 6 characters').required('Required'),
            email: Yup.string().email('Email is not valid').required('Required'),
            pass: Yup.string()
              .min(6, 'Password must be at least 6 characters')
              .required('Required')
              .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, 'Password must contain letters and numbers.'),
          })}
          onSubmit={async (values, {setSubmitting, resetForm}) => {
            resetForm();
            setSubmitting(false);
            const payload = {
              name: values.fName,
              email: values.email,
              password: values.pass,
            }
            
            try{
              await userService.register(payload);
              dispatch(successAlert("Successfully Registered, now you can log in!"));
              setTimeout(()=>dispatch(errorAlert("")),3000);
              history.push('/login')
                  
            }
            catch(exception){
                  dispatch(errorAlert("You cannot register with the provided credentials!"));
                  setTimeout(()=>dispatch(errorAlert("")),3000);
            }
          }}
        >
         {props => (
          <Form style={styles.form}>
          <CustomTextInput name='fName' label='Full Name' />
            <CustomTextInput name='email' label='Email'  />
            <CustomTextInput name='pass' type='password' label='Password'  />
            <button type='submit' className='btn btn-primary'>{props.isSubmitting ? 'Loading...' : 'Register'}</button>   
           </Form>
         )} 
        </Formik>
      </div>
      </>
    ); 
}

export default Register;
