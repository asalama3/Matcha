import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';



class Logout extends Component {
    componentWillMount(){
        axios({
            method: 'post',
            url: 'http://localhost:8080/logout',
        }).then(({data}) => {            
            if (data.status === true)
            {
                browserHistory.push('/login');
            }
        })
        }

    render(){
        return(
            <div></div>
        )
    }
}

export {Logout};