import React, {useState, useRef, useEffect} from 'react'
import {Formik, Form, useField} from 'formik'
import { useParams } from 'react-router'
import {useHistory} from 'react-router-dom'

import {errorModal} from '../../../reducers/modalReducer'
import {useDispatch} from 'react-redux'

import Helper from '../../../services/Helper'
import tradeService from '../../../services/trade'

import LoggedOut from '../../Core/LoggedOut'
import TickerRow from './TickerRow'

import './style.css'

const contentStyle = {
        marginLeft: '1.5rem'
}

const CustomTextInput = ({label, ...props}) => {
  const [field, meta] = useField(props)
  return(
    <>
      <b>{label}</b> 
      <input type='text' label={label}  {...field} {...props} />

    {meta.touched && meta.error ? (
    <div className='error'>{meta.error}</div>
    ): null}
    </>
  );
}

const AddStocks = ({dispatch, listAction})=>{


    return (
        <div className='card shadow p-2 mb-5 rounded' style={contentStyle}>
            <div className='card-body'>
                <Formik 
                    initialValues={{
                        stock: ''
                    }}

                    onSubmit={async (values, {setSubmitting, resetForm})=>{
                        resetForm()
                        setSubmitting(false)
                        const stock = values.stock
                        // Add the stock here
                        if(!Helper.isStockValid(stock)){
                            dispatch(errorModal(`Ticker ${stock} is not valid.`))
                        }else if(listAction({type:'IS_PRESENT', data:stock})){
                            dispatch(errorModal(`Ticker ${stock} is already in the list.`))
                        }else {
                            const iT = await Helper.getStockIssueType(stock)
                            listAction({type:'ADD_STOCK', data:{'ticker': stock, 'issueType':iT}})
                        }
                    }}
                >
                    {props=>(
                        <Form>
                            <CustomTextInput style={contentStyle} name='stock' label='Add Stock'/>
                            <button type='submit' style={contentStyle} className='btn btn-primary'>Add Stock</button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

const EditList = ({user})=>{

    const history = useHistory()
    const dispatch = useDispatch()

    const initialTitle = useParams().title
    const [title, setTitle] = useState(initialTitle)
    const listId = useRef()
    const [tickerList, setTickerList] = useState([])

    useEffect(()=>{
        const fetchData = async()=>{
           // Retrieve list data 
           const response = await tradeService.listAction('GET_LIST_DATA', title)
           console.log(response.stocks)
           setTickerList(response.stocks)
           listId.current = response.id
        }

        fetchData()
    }, [])

    const listAction = (action)=>{
        switch(action.type){
            case 'ADD_STOCK':
                addStock(action.data)
                break;
            case 'REMOVE_STOCK':
                removeStock(action.data)
                break;
            case 'IS_PRESENT':
                return isPresent(action.data)
            default:
                return null
        }
    }

    const addStock = (stock)=>{
        setTickerList(oldStocks=>[...oldStocks, stock])
    }

    const removeStock = (ticker)=>{
        setTickerList(tickerList.filter(t=>t.ticker!==ticker))
    }

    const isPresent = (ticker)=>{
        for(let i = 0; i < tickerList.length; i++){
            if(tickerList[i].ticker === ticker){
                return true
            }
        }

        return false
    }

    const finishEdit = async ()=>{
        // Check if title is valid
        if(initialTitle !== title && await Helper.isTitleValid(title) === false){
            dispatch(errorModal(`Title ${title} is invalid.`))
            return
        }
        // Check  if the list is empty
        if(Helper.isListEmpty(tickerList)){
            dispatch(errorModal('List is empty.'))
            return 
        }
        const payload = {
            id: listId.current, 
            tickers: tickerList,
            title: title
        }
        const result = await tradeService.listAction('UPDATE', payload)
        console.log(result)
        history.push(`/stocklist/${title}`) 

    }

    if(!user){
        return <LoggedOut />
    }

    return (
        <div className='container editlist-wrapper'>
            <div className='d-inline-flex'>
                <div className='card shadow p-2 mb-5'>
                    <div className='card-body'>
                        <label ><b>Change Title</b></label>
                        <input type='text' name='title' value={title} onChange={(e)=>setTitle(e.target.value)} style={contentStyle}/>
                    </div>
                </div>

                <AddStocks dispatch={dispatch} listAction={listAction}/>
            </div>
            <table className='table table-bordered table-sm '>
                <thead className='table-dark'>
                    <tr key='header'>
                        <td>Stock</td>
                        <td>Price</td>
                        <td>Change</td>
                        <td>
                            <button onClick={finishEdit} className='btn btn-success'>Finish Editing</button>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {tickerList && tickerList.map(stonk=>{
                        return(
                            <TickerRow key={stonk.ticker} ticker={stonk.ticker} edit={true} listAction={listAction}/>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default EditList