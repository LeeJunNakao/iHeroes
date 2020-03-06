import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { showOccurrences, showHeroes } from '../../actions/screen'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import NavbarCollapse from 'react-bootstrap/NavbarCollapse'
import Row from 'react-bootstrap/Row'
import Heroes from '../screens/Heroes'
import Occurrences from '../screens/Occurrences'

class Base extends Component {
    constructor(props) {
        super(props);    
    }
    componentDidMount(){
        this.selectScreen()
    }


    selectScreen(){
        const components={ heroes: <Heroes/>, occurrences: <Occurrences/>}
        return components[this.props.screen.select]
    }

    render() {
        let screen = this.selectScreen()
        return (
            <Container fluid={true}>
                <Navbar bg="light">
                    <div className="col-lg-2">
                        <a className="navbar-brand">iHeroes</a>
                    </div>

                    <NavbarCollapse>
                    <div className="col-lg-6">
                        <ul className="navbar-nav">
                            <li className='nav-item mr-auto'>
                                <a className="nav-link">Homepage</a>
                            </li>
                            <li className='nav-item mr-auto'>
                                <a className="nav-link" onClick={this.props.showHeroes}>Heróis</a>
                            </li>
                            <li className='nav-item mr-auto'>
                                <a className="nav-link" onClick={this.props.showOccurrences}>Ocorrências</a>
                            </li>
                        </ul>
                    </div>
                    </NavbarCollapse>

                    <div className="col-lg-4">
                        <div>Alex Lee Jun Nakao</div>
                    </div>
                </Navbar>

                {screen}
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    screen: state.screen
})
const mapDispatchToProps = dispatch => bindActionCreators({ showOccurrences, showHeroes}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Base);