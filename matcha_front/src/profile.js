import React, { Component } from 'react';
import axios from 'axios';
// import Popup from 'react-popup';
import { browserHistory } from 'react-router';
import '../css/profile.css';
import Carousel from './components/Carousel';
import blockIcon from '../pictures/block.png';
import flag from '../pictures/flag.png';

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
    this.setState({ connectedUser: loggedUser.data });
    // search using username in params
    if (this.props.params.user) {
      // console.log(this.props.params.user);
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
        if (askedUser.interestedBy.includes(loggedUser.data.username)) {
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
    if (response.data.status === false && response.data.details === 'user blocked') {
      this.setState({ error: 'user blocked' });
    } else if (response.data.status === false && response.data.details === 'user not found' ) {
      this.setState({ error: 'no username found' });
    }
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


  report = () => {
    alert("This user has been reported");
  }

  block = async () => {
    console.log(this.state.user.username);
    const response = await axios({
      method: 'put',
      url: 'http://localhost:8080/block',
      data: {
        username: this.state.user.username,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (response.status === true) {
      console.log(response.data);
    }
  }

  render() {
    const {
      user,
      address,
      photo,
    } = this.state;

    let after = '#';
    let interests = user.hobbies;
    if (interests) {
      interests = user.hobbies.join(' #');
      interests = `${after}${interests}`;
    }

    const style = {
      clear: 'both'
    };

    return (
      <div>
        <div className="container">
          <div className="center">
          <h2>{user.firstname} {user.lastname}</h2>
          { this.props.params.user && this.state.user.username !== this.state.connectedUser.username &&
            <div className={this.state.className} onClick={this.like} ></div> } </div>
            <div style={style} ></div>
          <div> Status : {user.lastConnection} </div>
          <hr className="separation" />
          <h4> <i className="fa fa-trophy " aria-hidden="true"></i> Popularity: {user.popularity} % </h4>
          { this.props.params.user && this.state.user.username !== this.state.connectedUser.username &&
            <img role="presentation" src={blockIcon} className="aligned" onClick={() => {
              if (confirm('Block this user?') === true) {
                {this.block()};
              } else {
                alert('ok the user is not blocked');
              }
            }  } />}
          { this.props.params.user && this.state.user.username !== this.state.connectedUser.username &&
            <img role="presentation" src={flag} className="aligned" onClick={this.report}/>}
          { this.props.params.user && this.state.user.username !== this.state.connectedUser.username &&
            <div className="clear_float" ></div>}
              {this.state.photo && this.state.photo.length > 0  && <Carousel src={photo} username={user.username}/> ||
              <div className="addPic"> Please add at least one picture to complete your profile </div>}
              <ul className="list_profile">
                <li><i className="glyphicon glyphicon-user " /> {user.username} </li>
                <li><i className="fa fa-venus-mars " aria-hidden="true"></i> {user.gender} </li>
                <li><i className="fa fa-heart " aria-hidden="true"></i> {user.orientation} </li>
                <li><i className="fa fa-birthday-cake " aria-hidden="true"></i> {user.age} ans </li>
                <li><i className="fa fa-map-marker " aria-hidden="true"></i> {address} </li>
                <li><i className="fa fa-futbol-o " aria-hidden="true"></i> {interests} </li>
                <li><i className="fa fa-comment-o biography" aria-hidden="true"></i> <p> {user.bio} </p></li>
              </ul>
              <div> {this.state.error} </div>
              <div className="clear_float" ></div>
        </div>
      </div>
    );
  }
}

export default Profile;
