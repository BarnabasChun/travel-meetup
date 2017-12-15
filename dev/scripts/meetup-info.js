import React from 'react';
import { Link } from 'react-router-dom';
import ReturnHomeBtn from './return-home-btn';

export default class Meetups extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <ReturnHomeBtn />
        <ul>
          {this.props.data.map(meetup => {
            return <li key={meetup.id}>
              <h2>{meetup.name}</h2>
              <p>{meetup.venue.name}, {meetup.venue.address_1}</p>
              <p><span>Meetup Time: </span>{getTime(meetup.time)}</p>
              <p><span>Meetup Date: </span>{getDate(meetup.time)}</p>
              <button><a href={meetup.event_url}>Event Info</a></button>
              <button
                onClick={() => this.props.onClick(meetup.venue.lat, meetup.venue.lon)}>
                <Link to="/restaurants">Find Restaurants</Link>
              </button>
            </li>
          })}
        </ul>
      </div>
    )
  }
}

const getTime = (millsecondsTime) => new Date(millsecondsTime).toTimeString().slice(0, 5);
const getDate = (millsecondsTime) => new Date(millsecondsTime).toLocaleDateString();