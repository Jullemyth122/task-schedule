import React from 'react'
import { Link } from 'react-router-dom'

const NavigationLoading = ({ }) => {

    return (
        <div className='navigator-comp'>
            <ul>
                <Link to={'/'}>
                    <h5> Loading... </h5>
                </Link>
                <Link to={'/signup'}>
                    <h5> Loading... </h5>
                </Link>
                <Link to={'/settings'}>
                    <h5> Loading... </h5>
                </Link>
                {/* <Link to={'/'}></Link> */}
            </ul>
        </div>
    )
}

export default NavigationLoading