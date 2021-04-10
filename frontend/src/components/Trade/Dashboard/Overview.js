import React from 'react'

const Overview = ({data})=>{
    return (
            <div className='container-fluid'>
                <div className='row' >
                    <div className='col-sm'>
                        <label><b>CEO</b></label>
                        <p>{data.CEO}</p>
                    </div>
                    <div className='col-sm'>
                        <label><b>Industry</b></label>
                        <p>{data.industry}</p>
                    </div>
                    <div className='col-sm'>
                        <label><b>Sector</b></label>
                        <p>{data.sector}</p>
                    </div>

                </div>
                <div className='row'>
                    <div className='col-sm'>
                        <label><b>Employees</b></label>
                        <p>{data.employees}
                        </p>
                    </div>
                    <div className='col-sm'>
                        <label><b>Address</b></label>
                        <p>{data.city} {data.state}, {data.country}</p>
                    </div>
                    <div className='col-sm'>
                        <label><b>Website</b></label>
                        <p>{data.website}</p>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm'>
                        <label><b>Description</b></label>
                        <p>{data.description}</p>
                    </div>
                </div>
            </div> 
    )
}

export default Overview
