import React, {useState, useRef, useEffect} from 'react'
import {Formik, Form, useField} from 'formik'
import { useParams } from 'react-router'
import {useHistory} from 'react-router-dom'

import Helper from '../../../services/Helper'
import tradeService from '../../../services/trade'

import LoggedOut from '../../Core/LoggedOut'
import TickerRow from './TickerRow'

import './style.css'

const CustomTextInput = ({label, ...props}) => {
  const [field, meta] = useField(props)
  return(
    <>
      {label} 
      <input type='text' label={label}  {...field} {...props} />

    {meta.touched && meta.error ? (
    <div className='error'>{meta.error}</div>
    ): null}
    </>
  );
}

const AddStocks = (props)=>{

    const formStyle = {
            marginLeft: '1.5rem'
    }

    return (
        <div className='card shadow p-2 mb-5 rounded'>
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
                            <CustomTextInput style={formStyle} name='stock' label='Add Stock'/>
                            <button type='submit' style={formStyle} className='btn btn-primary'>Add Stock</button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

const EditList = ({user})=>{

    const history = useHistory()

    const title = useParams().title
    const initialList = useRef()
    const [tickerList, setTickerList] = useState([])

    useEffect(()=>{
        const fetchData = async()=>{
           // Retrieve stock list data 
           const response = await tradeService.listAction('GET_LIST_DATA', title)
           setTickerList(response.stocks)
           initialList.current = response.stocks
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
        // Check if the list is the same
        if(initialList.current !== tickerList){
            const payload = {
                tickers: tickerList,
                title: title
            }
            const result = await tradeService.listAction('UPDATE', payload)
            console.log(result)
            history.push(`/stocklist/${title}`) 
        }

    }

    if(!user){
        return <LoggedOut />
    }

    return (
        <div className='container editlist-wrapper'>
            <AddStocks addStock={addStock} isPresent={isPresent}/>
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