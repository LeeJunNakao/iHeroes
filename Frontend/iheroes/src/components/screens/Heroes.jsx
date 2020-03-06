import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getHeroData, changeHeroesPage } from '../../actions/data'
import { requestHeroesData, selectTab } from '../../assets/js/Utils'
import { changeCreateFormView, showHeroLogs } from '../../actions/heroes'
import HeroesForm from '../widgets/HeroesForm'
import HeroesTable from '../widgets/HeroesTable'
import HeroesLog from '../widgets/HeroesLog'
import HeroesTabs from '../widgets/HeroesTabs'
import Container from 'react-bootstrap/Container'

class Heroes extends Component {
    constructor(props) {
        super(props);
        this.requestHeroesData = requestHeroesData.bind(this)
    }
    componentDidMount(){
        this.changeScreen = this.changeScreen.bind(this)
        this.showHeroLogs = this.props.showHeroLogs.bind(this)
    }

    changeScreen(event, show) {
        selectTab(event)
        this.showHeroLogs(show)
    }

    render() {
        return (
            <Container fluid={true} >

                <HeroesForm />
                <HeroesTabs callback={this.changeScreen}/>
                {this.props.heroes.heroeslogs ? <HeroesLog /> : <HeroesTable />}
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    screen: state.screen,
    data: state.data,
    heroes: state.heroes
})
const mapDispatchToProps = dispatch => bindActionCreators({ getHeroData, changeHeroesPage, changeCreateFormView, showHeroLogs }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Heroes);