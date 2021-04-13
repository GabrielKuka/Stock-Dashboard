import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Formik, useField, Form} from 'formik'
import * as Yup from 'yup'

import tradeService from '../../../services/trade'

import LoggedOut from '../../Core/LoggedOut'

import './style.css'

const CustomTextInput = ({label, ...props}) => {
  const [field, meta] = useField(props)
  return(
    <>
      <label><b>{label}</b></label> 
      <input type='text' className='form-control' label={label} {...field} {...props} />

    <br/>
    {meta.touched && meta.error ? (
    <div className='error'>{meta.error}</div>
    ): null}
    </>
  );
}

const AddTitle = (props)=>{

    const isTitleValid = (title) => {
        // Make a request to server to see if this title exists
        return true
    }

    return (

        <Formik
            initialValues={{
                title: '',
            }}

            onSubmit={(values, {setSubmitting, resetForm})=>{
                resetForm()
                setSubmitting(false)
                if(isTitleValid){
                    props.setTitle(values.title)
                }else {
                    window.alert('A list with this title already exists.')
                }
            }}
        >
            {props => (
                <Form>
                    <CustomTextInput name='title' label='Title'/>
                    <button type='submit' className='btn btn-primary'>{props.isSubmitting ? 'Wait..' : 'Next'}</button>
                </Form>
            )}
        </Formik>
    )
}

const AddStocks = (props)=>{

    const [stocks, setStocks] = useState([])
    const [fieldVal, setFieldVal] = useState('')

    const addStock = () => {
        if(isStockValid){ 
            setStocks(oldStocks => [...oldStocks, fieldVal])
            setFieldVal('')
        }else {
            window.alert('Stock is not valid')
        }
    }

    const isStockValid = () => {
        // Check whether ticker is valid (make a request to alpaca or iex cloud) 
        var exists = true
        return exists
    }

    const handleChange = (e) => {
        setFieldVal(e.target.value)
    }

    return (
        <Formik
            initialValues={{
                stock: '',
            }}

            onSubmit={(values, {setSubmitting, resetForm})=>{
                resetForm()
                setSubmitting(false)
                props.setStockList(stocks)
            }}
        >
            {props => (
                <Form>
                    <CustomTextInput name='stock' label='Add Stock' value={fieldVal} onChange={(e)=>handleChange(e)}/>
                    <button type='button' className='btn btn-outline-info' onClick={()=>addStock()}>Add Stock</button> <span> </span>
                    <button type='submit' className='btn btn-primary'>{props.isSubmitting ? 'Creating' : 'Finish'}</button>
                </Form>
            )}
        </Formik>
    )
}

const CreateList = ({user}) => {

    const history = useHistory()
    const [title, setTitle] = useState()
    const [stocks, setStocks] = useState([])

    if(!user){
        return <LoggedOut />
    }

    function setListTitle(title){
        setTitle(title)
        console.log(title)
    }

    const finishList = async ()=>{
        // Add entry to db
        const payload = {
            title: title,
            stocks: stocks,
        }
        try{
            await tradeService.listAction('ADD', payload)
            history.push('/lists')
        }catch(exception){
            console.log('Error')
        }
    }

    const goBack = ()=>{
        // Empty fields 
        console.log('Going back')
        setStocks([])
        setTitle('')
    }

    return (
        <div className='container'>
            <h1>Create a List</h1>
            {!title && 
                <AddTitle setTitle={setListTitle}/>
            }
            {title && stocks.length == 0 &&  
                <AddStocks setStockList={setStocks}/>
            }
            {stocks.length > 0 && title && 
                <div className='card'>
                    <div className='card-body'>
                        <p className='card-title'>Title: {title}</p>
                        <label><b>Chosen stocks:</b></label>
                        <ul>
                            {stocks.map(stock=>{
                                return <li key={stock}>{stock}</li>
                            })}
                        </ul>
                        <div className='d-flex justify-content-center'>
                            <button onClick={()=>finishList()} className='btn btn-success'>Create List</button>
                            <button onClick={()=>goBack()}className='btn btn-outline-danger goback-option'>Go Back</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default CreateList