import React, { Component } from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import '../css/profile.css';
import Carousel from './components/Carousel';
import block from '../pictures/block.png';
import fake from '../pictures/fake.jpg';

class Profile extends Component {

  state = {
    user: '',
    address: '',
    photo: [],
    pending: true,
    className: 'animatedLike',
    likePending: false,
    error: '',
    connectedUser: '',
  }

  componentDidMount = async () => {
    const checkAuth = await axios.get('http://localhost:8080/my_profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (checkAuth.data.status === false) {
      return browserHistory.push('/');
    }
    const loggedUser = checkAuth.data;
    console.log('dfff', loggedUser);
    this.setState({ connectedUser: loggedUser.data });

    // search using username in params
    if (this.props.params.user) {
      const getProfile = await axios({
        method: 'post',
        url: 'http://localhost:8080/searchLogin',
        data: {
          username: this.props.params.user,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      const askedUser = getProfile.data.data;
      if (getProfile.data.status === true) {
        // Deal if the user doesn't exist
        this.setState({ user: askedUser, photo: askedUser.photo, address: askedUser.location.address });
        if (askedUser.interestedBy.includes(loggedUser.username)) {
          this.setState({ className: 'animatedLike animationLike' });
        }
      } else {
        console.log('user does not exist');
      }
    // If there are no params
    } else {
      this.setState({ user: loggedUser.data, photo: loggedUser.data.photo });
      if (loggedUser.data.location.address) {
        this.setState({ address: loggedUser.data.location.address });
      }
    }
    // search using ME
     this.setState({ pending: false });
  }

  componentWillReceiveProps = async (newProps) => {
    this.setState({ photo: [] });
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/searchLogin',
      data: {
        username: newProps.params.user,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    this.setState({ user: response.data.data });
    if (response.data.data.interestedBy.includes(response.data.loggedUser.username)) {
      this.setState({ className: 'animatedLike animationLike' });
    }
    if (response.data.data.location !== null) {
      this.setState({ address: response.data.data.location.address });
    } else {
      this.setState({ address: '' });
    }
    if (response.data.data.photo.length > 0) {
       this.setState({ photo: response.data.data.photo });
    } else {
      this.setState({ photo: [] });
    }
  }

  like = async () => {
    if (this.state.connectedUser.photo.length === 0) {
      return this.setState({ error: 'add a picture to like' });
    }
    if (this.state.likePending) return false;
    this.setState({ likePending: true });
    if (this.state.className === 'animatedLike animationLike') {
      this.setState({ className: 'animatedLike' });
    } else {
      this.setState({ className: 'animatedLike animationLike' });
    }
    const { data } = await axios({
      method: 'post',
      url: 'http://localhost:8080/like',
      data: {
        username: this.state.user.username,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (data.status === false && data.details.includes('picture')) {
      this.setState({ error: 'you need a picture to like' });
    }
    if (data.status === true && data.details.includes('disliked')) {
      // dislike
      this.setState({ className: 'animatedLike' });
    } else if (data.status === true) {
       // like
      this.setState({ className: 'animatedLike animationLike' });
    }
    this.setState({ likePending: false });
  }

  render() {
    const {
      user,
      address,
      photo,
    } = this.state;

    let test = user.hobbies;
    if (test) {
      test = user.hobbies.join(' ');
    }
    return (
      <div>
        <div className="container">
          <h2>{user.firstname} {user.lastname}</h2>
          <hr className="separation" />
          <h4> <i className="fa fa-trophy " aria-hidden="true"></i> Popularity: {user.popularity} % </h4>
          { this.props.params.user && this.state.user.username !== this.state.connectedUser.username &&
            <div className="aligned">Like</div>}
          { this.props.params.user && this.state.user.username !== this.state.connectedUser.username &&
            <div className={this.state.className} onClick={this.like} ></div> }
          { this.props.params.user && this.state.user.username !== this.state.connectedUser.username &&
            <div className="aligned">Block</div> }
          { this.props.params.user && this.state.user.username !== this.state.connectedUser.username &&
            <div className="block"> <img role='presentation' className="block_img" src={block}/></div>}
          { this.props.params.user && this.state.user.username !== this.state.connectedUser.username &&
            <div className="aligned">Report</div>}
          { this.props.params.user && this.state.user.username !== this.state.connectedUser.username &&
            <div className="report"> <img role='presentation' className="report_img" src={fake}/></div>}
          { this.props.params.user && this.state.user.username !== this.state.connectedUser.username &&
            <div className="clear_float" ></div>}
              <Carousel src={photo} username={user.username}/>
              <ul className="list_profile">
                <li><i className="glyphicon glyphicon-user " /> {user.username} </li>
                <li><i className="fa fa-venus-mars " aria-hidden="true"></i> {user.gender} </li>
                <li><i className="fa fa-heart " aria-hidden="true"></i> {user.orientation} </li>
                <li><i className="fa fa-birthday-cake " aria-hidden="true"></i> {user.age} ans </li>
                <li><i className="fa fa-map-marker " aria-hidden="true"></i> {address} </li>
                <li><i className="fa fa-futbol-o " aria-hidden="true"></i> {test} </li>
                <li><i className="fa fa-comment-o biography" aria-hidden="true"></i> {user.bio} </li>
              </ul>
              <div> {this.state.error} </div>
              <div className="clear_float" ></div>
        </div>
      </div>
    );
  }
}

export default Profile;
