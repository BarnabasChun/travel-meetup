import React from 'react';
import { Link } from 'react-router-dom';
import ReturnHomeBtn from './return-home-btn';

const NotFound = () => {
    return(
        <div className="errPage fullPage">
            <h1>404 Page Not Found</h1>
            <h2>Oops you probably entered an incorrect link!</h2>
            <ReturnHomeBtn />
        </div>
    )
}

export default NotFound;