import axios from 'axios'

function request(url,method,token,data=null){
    return new Promise((resolve,reject)=>{
        axios({
            method,
            url,
            headers: {
                'Content-Type': 'application/JSON',
                'accept':"*/*",
                token
            },
            data,
        }).then(resp=>{
            resolve(resp.data)
        })
        .catch(err=>reject(err))
    })
        
    
}

export default request;