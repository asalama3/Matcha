import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import whiteHeart from '../pictures/white_heart.png';
import photo from '../pictures/default.jpg';
import redHeart from '../pictures/red_heart.png';

class Suggestions extends React.Component {
  state={
    users: '',
    loggedUser: ''
  }

  componentDidMount = async () => {
    const checkAuth = await axios.get('http://localhost:8080/check_auth', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (checkAuth.data.status === false) {
      browserHistory.push('/');
    } else {
      this.setState({ loggedUser: checkAuth.data.data });
      axios({
        method: 'post',
        url: 'http://localhost:8080/suggestions',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      }).then(({ data }) => {
        if (data.status === true) {
          console.log('heyy', data.details);
          this.setState({ users: data.details });
        }
      });
    }
  }


  render() {
    let ListUsers = [];

    if (this.state.users) {
      ListUsers = this.state.users.map((src, key) => {
        let Like = '';
        if (src.interestedBy){(src.interestedBy.includes(this.state.loggedUser)) ? Like = 'liked' : Like = '';}
        let after = '#';
        let interests = src.hobbies;
        if (interests) {
          interests = src.hobbies.join(' #');
          interests = `${after}${interests}`;
        }
        return (
          <div key={key} className="display_users">
            <div className="displayUsername">Username: {src.username}</div>
            {(src.photo && src.photo.length > 0 &&
            <img onClick={() => this.viewUser(src.username)} role="presentation" className="image_profile" src={`http://localhost:8080/public/${src.username}/${src.photo[src.ProfilePictureNumber || 0].name}`}  />)
            || <img onClick={() => this.viewUser(src.username)} role="presentation" src={photo} className="image_profile" />}

            <div className="userInfoBis">
              <div className="DisplayPop">Popularity: {src.popularity} %</div>
              {(Like === 'liked' && <img role="presentation" className="alreadyLiked" src={redHeart} />)
              || (Like === '' && <img role="presentation" className="notLiked" src={whiteHeart} />)}
            </div>
            <div className="userInfo">
              <div className="userAge">Age: {src.age} </div>
              <div className="userDis">Distance: {src.distance} km</div>
            </div>
            {(src.hobbies && <div>{interests}</div>) || <div>No interests yet</div>}
          </div>
        );
      });
    }
    return (
      <div> {ListUsers} </div>
    )
  }
}

export default Suggestions;
