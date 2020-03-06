const INITIAL_STATE={
    createForm: true,
    heroeslogs: false,
}

export default (state=INITIAL_STATE, action)=>{
    switch(action.type){
        case 'CHANGE_CREATE_FORM_VIEW':
            return { ...state, createForm: action.payload}
        case 'SHOW_HERO_LOGS':
            return {...state, heroeslogs: action.payload}
        default:
            return state
    }
}