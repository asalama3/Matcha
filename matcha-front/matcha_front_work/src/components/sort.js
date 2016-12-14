import React, {Component} from 'react';
import axios from 'axios';
import '../../css/sort.css';



class Sort extends Component{

    componentWillMount(){
        // this.props = this.state.users;
        this.setState({ users: this.props });        
    }

    state = {
        users: [],
        sortOnce: false,
    }


    componentWillReceiveProps = (newProps) => {
        this.setState({ users: newProps.newUsers });
    }

    sortAge = (e) => {
        console.log("sort age");
        if (this.state.sortOnce === false){
            this.setState({ sortOnce: true  });
            console.log(this.state.users);
            const sortUsers = this.state.users.sort((a, b) => {
                return (a.age - b.age);
            });
            this.setState({ users: sortUsers });
            this.props.onUpdate(sortUsers);
            console.log(this.state.sortOnce);
        }
        else{
            this.setState({ sortOnce: false  });
            const sortUsers = this.state.users.sort((a, b) => {
                return (b.age - a.age);
            });
            this.setState({ users: sortUsers });
            this.props.onUpdate(sortUsers);
            console.log(this.state.sortOnce);
        }
    }

    sortLocation = (e) => {
        console.log("sort location");
    }

    render() {
        // console.log(this.props, "1111");
        return(
            <div className="sort">
                <button type="button" onClick={this.sortAge} className="sort_button">Sort by Age </button>
                <button type="button" className="sort_button">Sort by Location </button>
                <button type="button" className="sort_button">Sort by Tags </button>
                <button type="button" className="sort_button">Sort by Popularity </button>
            </div>
        )
    }
}

export default Sort;