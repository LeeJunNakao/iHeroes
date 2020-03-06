export default (id,callback)=>{
    let form = document.querySelector(id);
    form.addEventListener('submit',(event)=>{
        event.preventDefault();

        let json={};
        let children = [...form.children];

        children.forEach(input=>{
            if(input['name']) json[input.name]=input.value
        })

        callback(json)
    })
    
}