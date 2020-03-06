const INITIAL_STATE = {
    authenticated: false,
    registerForm: false,
}

export default (state=INITIAL_STATE, action)=>{
    switch(action.type){
        case 'AUTHENTICATE':
            return { ...state, authenticated: action.payload }
        case 'GET_TOKEN':
            return { ...state, token: action.payload}
        case 'SHOW_REGISTER_FORM':
            return { ...state, registerForm: true }
        case 'SHOW_LOGIN_FORM':
            return { ...state, registerForm: false }
        default:
            return state
    }
}