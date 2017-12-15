import React from 'react';
import { Link } from 'react-router-dom';

const ReturnHomeBtn = () => <button className="return-home-btn"><Link to="/">Return Home <i className="fa fa-home"></i></Link></button>;

export default ReturnHomeBtn;