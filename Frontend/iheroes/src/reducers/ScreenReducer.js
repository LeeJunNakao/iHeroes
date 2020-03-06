const INITIAL_STATE={
    select: 'heroes'
}

export default (state=INITIAL_STATE, action)=>{
    switch(action.type){
        case 'SHOW_HEROES':
            return { select: 'heroes' }
        case 'SHOW_OCCURRENCES':
            return { select: 'occurrences' }
        default:
            return state
    }
}