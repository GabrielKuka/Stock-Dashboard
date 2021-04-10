import React from 'react'

const Header = (props) => {
    return (
            <div className='card-title'>
                <img id='logo' alt='Logo' src={props.header.logo} />
                <span className='company-name'>{props.header.name}</span>
            </div>
    )
}

export default Header
