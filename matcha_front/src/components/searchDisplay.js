import React, {Component} from 'react';

class searchDisplay extends Component {
  render(){
    return(
      <div className="container">
      <h1> SALUT</h1>
          <div className="row">
            <div className=" col-lg-offset-3 col-lg-6">
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-sm-offset-3 col-sm-6 col-md-offset-3 col-md-6 col-lg-offset-3 col-lg-6">
                          <img className="img-circle img-responsive" role="presentation" src="http://api.adorable.io/avatars/300/abott@adorable.png" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="centered-text col-sm-offset-3 col-sm-6 col-md-offset-3 col-md-6 col-lg-offset-3 col-lg-6">
                          <div itemScope itemType="http://schema.org/Person">
                            <h2> <span itemProp="name">Your Name</span></h2>
                            <p itemProp="jobTitle">Your Position</p>
                            <p><span itemProp="affiliation">Your Company</span></p>
                            <p>
                              <i className="fa fa-map-marker" /> <span itemProp="addressRegion">Your City, Your State</span>
                            </p>
                            <p itemProp="email"> <i className="fa fa-envelope">&nbsp;</i> <a href="mailto:you@somedomain.com">you@somedomain.com</a> </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 centered-text">
                      Your Short Bio goes here.
                    </div>
                  </div>
                </div>
                <div className="panel-footer">
                  <div className="row">
                    <div id="social-links" className=" col-lg-12">
                      <div className="row">
                        <div className="col-xs-6 col-sm-3 col-md-2 col-lg-3 social-btn-holder">
                          <a title="google" className="btn btn-social btn-block btn-google" target="_BLANK" href="http://plus.google.com/+You/">
                            <i className="fa fa-google" /> +You
                          </a>
                        </div>
                        <div className="col-xs-6 col-sm-3 col-md-2 col-lg-3 social-btn-holder">
                          <a title="twitter" className="btn btn-social btn-block btn-twitter" target="_BLANK" href="http://twitter.com/yourid">
                            <i className="fa fa-twitter" /> /yourid
                          </a>
                        </div>
                        <div className="col-xs-6 col-sm-3 col-md-2 col-lg-3 social-btn-holder">
                          <a title="github" className="btn btn-social btn-block btn-github" target="_BLANK" href="http://github.com/yourid">
                            <i className="fa fa-github" /> /yourid
                          </a>
                        </div>
                        <div className="col-xs-6 col-sm-3 col-md-2 col-lg-3 social-btn-holder">
                          <a title="stackoverflow" className="btn btn-social btn-block btn-stackoverflow" target="_BLANK" href="http://stackoverflow.com/users/youruserid/yourid">
                            <i className="fa fa-stack-overflow" /> /yourid
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default searchDisplay;
