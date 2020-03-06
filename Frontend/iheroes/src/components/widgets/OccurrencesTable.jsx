import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Table from 'react-bootstrap/Table'
import {translateState, getPaginationGroup, convertDate } from '../../assets/js/Utils'
import { changeOccurrencesPage } from '../../actions/data'
import Pagination from './Pagination'


class OccurrencesTable extends Component {
    constructor(props) {
        super(props);
    }

    fillOccurrencesTable(){
        let occurrences = this.props.data.occurrences
        occurrences = getPaginationGroup(this.props.data.occurrencesPage,this.props.data.occurrences )
        let data = occurrences.map(item=>(
            <tr>
                <td>{item._id}</td>
                <td>{convertDate(item.date)}</td>
                <td>{item.monsterName}</td>
                <td>{item.dangerLevel}</td>
                <td>
                    <div>{`latitude: ${item.location.lat}`}</div>
                    <div>{`longitude: ${item.location.lng}`}</div>     
                </td>
                <td>{translateState(item.state)}</td>
            </tr>
        ))

        return data
    }

    render() {
        return (
            <Table strip bordered hover>
                <thead>
                    <th>ID</th>
                    <th>Data</th>
                    <th>Ocorrência</th>
                    <th>Nível de Perigo</th>
                    <th>Localização</th>
                    <th>Situação</th>
                </thead>

                <tbody>
                    {this.fillOccurrencesTable()}
                </tbody>
                
                <Pagination data={this.props.data.occurrences} callback={this.props.changeOccurrencesPage}/>
            </Table>            
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    data: state.data
})
const mapDispatchToProps = dispatch => bindActionCreators({ changeOccurrencesPage}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OccurrencesTable);