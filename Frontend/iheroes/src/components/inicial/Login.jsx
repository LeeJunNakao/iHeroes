import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toastr } from 'react-redux-toastr'

import { getToken, showLoginForm, showRegisterForm, authenticate} from '../../actions/auth'
import request from '../../assets/js/request'
import URL from '../../config/URL'
import If from '../widgets/If'

class Login extends Component{
    constructor(props){
        super(props);
        this.submit = this.submit.bind(this)
    }

    getData(){
        let json={}
        let form = document.getElementById('login-form')
        let children = [...form.children]
        children.forEach(input=>{
            if(input['name']){
                json[input.name]=input.value
                input.value = ''
            }
        })
        return json
    }

   async submit(url){
        let data = await this.getData()
        try{
            let response = await request(url,'post',null,data)
            if(response.token){
                await this.props.getToken(response.token)
                localStorage.setItem('iheroes',JSON.stringify(response))
            }

        }catch(err){
            if(err.response) err.response.data.errors.forEach(e=> toastr.error('Erro',e))
            console.error(err)
        }
        if(this.props.auth.token) this.props.authenticate(true)
    }

    render(){
        return (
            <div className="container-login">
                <div className="loginbox">
                    <div className="loginbox-title">iHeroes</div>
                    <div className="loginbox-inputbox">
                        <div id="login-form">
                            <If show={this.props.auth.registerForm} ><input type="string" placeholder="Digite seu nome" name="name" className="input"/></If>

                            <input type="email" placeholder="Digite seu email" className="input" name="email"/>

                            <input type="password" placeholder="Digite sua senha" className="input" name="password"/>

                            <If show={this.props.auth.registerForm} ><input type="password" placeholder="Digite novamente sua senha" name="confirm_password" className="input"/></If>

                            <If show={!this.props.auth.registerForm} ><input type="submit" value="Login" className="input" onClick={()=>{this.submit(URL.login)}}/></If>

                            <If show={this.props.auth.registerForm} ><input type="submit" value="Register" className="input" onClick={()=>{this.submit(URL.register)}}/></If>
                        </div>
                        <If show={!this.props.auth.registerForm}><a href='#' onClick={this.props.showRegisterForm}>Registrar</a> </If>
                        <If show={this.props.auth.registerForm}><a href='#' onClick={this.props.showLoginForm}>Fazer Login</a> </If>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state=>({
    auth: state.auth
})

const mapDispatchToProps = dispatch=> bindActionCreators({ getToken, showLoginForm,showRegisterForm, authenticate }, dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(Login)