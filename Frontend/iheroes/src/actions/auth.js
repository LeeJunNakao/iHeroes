export function authenticate(response){
    return { type: 'AUTHENTICATE', payload: response}
}

export function getToken(token){
    return { type: 'GET_TOKEN', payload: token}
}

export function showRegisterForm(){
    return { type: 'SHOW_REGISTER_FORM' }
}

export function showLoginForm(){
    return { type: 'SHOW_LOGIN_FORM' }
}

export function logout(){
    return { type: 'LOGOUT' }
}

export function getUsername(username){
    return { type: 'GET_USERNAME', payload: username }
}


