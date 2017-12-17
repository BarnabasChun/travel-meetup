import React from 'react';
import { Link } from 'react-router-dom';
import ReturnHomeBtn from './return-home-btn';

class Restaurants extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div className="restaurants">
                <ReturnHomeBtn />
                <button><Link to="/meetups">Back</Link></button>
                <ul className="restaurants__list flex-container">
                    {this.props.data.map(restaurant => {
                        return <li key={restaurant.id} className="restaurants__item">
                            <p><span>Address: </span>{restaurant.vicinity}</p>
                            <p><span>Phone Number: </span>{restaurant.international_phone_number}</p>
                            <p><span>Google Rating: </span>{restaurant.rating}/5</p>
                            <div className="restaurants__buttons">
                                <button><a href={restaurant.website}>Website</a></button>
                                <button><a href={restaurant.url}>Directions</a></button>
                            </div>
                        </li>
                    })}
                </ul>
            </div>
        )
    }
}

export default Restaurants;