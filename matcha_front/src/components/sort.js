import React, {Component} from 'react';
import '../../css/sort.css';

class Sort extends Component{

    componentDidMount(){
        // this.props = this.state.users;
        this.setState({ users: this.props });
        // this.setState({loggedUser: this.props.loggedUser });
    }

    state = {
        users: [],
        loggedUser: '',
        sortAgeOnce: false,
        sortLocationOnce: false,
        sortPopularityOnce: false,
        sortTagOnce: false,
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({ users: newProps.newUsers });
        this.setState({ loggedUser: newProps.loggedUser });
    }

    sortAge = (e) => {
        console.log("sort age");
        if (this.state.sortAgeOnce === false){
            this.setState({ sortAgeOnce: true  });
            console.log(this.state.users);
            const sortUsers = this.state.users.sort((a, b) => {
                return (a.age - b.age);
            });
            this.setState({ users: sortUsers });
            this.props.onUpdate(sortUsers);
            console.log(this.state.sortAgeOnce);
        }
        else{
            this.setState({ sortAgeOnce: false  });
            const sortUsers = this.state.users.sort((a, b) => {
                return (b.age - a.age);
            });
            this.setState({ users: sortUsers });
            this.props.onUpdate(sortUsers);
            console.log(this.state.sortAgeOnce);
        }
    }

    sortLocation = (e) => {
        console.log("sort location");
        if (this.state.sortLocationOnce === false){
            this.setState({sortLocationOnce: true});
            const sortUsers = this.state.users.sort((a, b) => {
                return (a.distance - b.distance);
            });
            this.setState({ users: sortUsers });
            this.props.onUpdate(sortUsers);
        }
        else{
            this.setState({ sortLocationOnce: false });
            const sortUsers = this.state.users.sort((a,b) =>{
                return (b.distance - a.distance);
            });
            this.setState({ users: sortUsers });
            this.props.onUpdate(sortUsers);
        }
    }

    sortPopularity = (e) => {
      console.log("sort pop");
      if (this.state.sortPopularityOnce === false) {
        this.setState({ sortPopularityOnce: true });
        const sortUsers = this.state.users.sort((a, b) => {
          return (a.popularity - b.popularity);
        });
        this.setState({ users: sortUsers });
        this.props.onUpdate(sortUsers);
      }else{
        this.setState({ sortPopularityOnce: false });
        const sortUsers = this.state.users.sort((a, b) => {
          return (b.popularity - a.popularity);
        });
        this.setState({ users: sortUsers });
        this.props.onUpdate(sortUsers);
      }
    }

    sortTags = (e) => {
      if (this.state.sortTagOnce === false) {
        this.setState({ sortTagOnce: true });
        if (this.state.loggedUser.hobbies) {
          this.state.users.map((src) => {
            return src.commonTags = src.hobbies ? src.hobbies.filter(tag => this.state.loggedUser.hobbies.includes(tag)).length: 0;
          });
        }
        const sortUsers = this.state.users.sort((a, b) => {
          return (b.commonTags - a.commonTags);
        });
        this.setState({ users: sortUsers });
        this.props.onUpdate(sortUsers);
      } else {
        this.setState({ sortTagOnce: false });
        if (this.state.loggedUser.hobbies) {
          this.state.users.map((src) => {
            return src.commonTags = src.hobbies ? src.hobbies.filter(tag => this.state.loggedUser.hobbies.includes(tag)).length: 0;
          });
        }
        const sortUsers = this.state.users.sort((a, b) => {
          return (a.commonTags - b.commonTags);
        });
        this.setState({ users: sortUsers });
        this.props.onUpdate(sortUsers);
      }
    }


    render() {
        // console.log(this.props, "1111");
        return(
            <div className="sort">
                <button type="button" onClick={this.sortAge} className="sort_button">Sort by Age </button>
                <button type="button" onClick={this.sortLocation} className="sort_button">Sort by Location </button>
                <button type="button" onClick={this.sortPopularity} className="sort_button">Sort by Popularity </button>
                <button type="button" onClick={this.sortTags} className="sort_button">Sort by Tags </button>
            </div>
        )
    }
}

export default Sort;
