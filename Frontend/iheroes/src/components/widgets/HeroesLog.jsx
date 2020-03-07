import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'


import Table from 'react-bootstrap/Table'
import Pagination from '../widgets/Pagination'
import { getPaginationGroup, getOccurrenceStatus, convertDate,filterOccurrences } from '../../assets/js/Utils'
import { changeHeroesLogPage } from '../../actions/data'

class HeroesLog extends Component {
    constructor(props) {
        super(props)
        this.getPaginationGroup = getPaginationGroup.bind(this)
        
    }

    fillHeroesLogTable(){
        let data = getPaginationGroup(this.props.data.heroesLogPage,this.props.data.heroesLog)
        if(data.length>1){
            let content = data.map(item=>{
                let occurrence = this.props.data.occurrences.filter((reg)=>filterOccurrences(reg,item.occurrence))[0]
                return (
                <tr>
                    <td>{convertDate(item.date)}</td>
                    <td>{item.hero.name}</td>
                    <td>
                        <div className="badge badge-primary">ID: {occurrence._id} <span className="badge badge-danger">{occurrence.dangerLevel}</span> </div>
                        <div>{occurrence.monsterName} </div>
        
                    </td>
                    <td>{getOccurrenceStatus(item.avaible)}</td>
                </tr>
            )})
    
            return content
        }
    }

    render() {
        return (
            <div className="hero-table-container">
            <Table strip bordered hover>
                <thead>
                    <tr>
                        <th>Data de abertura</th>
                        <th>Herói</th>
                        <th>Ocorrência</th>
                        <th>Descrição</th>
                    </tr>
                </thead>
                <tbody>
                   {this.fillHeroesLogTable()}
                </tbody>
            </Table>

            <Pagination data={this.props.data.heroesLog} callback={this.props.changeHeroesLogPage} page='heroesLogPage' />
        </div>
        )
    }
}

const mapStateToProps = state=>({
    data: state.data
})

const mapDispatchToProps = dispatch =>bindActionCreators({ changeHeroesLogPage }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(HeroesLog);