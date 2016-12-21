import React, {Component} from 'react';


class Images extends Component {
  render(){


    console.log('sfvsfvsdcfsvsdfvsdecf' , this.props.user);
    console.log('sfvsfvsdcfsdecf' , this.props.photo.length);
    var style = {
      width: 200,
      height: 300,
    }


    // let imgs = [];
    //   for (let i=0; i < this.props.photo.length; i++){
    //     imgs.push(<div> key={i} {this.props.photo[i]}  </div>)
    //
    //   }


      let profile =[];
    console.log('profile', profile);
      if (this.props.photo !== null && this.props.photo.length > 0 && !this.props.pending) {
        profile = this.props.photo.map((el, key) => {
          // console.log("in loop : ", el, key);
          return (
            <div key={key}>
            <img role="presentation" id="img-profile" className="img-thumbnail img-center img-rounded" 
            src={`http://localhost:8080/public/${this.props.user.username}/${el.name}`} style={style} />
            </div>
          )
      });
    }
      else {
        console.log("Else : ");
        profile.push(<div></div>)
      };



    return (
        <div>
          {this.props.photo.length > 0 && profile}
        </div>
    )
  }
}

export default Images;
