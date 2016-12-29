import React from 'react';
import '../css/welcome.css';
import vid from '../video/Couples-cut2.mp4';

class App extends React.Component {
  render() {
    return (
      <div>
        <div>
          <video id="video" loop autoPlay="true" muted>
            <source className="video" src={vid} type="video/mp4" />
              Your browser does not support the video tag.
          </video>
        </div>
        <div> {this.props.children} </div>
      </div>
    );
  }
}

export default App;
