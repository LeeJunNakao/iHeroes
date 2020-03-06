export function getHeroData(data){
    return { type: 'GET_HEROES_DATA', payload: data}
}

export function changeHeroesPage(page){
    return { type: 'CHANGE_HEROES_PAGE', payload: page}
}

export function getOccurrencesData(data){
    return {type: 'GET_OCCURRENCES_DATA', payload: data}
}

export function getHeroesLogData(data){
    return {type: 'GET_HEROESLOG_DATA', payload: data}
}

export function changeHeroesLogPage(page){
    return { type: 'GET_HEROESLOG_PAGE', payload: page}
}

export function changeOccurrencesPage(page){
    return { type: 'CHANGE_OCCURRENCES_PAGE', payload: page}
}