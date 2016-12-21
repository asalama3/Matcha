import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory, Link } from 'react-router';
import InputRange from 'react-input-range';
import '../css/search.css';
import '../node_modules/react-input-range/dist/react-input-range.css';
import searchDisplay from '../src/components/searchDisplay.js';
import image from '../pictures/drom.jpeg';
import Sort from '../src/components/sort.js';
import '../css/search.css';


class Search extends Component {
    componentWillMount(){
        axios({
            method: 'post',
            url: 'http://localhost:8080/checklogin',
        }).then(({data}) => {
            if (data.status === false)
            {
                console.log("not logged in");
                browserHistory.push('/');
            }
            else{
                console.log('loggeduser:', data.data);
                this.setState({ loggedUser: data.data.username});
            }
        })
        axios({
            method: 'post',
            url: 'http://localhost:8080/search',
        }).then(({data}) => {
            if (data.status === true) {
                this.setState({users: data.details, newUsers: data.details});
            }
        })
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

    };


  filters = (element) => {
      const { min: aMin, max: aMax } = this.state.valuesAge
      const { min: lMin, max: lMax } = this.state.valuesLocation
      const { min: pMin, max: pMax } = this.state.valuesPop
      const { distance, age, pop } = element
      return (
          +distance <= +lMax && +distance >= +lMin &&
          +age <= +aMax && +age >= +aMin /*&&
          +pop <= +pMax && +pop >= +pMin*/
      )
  }

  filterUser = () => {
      const newUsers = this.state.users.filter( element => this.filters(element))
      this.setState({ newUsers })
  }

  handleChangeAge = (component, values) => {
        this.setState({ valuesAge: values }, this.filterUser)
  }

  handleChangeLocation = (component, values) => {
        this.setState({ valuesLocation: values }, this.filterUser)
  }

  handleChangePop = (component, values) => {
      this.setState({ valuesPop: values }, this.filterUser)
  }

  handleValuesTagsChange = (component, values) => {
    this.setState({ valuesTags: values });
  }

  updateSort = (sortedAge) => {
      this.setState({ users: sortedAge });
  }

    like = async (username, key, Like) => {
        console.log('username liked: ', this);
        // this.setState({ like: true });
        // for each user, set in db
        const response = await axios ({
            method: 'post',
            url: 'http://localhost:8080/like',
            data:{
              username: username,
            }
        })
        if (response.data.status === true && response.data.details === "user already liked by loggedUser")
        {
          Like = 'like';
          console.log(Like);
          // this.setState({ like: 'liked' });
          console.log("ok already liked");
        }
        else if (response.data.status === true && response.data.details === "user not liked yet by loggedUser")
        {
          Like = 'liked';
          // this.setState({ like: 'like' });
          console.log(Like);
          console.log("ok not liked yet");
        }

    }

    render(){
      let ListUsers = [];
    //   const label = this.state.like ? 'Liked' : 'Like';
      if (this.state.users) {
            ListUsers = this.state.newUsers.map((src, key) => {
                // console.log('src:', src);
                // console.log('key:', key);
                let Like = '';
                (src.interestedBy.includes(this.state.loggedUser)) ? Like = 'liked' : Like = 'like';
                return (
                    <div key={key} className="display_users">
                        {(src.photo && src.photo.length > 0 &&
                        <img role="presentation" className="image_profile" src={`http://localhost:8080/public/${src.username}/${src.photo[src.ProfilePictureNumber || 0].name}`} />)
                        || <img role="presentation" src={'http://placehold.it/200x200'} />}
                        <div>username: {src.username}</div>
                        <div>Age: {src.age}</div>
                        <div>distance away from: {src.distance} km</div>
                        <div>tags: {src.hobbies}</div>
                        <div><button value={Like} onClick={() => this.like(src.username, key, Like) }>{Like}</button></div>
                        <div><Link to ={'/matcha/profile/' + src.username} >See Full Profile</Link></div>
                    </div>
                )
            }
        )}
        return (
            <div className="container">
                <h1>Search</h1>
            <form className="form">
                <div className="formField">
                    <h4>Search By Age</h4>
                    <InputRange
                        maxValue={95}
                        minValue={18}
                        value={this.state.valuesAge}
                        onChange={this.handleChangeAge.bind(this)}
                    />
                    <h4>Search By Location</h4>
                    <InputRange
                        maxValue={100000}
                        minValue={0}
                        value={this.state.valuesLocation}
                        onChange={this.handleChangeLocation.bind(this)}
                    />
                    <h4>Search By Popularity</h4>
                    <InputRange
                        maxValue={100}
                        minValue={0}
                        value={this.state.valuesPop}
                        onChange={this.handleChangePop.bind(this)}
                    />
                    <h4>Search By Hobbies</h4>
                    <InputRange
                        maxValue={10}
                        minValue={0}
                        value={this.state.valuesTags}
                        onChange={this.handleValuesTagsChange.bind(this)}
                    />
                </div>
            </form>

            <div> <Sort onUpdate={this.updateSort} newUsers={this.state.newUsers} /> </div>
            <div>
                {ListUsers}
            </div>
</div>
        )
    }
}

export default Search;
