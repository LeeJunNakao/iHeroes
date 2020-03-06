import Pagination from 'react-bootstrap/Pagination'
import React from 'react'

function calculateNumberOfPages(data){
   
    let lenght = data.length

    while(lenght%10!=0) lenght++

    let pages = lenght/10

    if(pages<1){
        pages = 1
    }

    return pages;
}


export default function createPagination(props){
    let pages = calculateNumberOfPages(props.data)
    let paginationItem=[];

    if(pages==1){
        return (
            <Pagination className="flex-div justify-content-center">
                <Pagination.Item>{1}</Pagination.Item>
            </Pagination>
        )
    }else if(pages>1 && pages<=10){
        for(let i=1;i<=pages;i++){
            paginationItem.push(
            <div onClick={()=>props.callback(i)}>
                <Pagination.Item >{i}</Pagination.Item>
            </div>)
        }
        return(
            <Pagination className="flex-div justify-content-center">
                <Pagination.Prev />
                    {paginationItem}
                <Pagination.Next />
            </Pagination>
        )

    }else if(pages>10){
        let middle = parseInt(pages/2)

        for(let i=middle-1; i<=middle+1; i++){
            paginationItem.push(
            <div onClick={()=>props.callback(i)}>
                <Pagination.Item >{i}</Pagination.Item>
            </div>)
        }

        return(
            <Pagination className="flex-div justify-content-center">
                <Pagination.Prev />
                <div onClick={()=>props.callback(1)}>
                    <Pagination.Item>{1}</Pagination.Item>
                </div>
                
                <Pagination.Ellipsis />

                    {paginationItem}

                <Pagination.Ellipsis />
                <div onClick={()=>props.callback(pages)}>
                    <Pagination.Item>{pages}</Pagination.Item>
                </div>
                
                <Pagination.Next />
            </Pagination>
        )
    }
}