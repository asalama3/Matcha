import React, { Component } from 'react';
import axios from 'axios';
import { browserHistory, Link } from 'react-router';
import InputRange from 'react-input-range';
import '../css/search.css';
import '../node_modules/react-input-range/dist/react-input-range.css';
import Sort from '../src/components/sort';

class Search extends Component {
  componentDidMount = async () => {
    const checkAuth = await axios.get('http://localhost:8080/check_auth', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (checkAuth.data.status === false) {
      browserHistory.push('/');
    } else {
      this.setState({ loggedUser: checkAuth.data.data.username });

      axios({
        method: 'post',
        url: 'http://localhost:8080/search',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      }).then(({ data }) => {
        console.log('hello');
        console.log(data.details);
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
      const { distance, age, popularity } = element;
      return (
          +distance <= +lMax && +distance >= +lMin &&
          +age <= +aMax && +age >= +aMin &&
          +popularity <= +pMax && +popularity >= +pMin
      );
  }

  filterUser = () => {
      const newUsers = this.state.users.filter(element => this.filters(element));
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

  updateSort = (sorted) => {
      this.setState({ users: sorted });
  }

  viewUser = async (username) => {
    const response = await axios ({
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
      console.log('ok view user');
    }
  }

  render() {
    let ListUsers = [];
    if (this.state.users) {
      ListUsers = this.state.newUsers.map((src, key) => {
        console.log(src.username);
        let Like = '';
        (src.interestedBy.includes(this.state.loggedUser)) ? Like = 'already liked' : Like = 'want to like?';
        return (
          <div key={key} className="display_users">
            {(src.photo && src.photo.length > 0 &&
            <img role="presentation" className="image_profile" src={`http://localhost:8080/public/${src.username}/${src.photo[src.ProfilePictureNumber || 0].name}`} />)
            || <img role="presentation" src={'http://placehold.it/200x200'} />}
            <div>username: {src.username}</div>
            <div>Age: {src.age}</div>
            <div>distance away from: {src.distance} km</div>
            <div>tags: {src.hobbies}</div>
            <div>Popularity: {src.popularity}</div>
            <div>{Like}</div>
            <div><Link to={`/matcha/profile/${src.username}`} onClick={() => this.viewUser(src.username)} >See Full Profile</Link></div>
          </div>
        );
      });
    }
    return (
      <div className="container">
        <h1>Search</h1>
          <form className="form">
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
            </div>
          </form>
          <div> <Sort onUpdate={this.updateSort} newUsers={this.state.newUsers} /> </div>
          <div>
            {ListUsers}
          </div>
      </div>
    );
  }
}

export default Search;
