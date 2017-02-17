/* eslint-disable no-underscore-dangle  */
import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import InputRange from 'react-input-range';
import Sort from '../src/components/sort';
import '../node_modules/react-input-range/dist/react-input-range.css';
import whiteHeart from '../pictures/white_heart.png';
import photo from '../pictures/default.jpg';
import redHeart from '../pictures/red_heart.png';
import '../css/search.css';

class Suggestions extends React.Component {
  state={
    loggedUser: '',
    pending: false,
    valuesAge: {
        min: 18,
        max: 95,
    },
    valuesLocation: {
        min: 0,
        max: 50,
    },
    valuesTags: {
        min: 0,
        max: 10,
    },
    valuesPop: {
        min: 0,
        max: 100,
    },
    users: [], // all users profiles
    newUsers: [], // all users at first and then filtered
    like: '',
  }
  _mounted = false;

  componentWillUnMount() { this._mounted = false; }

  componentDidMount = async () => {
    this._mounted = true;
    const checkAuth = await axios.get('http://localhost:8080/check_auth', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (!this._mounted) return false;
    if (checkAuth.data.status === false) {
      browserHistory.push('/');
    } else {
      this.setState({ loggedUser: checkAuth.data.data });
      axios({
        method: 'post',
        url: 'http://localhost:8080/suggestions',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(({ data }) => {
        if (!this._mounted) return false;
        if (data.status === true) {
          this.setState({ users: data.details, newUsers: data.details, pending: true });
        }
      });
    }
  }

  filters = (element) => {
      const { min: aMin, max: aMax } = this.state.valuesAge;
      const { min: lMin, max: lMax } = this.state.valuesLocation;
      const { min: pMin, max: pMax } = this.state.valuesPop;
      const { min: tMin, max: tMax } = this.state.valuesTags;
      const commonTags = this.numberTags(element);
      const { distance, age, popularity } = element;
      return (
          +distance <= +lMax && +distance >= +lMin &&
          +age <= +aMax && +age >= +aMin &&
          +popularity <= +pMax && +popularity >= +pMin &&
          +commonTags <= +tMax && +commonTags >= +tMin // hobbies = array not int
      );
  }

  filterUser = () => {
      const newUsers = this.state.users.filter(user => this.filters(user));
      this.setState({ newUsers });
  }

  handleChangeAge = (component, values) => {
        this.setState({ valuesAge: values }, this.filterUser);
  }

  handleChangeLocation = (component, values) => {
        this.setState({ valuesLocation: values }, this.filterUser);
  }

  handleChangePop = (component, values) => {
    this.setState({ valuesPop: values }, this.filterUser);
  }

  handleChangeTags = (component, values) => {
    this.setState({ valuesTags: values }, this.filterUser);
  }

  updateSort = (sorted) => {
      this.setState({ users: sorted });
  }

  numberTags = (user) => {
    if (user.hobbies && this.state.loggedUser.hobbies) {
      const test = user.hobbies.filter(tag => this.state.loggedUser.hobbies.includes(tag)).length;
      return test;
    }
    return 0;
  }

  viewUser = async (username) => {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/view_user',
      data: {
        username,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (!this._mounted) return false;
    if (response.data.status === true) {
      // browserHistory.push(`/matcha/profile/${username}`);
      browserHistory.push(`/matcha/profile/${username}`);
    }
  }

  handleTag = async (e) => {
    e.preventDefault();
    const tags = await axios({
      method: 'post',
      url: 'http://localhost:8080/search_by_tag',
      data: {
        tag: e.target.tag.value,
        newUsers: this.state.users,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (!this._mounted) return false;
    if (tags.data.status === true) {
      this.setState({ newUsers: tags.data.details });
    } else {
      // error occured - no one was found
    }
  }

  render() {
    let ListUsers = [];

    if (this.state.pending && this.state.users) {
      ListUsers = this.state.newUsers.map((src, key) => {
        const Like = (src.interestedBy && src.interestedBy.includes(this.state.loggedUser.username)) ? 'liked' : '';
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
    } else {
      ListUsers = 'No suggestions yet';
    }

    return (
      <div>
        <h1 className="suggestion"> Suggestions of the day! </h1>
        <form className="formulaire">
          <div className="formField">
            <h5>Search By Age</h5>
            <InputRange
              maxValue={95}
              minValue={18}
              value={this.state.valuesAge}
              onChange={this.handleChangeAge.bind(this)}
            />
            <h5>Search By Location</h5>
            <InputRange
              maxValue={50}
              minValue={0}
              value={this.state.valuesLocation}
              onChange={this.handleChangeLocation.bind(this)}
            />
            <h5>Search By Popularity</h5>
            <InputRange
              maxValue={100}
              minValue={0}
              value={this.state.valuesPop}
              onChange={this.handleChangePop.bind(this)}
            />
            <h5>Search By Tags</h5>
            <InputRange
              maxValue={10}
              minValue={0}
              value={this.state.valuesTags}
              onChange={this.handleChangeTags.bind(this)}
            />
          </div>
        </form>
        <div> <Sort onUpdate={this.updateSort} newUsers={this.state.newUsers} loggedUser={this.state.loggedUser} /> </div>
        <div>
          <form className="formTag" onSubmit={this.handleTag}>
            <input className="searchTag" type="text" name="tag" placeholder="search profiles by tag" />
            <button type="submit">Submit </button>
          </form>
        </div>
        <div> {ListUsers} </div>
      </div>
    )
  }
}

export default Suggestions;
