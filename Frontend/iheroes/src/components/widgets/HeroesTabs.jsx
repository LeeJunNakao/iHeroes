import React, { Component } from 'react'
import { selectTab } from '../../assets/js/Utils'
import { showHeroLogs } from '../../actions/heroes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class HeroesTabs extends Component {
    constructor(props) {
        super(props)
        this.changeScreen = this.changeScreen.bind(this)
        this.showHeroLogs = this.props.showHeroLogs.bind(this)

    }

    changeScreen(event, show) {
        selectTab(event)
        this.showHeroLogs(show)
    }

    render() {
        return (
            <div className="heroes-tab-container">
                <div className="heroes-tab" onClick={(event) => this.changeScreen(event, false)} data-active={'true'}>Cadastro dos Heróis</div>
                <div className="heroes-tab" onClick={(event) => this.changeScreen(event, true)} data-active={'false'}>Registro de Atividade dos Heróis</div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    screen: state.screen
})
const mapDispatchToProps = dispatch => bindActionCreators({ showHeroLogs }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(HeroesTabs);