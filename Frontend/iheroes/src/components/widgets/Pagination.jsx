import Pagination from 'react-bootstrap/Pagination'
import React from 'react'
import { connect } from "react-redux";


function calculateNumberOfPages(data) {
    let lenght = data.length
    while (lenght % 10 != 0) lenght++
    let pages = lenght / 10
    if (pages < 1) {
        pages = 1
    }
    return pages;
}


function createPagination(props) {
    let pages = calculateNumberOfPages(props.data)
    const changePage = (incremental) => {
        if (props.database[props.page] + incremental > 0 && props.database[props.page] + incremental <= pages) {
            return props.database[props.page] + incremental
        } else {
            return props.database[props.page]
        }
    }

    return (
        <Pagination className="flex-div justify-content-center">

            <div onClick={() => props.callback(1)}>
                <Pagination.First />
            </div>

            <div onClick={() => props.callback(changePage(-1))}>
                <Pagination.Prev />
            </div>

            <div onClick={() => props.callback(props.database[props.page])}>
                <Pagination.Item>{props.database[props.page]}/{pages}</Pagination.Item>
            </div>

            <div onClick={() => props.callback(changePage(1))}>
                <Pagination.Next />
            </div>

            <div onClick={() => props.callback(pages)}>
                <Pagination.Last />
            </div>
        </Pagination>
    )

}

const mapStateToProps = state => ({
    database: state.data
})

export default connect(mapStateToProps)(createPagination)