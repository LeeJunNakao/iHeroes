import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getHeroData, changeHeroesPage } from '../../actions/data'
import { changeCreateFormView, showHeroLogs } from '../../actions/heroes'
import HeroesForm from '../widgets/HeroesForm'
import HeroesTable from '../widgets/HeroesTable'
import HeroesLog from '../widgets/HeroesLog'
import HeroesTabs from '../widgets/HeroesTabs'
import Container from 'react-bootstrap/Container'

class Heroes extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.showHeroLogs(false)
    }

    render() {
        return (
            <Container fluid={true} >
                <HeroesForm />
                <HeroesTabs/>
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