import React, {Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import InputRange from 'react-input-range';
import '../css/search.css';
import '../node_modules/react-input-range/dist/react-input-range.css';
import searchDisplay from '../src/components/searchDisplay.js';
import image from '../pictures/drom.jpeg';

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
        })
        axios({
            method: 'post',
            url: 'http://localhost:8080/search',
        }).then(({data}) => {
            if (data.status === true)
            {
                console.log("ok search back", data.details);
                this.setState({users: data.details});
            }
        })
    }

    state = {
        valuesAge: {
        min: 18,
        max: 90,
        },
        valuesLocation: {
        min: 0,
        max: 1000,
        },
        valuesTags: {
        min: 0,
        max: 10,
        },
        valuesPop: {
        min: 0,
        max: 100,
        },
        users: '', // all users profiles
        newUsers: ''
    };


  handleValuesAgeChange = (component, values) => {
    this.setState({ valuesAge: values });
    console.log(this.state.valuesAge);
    }

  handleValuesLocationChange = (component, values) => {
    this.setState({ valuesLocation: values });
    console.log(this.state.valuesLocation);
    }

  handleValuesTagsChange = (component, values) => {
    this.setState({ valuesTags: values });
    console.log(this.state.valuesTags);
    }

  handleValuesPopChange = (component, values) => {
    this.setState({ valuesPop: values });
    console.log(this.state.valuesPop);
    }



    render(){
      let ListUsers = [];
      if (this.state.users)
      {
        console.log("ok");
    //    console.log(this.state.users[0].username);
     //   console.log(this.state.users[0].photo);
        ListUsers = this.state.users.map((src, key) =>
        <div key={key} className="display_users">
       {(src.photo && src.photo.length > 0 && 
           <img role="presentation" className="image_profile" src={`http://localhost:8080/public/${src.username}/${src.photo[0].name}`} />)
       || ((src.photo.length === 0) && <img role="presentation" src={'http://placehold.it/200x200'} />)}
          <div>firstname: {src.firstname} </div>
          <div>lastname: {src.lastname}</div>
          <div>Age: {src.age}</div>
          <div>location: {src.location.address} </div>
          <div>tags: {src.hobbies}</div>
        </div>
      );
      }
        return (
            <div className="container">
                <h1>Search</h1>
            <form className="form">
                <div className="formField">
                    <h4>Search By Age</h4>
                        <InputRange
                            maxValue={90}
                            minValue={18}
                            value={this.state.valuesAge}
                            onChange={this.handleValuesAgeChange.bind(this)}
                        />
                    <h4>Search By Location</h4>
                        <InputRange
                            maxValue={1000}
                            minValue={0}
                            value={this.state.valuesLocation}
                            onChange={this.handleValuesLocationChange.bind(this)}
                        />
                    <h4>Search By Tags</h4>
                        <InputRange
                            maxValue={10}
                            minValue={0}
                            value={this.state.valuesTags}
                            onChange={this.handleValuesTagsChange.bind(this)}
                        />
                    <h4>Search By Popularity</h4>
                        <InputRange
                            maxValue={100}
                            minValue={0}
                            value={this.state.valuesPop}
                            onChange={this.handleValuesPopChange.bind(this)}
                        />
                </div>
            </form>
            <div>
                {ListUsers}
            </div>
</div>
        )
    }
}

export default Search;
