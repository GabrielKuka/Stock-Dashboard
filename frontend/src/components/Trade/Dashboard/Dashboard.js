import React, {useState} from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import {useSelector} from 'react-redux'
import {useLocation} from 'react-router-dom'

import LoggedOut from '../../Core/LoggedOut'
import Side from './SideBar'

import Header from './Header'
import Overview from './Overview'
import Stats from './Stats'
import News from './News'
import Technicals from './Technicals'

import './dashboard.css'

const Dashboard = (props) => {
    
    const stonk = useLocation().param1
    
    const tickerView = useSelector(({trade})=>trade.tickerView)

    const [data, setData] = useState([])
    const [header, setHeader] = useState([])
    
    if(!props.user){
        return <LoggedOut />
    }

    function tickerData(tickerData, h=header){
        setHeader(h)
        setData(tickerData)
    }

    function handleViewRendering(){
            switch(tickerView){
                case 'Overview':
                    return <Overview data={data}/>
                case 'Stats':
                    return <Stats data={data} />
                case 'News':
                    return <News data={data}/> 
                case 'Technicals':
                    return <Technicals/> 
                default:
                    return <p>Nothing</p> 
            }
    }

    return (
        <Container fluid>
            <Row>
                <Col xs={4} id="sidebar-wrapper">      
                    <Side tickerData={tickerData} ticker={stonk}/>
                </Col>
                <Col  xs={8} id="page-content-wrapper">
                    <div className='card content-card'>
                        <h5 style={{textAlign: 'center'}}><b>{tickerView}</b></h5>
                        <div className='card-body'>
                            <Header header={header}  />
                            <hr />
                            <div className='card-text'>
                                {handleViewRendering()}
                            </div>
                        </div>
                    </div>
                </Col> 
            </Row>
        </Container>
    )
}

export default Dashboard
