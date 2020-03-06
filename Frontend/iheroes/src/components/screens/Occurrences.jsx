import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Container from 'react-bootstrap/Container'
import OccurrencesTable from '../widgets/OccurrencesTable'


class Occurrences extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container fluid={true}>
                <div className="occurrences-title">Registro das Ocorrências</div>
                <OccurrencesTable/>
            </Container>
            
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    screen: state.screen
})
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Occurrences);