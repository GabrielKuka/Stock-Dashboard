import React, {useState, useRef, useEffect} from 'react'
import {Formik, Form, useField} from 'formik'
import { useParams } from 'react-router'
import {useHistory} from 'react-router-dom'

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

const AddStocks = (props)=>{


    return (
        <div className='card shadow p-2 mb-5 rounded' style={contentStyle}>
            <div className='card-body'>
                <Formik 
                    initialValues={{
                        stock: ''
                    }}

                    onSubmit={(values, {setSubmitting, resetForm})=>{
                        resetForm()
                        setSubmitting(false)
                        // Add the stock here
                        if(!Helper.isStockValid(values.stock)){
                            window.alert(`${values.stock} is not a valid ticker.`)
                        }else if(props.isPresent(values.stock)){
                            window.alert(`Ticker ${values.stock} is already in the list.`)
                        }else {
                            props.addStock(values.stock) 
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

    const [title, setTitle] = useState(useParams().title)
    const listId = useRef()
    const [tickerList, setTickerList] = useState([])

    useEffect(()=>{
        const fetchData = async()=>{
           // Retrieve list data 
           const response = await tradeService.listAction('GET_LIST_DATA', title)
           setTickerList(response.stocks)
           listId.current = response.id
        }

        fetchData()
    }, [])

    const addStock = (stock)=>{
        setTickerList(prevState=>[...prevState, stock])
    }

    const removeStock = (stock)=>{
        setTickerList(tickerList.filter(t=>t!==stock))
    }

    const isPresent = (stock)=>{
        for(let i = 0; i < tickerList.length; i++){
            if(tickerList[i] === stock){
                return true
            }
        }

        return false
    }

    const finishEdit = async ()=>{
        // Check if title is valid
        if(!Helper.isTitleValid(title)){
            window.alert('Invalid title')
        }
        // Check if the list is empty
        if(Helper.isListEmpty(tickerList)){
            window.alert('List is empty.')
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

                <AddStocks addStock={addStock} isPresent={isPresent}/>
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
                    {tickerList.map(stonk=>{
                        return(
                            <TickerRow key={stonk} ticker={stonk} edit={true} handleDelete={removeStock}/>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default EditList