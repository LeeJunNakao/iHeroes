import React from 'react'

export default (props)=>{
    return (
        <div className="heroes-tab-container">
            <div className="heroes-tab" onClick={(event) => props.callback(event, false)} data-active={'true'}>Cadastro dos Heróis</div>
            <div className="heroes-tab" onClick={(event) => props.callback(event, true)} data-active={'false'}>Registro de Atividade dos Heróis</div>
        </div>
    )
}