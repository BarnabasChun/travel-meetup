import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Qs from 'qs';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Meetups from './meetup-info';
import LandingPage from './landing-page';
import Restaurants from './restaurants';
import NotFound from './not-found';
import LoadingSpinner from './loading-spinner';

class App extends React.Component {
  constructor() {
    super();
    this.getMeetups = this.getMeetups.bind(this);
    this.getRestaurantRefs = this.getRestaurantRefs.bind(this);
    this.getRestaurantDetails = this.getRestaurantDetails.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      meetups: [],
      restaurants: [],
      loading: false,
    }
  }
  handleClick() {
    // on click of the return home button, reset the states to empty arrays
    this.setState({
      meetups: [],
      restaurants: [],
    })
  }
  getRestaurantRefs(lat, lon) {
    axios({
      method: 'GET',
      url: 'http://proxy.hackeryou.com',
      dataResponse: 'json',
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' })
      },
      params: {
        reqUrl: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        params: {
          key: 'AIzaSyDGfwsmW6wPeO-DzvircnZj0SDtp6enZ9o',
          type: 'restaurant',
          location: `${lat}, ${lon}`,
          radius: 1000,
        },
        proxyHeaders: {
          'header_params': 'value'
        },
        xmlToJSON: false
      }
    }).then(res => {
      const restaurantRefs = res.data.results.map(restaurant => restaurant.reference);
      this.getRestaurantDetails(restaurantRefs);
    });
  }
  getRestaurantDetails(restaurantRefs) {
    this.setState({
      loading: true
    })
    // this method will be called in the getRestaurantRefs function where the restaurantRefs information lives
    // therefore, make a placeholder for now
    // for each of the restaurant ids run an axios request
    // store each of these ajax requests in an array
    // use promise.all on this array of ajax requests 
    const restaurantDetails = restaurantRefs.map(restaurantRef => {
      return axios({
        method: 'GET',
        url: 'http://proxy.hackeryou.com',
        dataResponse: 'json',
        paramsSerializer: function (params) {
          return Qs.stringify(params, { arrayFormat: 'brackets' })
        },
        params: {
          reqUrl: `https://maps.googleapis.com/maps/api/place/details/json`,
          params: {
            key: 'AIzaSyDGfwsmW6wPeO-DzvircnZj0SDtp6enZ9o',
            reference: restaurantRef
          },
          xmlToJSON: false
        }
      });
    })
    Promise.all(restaurantDetails).then(res =>{
      const restaurants = res.map(res => res.data.result);
      this.setState({
        restaurants: restaurants,
        loading: false
      })
    })
  }
  getMeetups(lat, lon, category) {
    this.setState({
      loading: true
    })
    axios({
      method: 'GET',
      url: 'http://proxy.hackeryou.com',
      dataResponse: 'json',
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' })
      },
      params: {
        reqUrl: 'https://api.meetup.com/2/open_events',
        params: {
          key: '6a49717012332a5d284f3c775460653',
          lat: lat,
          lon: lon,
          category: category
        },
        proxyHeaders: {
          'header_params': 'value'
        },
        xmlToJSON: false
      }
    }).then(res => {
      const meetups = res.data.results.filter(meetup => meetup.venue !== undefined);
      this.setState({
        meetups: meetups,
        loading: false
      })
    });
  }
  render() {
    return (
      <Router>
        <div className="wrapper">
          <Switch>
            <Route
              exact path="/"
              render={props => <LandingPage {...props} formSubmit={this.getMeetups} meetups={this.state.meetups}/>}
            />
            {this.state.loading ? <LoadingSpinner /> : <Route
              exact path="/meetups"
              render={props => <Meetups {...props} data={this.state.meetups} onClick={this.getRestaurantRefs} reset={this.handleClick} />}
            />}
            {this.state.loading ? <LoadingSpinner /> : <Route
              exact path="/restaurants"
              render={props => <Restaurants {...props} data={this.state.restaurants} reset={this.handleClick} />}
            />}
            <Route render={() => <NotFound/>} />
          </Switch>
        </div>
      </Router>
    )
  }
}
ReactDOM.render(<App />, document.getElementById('app'));