import React, {useState, useEffect} from 'react'
import {Nav} from 'react-bootstrap'
import './dashboard.css'
import {Formik, useField, Form} from 'formik'
import tradeService from '../../../services/trade'
import {errorAlert} from '../../../reducers/alertReducer'
import {useDispatch} from 'react-redux'
import {changeTicker, changeTickerView} from '../../../reducers/tradeReducer'

const CustomTextInput = ({label, ...props}) => {
  const [field] = useField(props)
  return(
    <>
      {label}
      <input type='text' className='form-control' label={label}  {...field} {...props} />
    <br/>
    </>
  );
}

const Side = (props) => {
    const dispatch = useDispatch()

    const [currentView, setView] = useState('Overview')

    useEffect(()=>{
        if(typeof(props.ticker) !== 'undefined'){
            submitRequest({'ticker': props.ticker})
        }
    }, [])

    const submitRequest = async (values) => {

        try{
            // Store current ticker and tickerView
            dispatch(changeTickerView(currentView))
            dispatch(changeTicker(values.ticker))                                

            // Get Stonk data 
            const result = await tradeService.getTickerData(values.ticker, currentView)
            const header = await tradeService.getHeader(values.ticker)

            // send data to dashboard
            props.tickerData(result, header)
        }catch(exception){
            dispatch(errorAlert('Something went wrong!'))
            setTimeout(()=>dispatch(errorAlert('')), 3000)
        }
    }

    return (
        <Nav className="col-md-12 d-none d-md-block sidebar"
            >
                <Nav.Item >
                    <h3 className='sidebar-heading'>Pernet</h3>
                </Nav.Item>

                <Formik 
                    initialValues={{
                        ticker: typeof(props.ticker) !== 'undefined '? props.ticker : '',
                        view: 'Overview'
                    }}
                    onSubmit={async (values, {setSubmitting})=>{
                        setSubmitting(false)
                        submitRequest(values)
                    }}
                >
                    {props => (
                        <Form>
                            <CustomTextInput name='ticker' label='Ticker'/>
                            <span>View</span><br/>
                            <select onChange={(e)=>setView(e.target.value)} name='view' >
                                <option>Overview</option>
                                <option>Stats</option>
                                <option>News</option>
                                <option>Technicals</option>
                            </select><span> </span>
                            <button className='btn btn-primary' name='submit' type='submit'>{props.isSubmitting ? 'Loading':'Search'}</button>
                        </Form>
                    )}
                </Formik>

        </Nav>
    )
}

export default Side
