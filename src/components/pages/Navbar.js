import React from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'

const Navbar = () => {
    return (
        <>
            <div className="navbar">
                <div className="navbar-container container">
                    <Link className="navbar-logo">
                        LAVISH
                    </Link>
                    <div className="menu-icon">

                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar
