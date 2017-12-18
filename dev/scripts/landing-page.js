import React from "react";
import axios from "axios";
import { Link, withRouter } from 'react-router-dom';
import Qs from 'qs';

class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryInput: 1,
            meetupCategories: [],
            locationInput: '',
            lat: 0,
            lon: 0,
        }
        this.handleChange = this.handleChange.bind(this);
        this.getLatLng = this.getLatLng.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    getLatLng(locality, administrativeArea, country) {
        axios({
            method: 'GET',
            url: 'https://proxy.hackeryou.com',
            dataResponse: 'json',
            paramsSerializer: function (params) {
                return Qs.stringify(params, { arrayFormat: 'brackets' })
            },
            params: {
                reqUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
                params: {
                    key: 'AIzaSyDGfwsmW6wPeO-DzvircnZj0SDtp6enZ9o',
                    components: `locality:${locality}|administrative_area:${administrativeArea}|country:${country}`,
                },
                proxyHeaders: {
                    'header_params': 'value'
                },
                xmlToJSON: false
            }
        }).then(res => {
            const latitude = res.data.results[0].geometry.location.lat;
            const longitude = res.data.results[0].geometry.location.lng;
            this.setState({
                lat: latitude,
                lon: longitude
            })
            this.props.formSubmit(this.state.lat, this.state.lon, this.state.categoryInput);
            this.props.history.push('/meetups');
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        const locationInput = this.state.locationInput.split(',').map(locationComponent => locationComponent.trim());
        let locality = "";
        let administrativeArea = "";
        let country = "";
        
        if (locationInput.length >= 1) {
            locality = locationInput[0];
        } 
        
        if (locationInput.length >= 2) {
            administrativeArea = locationInput[1];
        }
        
        if (locationInput.length >= 3) {
            country = locationInput[2];
        }
        
        this.getLatLng(locality, administrativeArea, country);
    }
    componentDidMount() {
        // initializing google autocomplete 
        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-90, -180),
            new google.maps.LatLng(90, 180));

        var input = document.getElementById('searchTextField');
        var options = {
            bounds: defaultBounds,
            types: ['(cities)'],
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);

        // when the user changes the place selected, an object 'place' is created and from that the latitude and longitude is taken
        google.maps.event.addListener(autocomplete, `place_changed`, () => {
            var place = autocomplete.getPlace();
            this.setState({
                locationInput: place.formatted_address
            }) 
        });

        // ajax request for meetup categories
        axios({
            method: 'GET',
            url: 'https://proxy.hackeryou.com',
            dataResponse: 'json',
            paramsSerializer: function (params) {
                return Qs.stringify(params, { arrayFormat: 'brackets' })
            },
            params: {
                reqUrl: 'https://api.meetup.com/2/categories',
                params: {
                    key: '6a49717012332a5d284f3c775460653',
                },
                proxyHeaders: {
                    'header_params': 'value'
                },
                xmlToJSON: false
            }
        }).then(res => {
            const meetupCategories = res.data.results;
            this.setState({
                meetupCategories
            })
        });
    }
    render() {
        return (
            <form action="" onSubmit={this.handleSubmit} className="landing-page fullPage">
                <header className="form__header">
                    <h1>Travel Meetup</h1>
                    <h2>Find upcoming meetups and nearby restaurants!</h2>
                </header>
                <div className="form__inputs flex-container">
                    <input 
                        id="searchTextField"
                        type="text"
                        size="50"
                        placeholder="Enter a City (e.g. Toronto, Canada)"
                        name="locationInput"
                        required
                        className="location-input"
                        onChange={this.handleChange}
                    />
                    <select name="categoryInput" onChange={this.handleChange} required>
                        {this.state.meetupCategories.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}
                    </select>
                    <button className="form__search-btn">Search</button>   
                </div>
            </form>
        )
    }
}

export default withRouter(LandingPage);