import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toastr } from 'react-redux-toastr'

import { getData, requestHeroesData, requestOccurrencesData, requestHeroesLogData } from '../../assets/js/Utils'
import URL from '../../config/URL'
import request from '../../assets/js/request'
import { authenticate, getToken, getUsername } from '../../actions/auth'
import { getHeroData,getOccurrencesData, getHeroesLogData } from '../../actions/data'
import Login from './Login'
import Base from './Base'

class Manager extends Component{
    constructor(props){
        super(props);
        this.requestHeroesData = requestHeroesData.bind(this)
        this.requestOccurrencesData = requestOccurrencesData.bind(this)
        this.requestHeroesLogData = requestHeroesLogData.bind(this)
        this.keepGetingData = this.keepGetingData.bind(this)
    }
    componentDidMount(){
      this.loadStates()
      this.keepGetingData()
    }

    verifyAuthentication(){
        return this.props.auth.authenticated ? <Base/> : <Login/>
    }

    keepGetingData(){
        setInterval(()=>{
            this.loadStates()
        },30000)
    }

    async loadStates(){
        try{
            await this.verifyLocalStorage()
            await this.validateToken()
            if(this.props.auth.authenticated){
                await getData(this.requestHeroesData,this.props.getHeroData)
                await getData(this.requestOccurrencesData,this.props.getOccurrencesData)
                await getData(this.requestHeroesLogData, this.props.getHeroesLogData)
            }
        }catch(err){
            console.error(err)
            if(err.response) err.response.data.errors.forEach(e=> toastr.error('Erro',e))
        }

    }

    verifyLocalStorage(){
        if(localStorage.getItem('iheroes')){
            let data = localStorage.getItem('iheroes')
            data = JSON.parse(data)
            this.props.getToken(data.token)
            this.props.getUsername(data.name)
        }
    }

    removeStorage(){
        localStorage.removeItem('iheroes')
    }

    async validateToken(){
        let response = false
        try{
            response = await request(URL.validateToken,'post',this.props.auth.token)
            this.props.authenticate(response.valid)
        }catch(e){
            console.error(e)
        }
        if(!response && localStorage.getItem('iheroes')){
            localStorage.removeItem('iheroes')
            this.props.getToken(null)
        } 
    }



    render(){
        let authenticated = this.verifyAuthentication()
        return (
            <div className='container-fluid'>
                {authenticated}
            </div>
        )
    }
}

const mapStateToProps = state=>({
    auth: state.auth
})
const mapDispatchToProps = dispatch => bindActionCreators({ authenticate, getToken, getHeroData, getOccurrencesData, getHeroesLogData, getUsername }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Manager);