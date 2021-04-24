import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Formik, useField, Form} from 'formik'

import Helper from '../../../services/Helper'

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

    const isTitleValid = async (title) => {
        // Make a request to server to see if this title exists
        const response = await tradeService.listAction('CHECK_TITLE', title)
        return response.status 
    }

    return (

        <Formik
            initialValues={{
                title: '',
            }}

            onSubmit={async (values, {setSubmitting, resetForm})=>{
                resetForm()
                setSubmitting(false)
                if(await isTitleValid(values.title)){
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

    const [fieldVal, setFieldVal] = useState('')

    const addStock = () => {
        // Check whether the stock entered is valid and whether it already exists in the list
        if(!Helper.isStockValid(fieldVal)){
            window.alert('Ticker is not valid!')
        }else if(props.isPresent(fieldVal)){
            window.alert('This ticker is already on this list.')
        }else {
            props.setStockList(oldStocks => [...oldStocks, fieldVal])
            setFieldVal('')
        }
    }

    return (
        <Formik
            initialValues={{
                stock: '',
            }}

            onSubmit={(values, {setSubmitting, resetForm})=>{
                resetForm()
                setSubmitting(false)
                if(!props.isEmpty()){
                    props.setFinished(true)
                }else{
                    window.alert('No stocks have been selected so far.')
                }
            }}
        >
            {props => (
                <Form>
                    <CustomTextInput name='stock' label='Add Stock' value={fieldVal} onChange={(e)=>setFieldVal(e.target.value)}/>
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
    const [finished, setFinished] = useState(false)

    if(!user){
        return <LoggedOut />
    }

    const removeStock = (stock)=>{
        setStocks(stocks.filter(s=>s!==stock))
    }

    const isEmpty = () =>{
        return true ? stocks.length === 0 :false 
    }

    const isPresent = (stock) => {
        for(let i = 0; i < stocks.length; i++)
            if(stock === stocks[i]) return true
        return false
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
        setStocks([])
        setFinished(false)
        setTitle('')
    }

    return (
        <div className='row create-list-wrapper'>
            <div className='col-md-6 card shadow p-3 mb-5 rounded add-list-data'>
                <div className='card-body'>
                    <h1>Create a List</h1>
                    {!title && 
                        <AddTitle setTitle={setTitle}/>
                    }
                    {title && !finished &&  
                        <AddStocks isEmpty={isEmpty} setStockList={setStocks} setFinished={setFinished} isPresent={isPresent}/>
                    }
                    {finished && title && 
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
            </div>
            <div className='col-md-3 look-list-data'>
                <div className='card shadow p-3 mb-5 rounded'>
                    <div className='card-body'>
                        <table class='table'>
                            <thead>
                                <tr key='list-title' className='card-title'><td>Current List</td></tr>
                            </thead>
                            <tbody>
                                {stocks.length > 0 && stocks.map(stock=>{
                                    return (<tr key={stock}>
                                        <td className='row'>
                                            <div className='col-md-5'>{stock}</div>
                                            <div className='col-md-3'></div>
                                            <div className='col-md-2'></div>
                                            <button onClick={()=>removeStock(stock)} className='col-md-2 btn btn-danger btn-sm'> X </button>
                                        </td>
                                        </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateList