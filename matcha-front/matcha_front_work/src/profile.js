import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import '../css/profile.css';
import Carousel from './components/Carousel';

class Profile extends Component {

  state = {
    user: '',
    address: null,
    photo: [],
    pending: true,
    className:'animatedLike',
    likePending: false,
    erro: '',
    connectedUser: '',
  }

  componentDidMount = async() => {
    const checkAuth = await axios({
      method: 'post',
      url: 'http://localhost:8080/checklogin',
    })
    if (checkAuth.data.status === false) {
      return browserHistory.push('/');
    }
    let loggedUser = checkAuth.data;
    this.setState({connectedUser: loggedUser.data});

    // search using username in params
    if (this.props.params.user) {
      const getProfile = await axios({
        method: 'post',
        url: 'http://localhost:8080/searchLogin',
        data: {
          username: this.props.params.user,
        }
      })
      const askedUser = getProfile.data.data 
      if (getProfile.data.status === true) {
        // Deal if the user doesn't exist
        this.setState({ user: askedUser, photo: askedUser.photo });
        if (askedUser.interestedBy.includes(loggedUser.username)) {
          this.setState({ className: 'animatedLike animationLike' })
        }
      } else {
        console.log('user does not exist')
      }
    // If there is no params
    } else {
      this.setState({ user: loggedUser.data, photo: loggedUser.data.photo });
      if (loggedUser.location) {
        this.setState({address: loggedUser.location.address});
      }
    }
    // search using ME
     this.setState({pending: false});    
  }

  componentWillReceiveProps = async(newProps) => {
    this.setState({photo: []});
    console.log('yo' , newProps.params);
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/searchLogin',
      data: {
        username: newProps.params.user,
      }
    });
    this.setState({ user: response.data.data });
    console.log('username logged: ',response.data.loggedUser.username );
    if (response.data.data.interestedBy.includes(response.data.loggedUser.username)) {
      this.setState({ className: 'animatedLike animationLike' })
    }
    if (response.data.data.location !== null) {
      this.setState({ address: response.data.data.location.address });
    } else {
      this.setState({ address: '' });
    }
    if (response.data.data.photo.length > 0 ) {
      //  this.setState({ photo: response.data.data.photo });
      //  console.log("recieved : ", this.state.photo);
    } else {
      this.setState({ photo: [] });
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.state.likePending !== nextState.likePending) return false
  //   return true
  // }

  like = async () => {
    console.log(this.state.connectedUser.photo);
    if (this.state.connectedUser.photo.length === 0){
      return this.setState({error: 'add a picture to like'})
    }
    if (this.state.likePending) return false
    this.setState({ likePending: true })
    if (this.state.className === 'animatedLike animationLike') {
      this.setState({ className: 'animatedLike' });
    } else {
      this.setState({ className: 'animatedLike animationLike' });
    }
    const { data } = await axios ({
      method: 'post',
      url: 'http://localhost:8080/like',
      data:{
        username: this.state.user.username,
      }
    })
    console.log(data);
    if (data.status === false && data.details.includes('picture') ){
      this.setState({error: 'you need a picture to like' });
    }
    if (data.status === true && data.details.includes('disliked')) {
      // dislike
      this.setState({ className: 'animatedLike' });
    } else if (data.status === true) {
       // like
      this.setState({ className: 'animatedLike animationLike' });
    }
    this.setState({ likePending: false })
}

  render(){
    const {
      pending,
      user,
      address,
      className,
      photo,
    } = this.state;

    console.log(this.state.user);
    return (
      <div>
        <h1>PROFILE</h1>
      <div className="container">
          <div className="col-sm-12">
            <Carousel src={photo} username={user.username}/>
            <div className="col-sm-7 well margin-well my_profile">
              <p>
                <i className="glyphicon glyphicon-user" /> {user.firstname} {user.lastname}
                <br />
                <i className="glyphicon glyphicon-user" /> {user.username}
                <br />
                <i className="glyphicon glyphicon-envelope" /> {user.email}
                <br />
                <i className="fa fa-birthday-cake" aria-hidden="true"></i> {user.age}
                <br />
                <i className="fa fa-neuter" aria-hidden="true"></i> {user.gender}
                <br />
                <i className="fa fa-heart" aria-hidden="true"></i> {user.orientation}
                <br />
                <i className="fa fa-comment-o" aria-hidden="true"></i> {user.bio}
                <br />
                <i className="fa fa-trophy" aria-hidden="true"></i>  {user.hobbies}
                <br />
                <i className="fa fa-map-marker" aria-hidden="true"></i> {address}
                <br />              
                <i className="fa fa-hand-peace-o" aria-hidden="true"></i> Popularity: {user.popularity}
              </p>
                { this.props.params.user && this.state.user.username !== this.state.connectedUser.username && <div className={this.state.className} onClick={this.like} ></div> }
            </div>
            <div> {this.state.error} </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;