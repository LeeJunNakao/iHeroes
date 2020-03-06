import { toastr } from 'react-redux-toastr'
import URL from '../../config/URL'
import request from '../../assets/js/request'


export function convertDate(date){
    let splitDate = date.split('T')
    let time = splitDate[1]
    time = time.split('.')
    splitDate = splitDate[0].split('-')
    return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]} - ${time[0]}`
}

export function getStatus(status){
    if(status){
        return 'Disponível'
    }else{
        return 'Indisponivel'
    }
}

export function getOccurrenceStatus(status){
    if(status){
        return 'Ocorrência finalizada'
    }else{
        return 'Atendimento iniciado'
    }
}

export function requestHeroesData(){
    return request(`${URL.hero}/?sort=-_id`,'get',this.props.auth.token)
}

export function requestOccurrencesData(){
    return request(`${URL.occurrence}/?sort=-date`,'get',this.props.auth.token)
}

export function requestHeroesLogData(){
    return request(`${URL.herolog}/?sort=-id`,'get',this.props.auth.token)
}

export async function getData(request, action){
    try{
        let response = await request()
        action(response)
    }catch(err){
        console.error(err)
        if(err.response.data.errors) err.response.data.errors.forEach(e=> toastr.error('Erro',e))
    }
}

export function selectTab(event){
    let tab = event.target
    let parent = tab.parentElement
    let tabs = [...parent.children]
    
    tabs.forEach(item=>{
        item.dataset.active = 'false'
    })
    
    tab.dataset.active=true
    
}

export function clearForm(event){
    let form = event.target.parentElement
    let inputs = [...form.children]
    inputs.forEach(input=>{
        if(input['name']){
            input.value = ''
        }
    })
}

export function getPaginationGroup(page,data) {
    let initial = ((page - 1) * 10);
    let final = initial + 9;
    let response = [];
    let length = data.length

    if (data.length >= 1) {
        for (let i = initial; i <= final && i < length; i++) {
            response.push(data[i])
        }
    }

    return response;
}

export function translateState(word){
    switch(word){
        case 'pending':
            return 'pendente'
        case 'done':
            return 'finalizado'
        case 'attending':
            return 'atendendo'
        default:
            return word
    }
}

