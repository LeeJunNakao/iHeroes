const INITIAL_STATE = {
    heroes: [],
    occurrences: [],
    heroesPage: 1,
    heroesLog: [],
    heroesLogPage: 1,
    occurrencesPage: 1
}

export default (state=INITIAL_STATE, action)=>{
    switch(action.type){
        case 'GET_HEROES_DATA':
            return { ...state, heroes: action.payload}
        case 'GET_OCCURRENCES_DATA':
            return { ...state, occurrences: action.payload }
        case 'CHANGE_HEROES_PAGE':
            return { ...state, heroesPage: action.payload}
        case 'CHANGE_OCCURRENCES_PAGE':
            return {...state, occurrencesPage: action.payload }
        case 'GET_HEROESLOG_DATA':
            return { ...state, heroesLog: action.payload }
        case 'GET_HEROESLOG_PAGE':
            return { ...state, heroesLogPage: action.payload }
        default:
            return state
    }
}