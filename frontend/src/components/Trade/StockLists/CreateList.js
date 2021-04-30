import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {Formik, useField, Form} from 'formik'

import Helper from '../../../services/Helper'
import {useDispatch} from 'react-redux'

import tradeService from '../../../services/trade'

import LoggedOut from '../../Core/LoggedOut'
import {errorModal} from '../../../reducers/modalReducer'

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

const AddTitle = ({setTitle, dispatch})=>{

    return (

        <Formik
            initialValues={{
                title: '',
            }}

            onSubmit={async (values, {setSubmitting, resetForm})=>{
                resetForm()
                setSubmitting(false)
                if(await Helper.isTitleValid(values.title)){
                    setTitle(values.title)
                }else {
                    dispatch(errorModal('Title is invalid or another list with this name exists.'))
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

const AddStocks = ({dispatch, listAction})=>{

    const [fieldVal, setFieldVal] = useState('')

    const addStock = async () => {
        // Check whether the stock entered is valid and whether it already exists in the list
        if(!Helper.isStockValid(fieldVal)){
            dispatch(errorModal('Ticker is not valid!'))
        }else if(listAction({type:'IS_PRESENT', data: fieldVal})){
            dispatch(errorModal('This ticker is already on this list.'))
        }else {
            const iT = await Helper.getStockIssueType(fieldVal)
            listAction({type:'ADD_STOCK', data:{'ticker': fieldVal, 'issueType': iT}})
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
                if(!listAction({type:'IS_EMPTY'})){
                    listAction({type:'FINISHED', data: true})
                }else{
                    dispatch(errorModal('No stocks have been selected so far.'))
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
    const dispatch = useDispatch()
    const [title, setTitle] = useState()
    const [stocks, setStocks] = useState([])
    const [finished, setFinished] = useState(false)

    if(!user){
        return <LoggedOut />
    }

    const listAction = (action)=>{
        switch(action.type){
            case 'REMOVE_STOCK':
                removeStock(action.data)
                break;
            case 'ADD_STOCK':
                addStock(action.data)
                break;
            case 'IS_EMPTY':
                return isEmpty()
            case 'IS_PRESENT':
                return isPresent(action.data)
            case 'FINISHED':
                setFinished(action.data)
                break;
            default:
                return null
        }
    }

    const removeStock = (stock)=>{
        setStocks(stocks.filter(s=>s!==stock))
    }

    const addStock = (data)=>{
        setStocks(oldStocks=>[...oldStocks, data])
    }

    const isEmpty = () =>{
        return true ? stocks.length === 0 :false 
    }

    const isPresent = (ticker) => {
        for(let i = 0; i < stocks.length; i++)
            if(ticker === stocks[i].ticker) return true
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
                        <AddTitle setTitle={setTitle} dispatch={dispatch}/>
                    }
                    {title && !finished &&  
                        <AddStocks dispatch={dispatch} listAction={listAction}/>
                    }
                    {finished && title && 
                        <div className='card'>
                            <div className='card-body'>
                                <p className='card-title'>Title: {title}</p>
                                <label><b>Chosen stocks:</b></label>
                                <ul>
                                    {stocks.map(stock=>{
                                        return <li key={stock.ticker}>{stock.ticker}</li>
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
                        <table className='table'>
                            <thead>
                                <tr key='list-title' className='card-title'><td>Current List</td></tr>
                            </thead>
                            <tbody>
                                {stocks && stocks.map(stock=>{
                                    return (<tr key={stock.ticker}>
                                        <td className='row'>
                                            <div className='col-md-4'>{stock.ticker}</div>
                                            <div className='col-md-3' style={{fontSize:"0.8rem"}}>{Helper.formatIssueType(stock.issueType)}</div>
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