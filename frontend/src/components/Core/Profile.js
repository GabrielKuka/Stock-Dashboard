import React from 'react'

import LoggedOut from './LoggedOut'

import './style.css'

const Profile = ({user})=>{

    if(!user){
        return <LoggedOut/>
    }

    return(
        <div className='row profile-wrapper'>
            <div className='col-md-4'>
                <div className='card profile-data shadow p-3 mb-5'>
                    <div className='card-body'>
                        <h2 className='card-title'>{user.name}</h2>
                        <div>
                            {user.email}<br/>
                            PrLorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when 
                            an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                            It has survived not only five centuries, but also the leap into electronic typesetting, 
                            remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset 
                            sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus 
                            PageMaker including versions of Lorem Ipsum.ofile Data goes here
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-8'>
                <div className='card trades-watchlists shadow p-3 mb-5 rounded'>
                    <div className='card-body'>
                        <p className='card-title'>Trades</p>
                        <div>
                            It is a long established fact that a reader will be distracted by the readable content of a page 
                            when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal 
                            distribution of letters, as opposed to using 'Content here, content here', making it look like readable 
                            English. Many desktop publishing packages and 
                            web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' 
                            will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes 
                            by accident, sometimes on purpose (injected humour and the like).
                        </div>
                    </div>
                </div>
                <div className='card trades-watchlists shadow p-3 mb-5 rounded'>
                    <div className='card-body'>
                        <p className='card-title'>Watchlists</p>
                        <div>
                            Cras sodales purus nibh, sit amet euismod orci mollis vitae. Nullam fringilla elit 
                            ac venenatis ornare. Nulla ac euismod purus, sed finibus nisl. Nam lacinia tempor dolor, 
                            sed volutpat massa sodales et. Fusce vitae blandit leo, a mollis dui. Sed sem nisl, pharetra ut 
                            blandit at, ultricies iaculis velit. Donec ex sapien, pellentesque ut lectus sit amet, tincidunt 
                            dapibus leo.

                            Donec tincidunt auctor egestas. Suspendisse gravida metus eget nulla malesuada, in mattis 
                            mauris vehicula. Suspendisse malesuada diam odio, non pulvinar dui fringilla at. 
                            Cras ex sem, tempus et iaculis nec, aliquet ut ex. Donec augue augue, pellentesque id 
                            feugiat a, euismod ac lorem. Aenean congue, mauris sed ullamcorper mattis, justo nulla 
                            pulvinar sapien, non tristique ligula nisi non lacus. Quisque arcu lacus, congue vitae augue 
                            vitae, hendrerit tempor justo.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile