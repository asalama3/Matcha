import React, { Component } from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import InputRange from 'react-input-range';
import '../css/search.css';
import '../node_modules/react-input-range/dist/react-input-range.css';
import Sort from '../src/components/sort';
import redHeart from '../pictures/red_heart.png';
import whiteHeart from '../pictures/white_heart.png';
import photo from '../pictures/default.jpg';

class Search extends Component {
  state={
    users: '',
    loggedUser: '',
    newUsers: '',
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
        url: 'http://localhost:8080/search',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      }).then(({ data }) => {
        if (data.status === true) {
          this.setState({ users: data.details, newUsers: data.details });
        }
      });
    }
  }

  state = {
    valuesAge: {
        min: 18,
        max: 95,
    },
    valuesLocation: {
        min: 0,
        max: 100000,
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
    loggedUser: '',
  };

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
    // console.log(this.state.loggedUser);
    const test = user.hobbies ? user.hobbies.filter(tag => this.state.loggedUser.hobbies.includes(tag)).length : 0;
    return test;
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
    if (response.data.status === true) {
      // console.log('ok view user');
      // browserHistory.push(`/matcha/profile/${username}`);
      browserHistory.push(`/matcha/profile/${username}`);
    }
  }

  handleTag = async (e) => {
    e.preventDefault();
    // console.log(e.target.tag.value);
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
    if (tags.data.status === true) {
      this.setState({ newUsers: tags.data.details });
      // console.log('details', tags.data.details);
    } else {
      // error occured - no one was found
    }
  }

  render() {
    let ListUsers = [];

    if (this.state.users) {
      ListUsers = this.state.newUsers.map((src, key) => {
        let Like = '';
        (src.interestedBy && src.interestedBy.includes(this.state.loggedUser)) ? Like = 'liked' : Like = '';
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
      <div className="container">
        <h1>Search</h1>
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
                maxValue={100000}
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
          <div>
            {ListUsers}
          </div>
      </div>
    );
  }
}

export default Search;
