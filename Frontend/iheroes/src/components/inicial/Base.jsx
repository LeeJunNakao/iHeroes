import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { showOccurrences, showHeroes } from '../../actions/screen'
import { logout } from '../../actions/auth'
import Container from 'react-bootstrap/Container'
import Heroes from '../screens/Heroes'
import Occurrences from '../screens/Occurrences'
import Navigator from '../widgets/Navigator'

class Base extends Component {
    constructor(props) {
        super(props);    
        this.logout = this.logout.bind(this)
    }
    componentDidMount(){
        this.selectScreen()
        
    }

    selectScreen(){
        const components={ heroes: <Heroes/>, occurrences: <Occurrences/>}
        return components[this.props.screen.select]
    }

    logout(){
        this.props.logout()
        if(localStorage.getItem('iheroes')) localStorage.removeItem('iheroes')
    }

    render() {
        let screen = this.selectScreen()
        return (
            <Container fluid={true}>
                <Navigator showHeroes={this.props.showHeroes} showOccurrences={this.props.showOccurrences} logout={this.logout} username={this.props.auth.username}/>
                {screen}
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    screen: state.screen
})
const mapDispatchToProps = dispatch => bindActionCreators({ showOccurrences, showHeroes, logout}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Base);