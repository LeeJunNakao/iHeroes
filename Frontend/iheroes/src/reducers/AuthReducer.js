const INITIAL_STATE = {
    authenticated: false,
    registerForm: false,
    username: ''
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'AUTHENTICATE':
            return { ...state, authenticated: action.payload }
        case 'LOGOUT':
            return { ...state, authenticated: false }
        case 'GET_TOKEN':
            return { ...state, token: action.payload }
        case 'SHOW_REGISTER_FORM':
            return { ...state, registerForm: true }
        case 'SHOW_LOGIN_FORM':
            return { ...state, registerForm: false }
        case 'GET_USERNAME':
            return {...state, username: action.payload}
        default:
            return state
    }
}