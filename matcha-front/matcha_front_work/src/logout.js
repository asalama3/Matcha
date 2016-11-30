import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';



class logout extends Component {
    componentWillMount(){
        axios({
            method: 'post',
            url: 'http://localhost:8080/logout',
        }).then(({data}) => {            
            if (data.status === true)
            {
                console.log("logout");
                browserHistory.push('/');
            }
        })
        }

    render(){
        return(
            <div><h1>salut</h1></div>
        )
    }
}

export {logout};