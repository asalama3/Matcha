import React from 'react';

class InputTest extends React.Component {  
    componentWillReceiveProps = (newProps) => {
        console.log("new Props");
    }
    render() {
    console.log(this.props)
        
        return(
            <div>
            <input type={this.props.type} name={this.props.name} value={this.props.value} />
            </div>
        )
    }
};

export {InputTest};