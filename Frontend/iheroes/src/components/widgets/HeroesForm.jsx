import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getHeroData } from '../../actions/data'
import { getData, requestHeroesData,clearForm } from '../../assets/js/Utils'

import request from '../../assets/js/request'
import URL from '../../config/URL'
import { changeCreateFormView } from '../../actions/heroes'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


class HeroesForm extends Component{
    constructor(props){
        super(props)
        this.renderForm = this.renderForm.bind(this)
        this.submitEdit = this.submitEdit.bind(this)
        this.submitCreate = this.submitCreate.bind(this)
        this.requestHeroesData = requestHeroesData.bind(this)
        this.cancelEdit = this.cancelEdit.bind(this)
    }

    getInputFormValues(form) {
        let inputName = document.querySelector(`${form} .hero-inputbox input[name="name"]`)
        let inputClass = document.querySelector(`${form} .hero-inputbox input[name="class"]`)
        let inputId = document.querySelector(`${form} .hero-inputbox input[name="_id"]`)

        return { name: inputName.value, class: inputClass.value, id: inputId.value }
    }

    async submitCreate() {
        let data = this.getInputFormValues('#hero-add-form')
        data = { ...data, avaible: true }
        await request(`${URL.hero}`, 'post', this.props.auth.token, data)
        getData(this.requestHeroesData, this.props.getHeroData)
    }

    async submitEdit() {
        let data = this.getInputFormValues('#hero-edit-form')
        await request(`${URL.hero}/${data.id}`, 'put', this.props.auth.token, data)
        getData(this.requestHeroesData, this.props.getHeroData)
        this.props.changeCreateFormView(true)
    }

    generateForm(title, id, display = 'flex', callback) {
        let cancelButton = this.generateCancelButton()
        return (
            <div className="hero-form" id={id} style={{ display: display }}>
                <div className="hero-form-title">{title}</div>
                <div className="hero-inputbox">
                    <input type="text" name="_id" style={{ display: 'none' }} />
                    <Form.Control type="text" placeholder="Nome do herói" name="name" />
                    <Form.Control type="text" placeholder="Classe" name="class" />
                    <Button variant="primary" onClick={callback}> Salvar</Button>
                    {cancelButton}
                </div>
            </div>
        )
    }
    
    cancelEdit(event){
        clearForm(event)
        this.props.changeCreateFormView(true)
    }

    generateCancelButton(){
        if(!this.props.heroes.createForm){
            let button = (<Button variant="primary" onClick={this.cancelEdit}>Cancelar</Button>)
            return button
        }
    }
    
    renderForm(){
        if(this.props.heroes.createForm){
            let createForm = this.generateForm('Digite os dados do herói para adicionar', "hero-add-form", 'flex', this.submitCreate)
            return createForm
        }else{
            let editForm = this.generateForm('Digite os dados do herói para editar', "hero-edit-form", "flex", this.submitEdit)
            return editForm
        }
    }

    render(){
        let form = this.renderForm()
        return(
           <div>
               {form}
           </div>
        )
    }
} 

const mapStateToProps = state =>({
    data: state.data,
    heroes: state.heroes,
    auth: state.auth
})

const mapDispatchToProps = dispatch => bindActionCreators({ getHeroData,changeCreateFormView }, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(HeroesForm);