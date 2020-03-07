import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Table from 'react-bootstrap/Table'
import { translateState, getPaginationGroup, convertDate, filterHeroLogs } from '../../assets/js/Utils'
import { changeOccurrencesPage } from '../../actions/data'
import Pagination from './Pagination'


class OccurrencesTable extends Component {
    constructor(props) {
        super(props);
    }

    fillOccurrencesTable() {
        let occurrences = this.props.data.occurrences
        occurrences = getPaginationGroup(this.props.data.occurrencesPage, this.props.data.occurrences)
        if(occurrences.length){
            let data = occurrences.map(item =>{
                let log = this.props.data.heroesLog.filter((herolog)=>filterHeroLogs(herolog,item._id))[0]
                if(log==undefined){
                    log=''
                }else{
                    log = log.hero.name
                }
                return (
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
                    <td>{log}</td>
                </tr>
            )})
    
            return data
        }
    }

    render() {
        return (
            <div className="hero-table-container">

                <Table strip bordered hover>
                    <thead>
                        <th>ID</th>
                        <th>Data</th>
                        <th>Ocorrência</th>
                        <th>Nível de Perigo</th>
                        <th>Localização</th>
                        <th>Situação</th>
                        <th>Responsável</th>
                    </thead>

                    <tbody>
                        {this.fillOccurrencesTable()}
                    </tbody>

                </Table>
                <Pagination data={this.props.data.occurrences} callback={this.props.changeOccurrencesPage} page='occurrencesPage' />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    data: state.data
})
const mapDispatchToProps = dispatch => bindActionCreators({ changeOccurrencesPage }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OccurrencesTable);