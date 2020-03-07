import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import editIcon from '../../assets/images/edit.svg'
import deleteIcon from '../../assets/images/delete.png'

import request from '../../assets/js/request'
import URL from '../../config/URL'
import { getHeroData, changeHeroesPage } from '../../actions/data'
import { getStatus, getData, requestHeroesData } from '../../assets/js/Utils'
import { changeCreateFormView, showHeroLogs } from '../../actions/heroes'
import Table from 'react-bootstrap/Table'
import Pagination from './Pagination'


class HeroesTable extends Component {
    constructor(props) {
        super(props)
        this.initEdit = this.initEdit.bind(this)
        this.getPaginationGroup = this.getPaginationGroup.bind(this)
        this.fillHeroesTable = this.fillHeroesTable.bind(this)
        this.delete = this.delete.bind(this)
        this.requestHeroesData = requestHeroesData.bind(this)
    }

    async delete(id) {
        await request(`${URL.hero}/${id}`, 'delete', this.props.auth.token)
        getData(this.requestHeroesData, this.props.getHeroData) 
    }

    getPaginationGroup() {
        let page = this.props.data.heroesPage
        let initial = ((page - 1) * 10);
        let final = initial + 9;
        let data = [];
        let length = this.props.data.heroes.length
        console.log(this.props.data.heroes)

        if (this.props.data.heroes.length >= 1) {
            for (let i = initial; i <= final && i < length; i++) {
                data.push(this.props.data.heroes[i])
            }
        }
        return data;

    }

    async initEdit(id) {
        let row = document.querySelector(`tr[data-id="${id}"]`)
        await this.props.changeCreateFormView(false)
        this.fillEditForm(row, id)
    }

    fillEditForm(row, id) {
        let inputName = document.querySelector('#hero-edit-form .hero-inputbox input[name="name"]')
        let inputClass = document.querySelector('#hero-edit-form .hero-inputbox input[name="class"]')
        let inputId = document.querySelector('#hero-edit-form .hero-inputbox input[name="_id"]')
        inputName.value = row.dataset.name
        inputClass.value = row.dataset.class
        inputId.value = id
    }

    fillHeroesTable() {
        let data = this.getPaginationGroup()
        let content = data.map(item => (
            <tr data-id={item._id} data-name={item.name} data-class={item.class}>
                <td>{item._id}</td>
                <td data-input='name' >{item.name}</td>
                <td data-input='class'>{item.class}</td>
                <td>{getStatus(item.avaible)}</td>
                <td className="flex-div">
                    <div><a><img className='action-icon' src={editIcon} onClick={() => this.initEdit(item._id)} /></a></div>
                    <div><a><img className='action-icon' src={deleteIcon} onClick={() => this.delete(item._id)} /></a></div>
                </td>
            </tr>
        ))

        return content
    }

    


    render() {
        let heroesList = this.fillHeroesTable()
        return(
            <div className="hero-table-container">
            <Table strip bordered hover>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Nome</th>
                        <th>Classe</th>
                        <th>Disponivel</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {heroesList}
                </tbody>
            </Table>
            <Pagination data={this.props.data.heroes} callback={this.props.changeHeroesPage} page='heroesPage'/>
        </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    screen: state.screen,
    data: state.data
})
const mapDispatchToProps = dispatch => bindActionCreators({ getHeroData, changeHeroesPage, changeCreateFormView, showHeroLogs, requestHeroesData }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(HeroesTable);