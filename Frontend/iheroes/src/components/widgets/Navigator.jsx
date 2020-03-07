import React from 'react';

import Navbar from 'react-bootstrap/Navbar'
import NavbarCollapse from 'react-bootstrap/NavbarCollapse'

export default (props)=>{
    return(
        <Navbar bg="light">
                    <div className="col-lg-2">
                        <a className="navbar-brand">iHeroes</a>
                    </div>

                    <NavbarCollapse>
                    <div className="col-lg-6">
                        <ul className="navbar-nav">

                            <li className='nav-item mr-auto'>
                                <a className="nav-link navigator-item" onClick={props.showHeroes}>Heróis</a>
                            </li>
                            <li className='nav-item mr-auto'>
                                <a className="nav-link navigator-item" onClick={props.showOccurrences}>Ocorrências</a>
                            </li>
                            <li className='nav-item mr-auto'>
                                <a className="nav-link navigator-item" onClick={props.logout}>Logout</a>
                            </li>
                        </ul>
                    </div>
                    </NavbarCollapse>

                    <div className="col-lg-4">
                    <div>{props.username}</div>
                    </div>
                </Navbar>
    )
}