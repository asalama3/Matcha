// import Dropzone from 'react-dropzone';
// import request from 'superagent';
import React from 'react';
import '../css/editPictures.css';
import axios from 'axios';
import {browserHistory} from 'react-router';
import {Grid, Row, Col, Image} from 'react-bootstrap/lib';

class editPictures extends React.Component{
    state = {
      test: null,
      username: null,
      showImage: true,
      photo: [],
    }

  componentWillMount() {
    axios({
      method: 'post',
      url: 'http://localhost:8080/checklogin',
    }).then(({data}) => {
      console.log(data);
      if (data.status === true)
      {
        this.setState({data: data.data, username: data.username, photo: data.data.photo})
        console.log("ok logged-in");
      }
      else{
        console.log('user not logged in:', data.details);
        browserHistory.push('/');
      }
    })
  }

    // constructor(props) {
    //     super(props);
    //     this.state = {photo: []};
    //     }

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    console.log(this.state.file.size);
    console.log(this.state.file.type);
    console.log(this.state.file);

    if (this.state.file.type !== "image/jpeg" && this.state.file.type !== "image/jpg" && this.state.file.type !== "image/png")
    {
      console.log("not ok wrong format.....");
      this.setState({imagePreviewUrl: '', file: '', error: "wrong file format"}) ;
    }else{
      console.log("does it go here");

    const response =  await axios({
      method: 'post',
      url: 'http://localhost:8080/editPic',
      data: {
        size: this.state.file.size,
        type: this.state.file.type,
        photo: this.state.imagePreviewUrl,
        name: this.state.file.name
      }
    })
    if (response.data.status === true)
    {
      console.log('handle uploading-', response.data.details);
      console.log('data:', response.data.data);
      this.setState({photo: response.data.data, imagePreviewUrl: ''});
      console.log('photo state' ,this.state.photo);
    }
      else{  
      console.log('not ok:', response.data.details);

      }
  }
}

  handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    if (file)
      reader.readAsDataURL(file)
  }

// renderImage = () => {
//   console.log("image rendered");
//     return (
//       <div>
//         <img src={'./uploads/andrea2289/bronde.jpg'} />
//       </div> 
//     );
//   }
    //  <button className="all" onClick={this.renderImage} > </button>

    delImg = async (key, name) => {
      console.log("delete image on click");
      // console.log(e.target.src);
      console.log(key);
      console.log(name);
      // this.setState({ showImage: false });
      // console.log('hhhhhhh' , this.state.showImage);
      const response = await axios({
        method: 'post',
        url: 'http://localhost:8080/delPic',
        data: {
          name: name
        }
      })
      if (response.data.status === true)
      {
        console.log ("ok deleted");
        console.log (response.data.details);
        console.log (response.data.values);
        this.setState({photo: response.data.values });
      }
    }

    profile_pic = async (key, name) => {
      console.log(key);
      console.log(name);
    
      console.log("ok");
      const response = await axios ({
        method: 'post',
        url: 'http://localhost:8080/profilePic',
        data: {
          name: name,
          key: key
        }
      })
      if (response.data.status === true){
        {
          console.log("ok profile pic added key");
          // add message de ok
        }
      }
    }

    render(){

    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img role="presentation" src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }


var style = {
  width: 100,
  height: 100,
}

// const files = this.state.photo.map((el, key) => {
//   console.log('el:', el);
//   console.log('key', key);
//   console.log('el.name' , el.name);
//   <div className="" >{el.name} </div>
// }, this);


let imgList = [];
console.log(this.state.photo);
if (this.state.photo !== null){
    imgList = this.state.photo.map((el, key) =>

    <Grid key={key}>
    <Row>
      <Col xs={6} md={4}>
          <div className="hover_class">
            <button className="trash_button" onClick={() => this.delImg(key, el.name)}><i className="fa fa-trash-o fa-2x" aria-hidden="true"></i></button>
            <button className="profile_button" onClick={() => this.profile_pic(key, el.name)}> <i className="fa fa-user fa-2x" aria-hidden="true"></i></button>
            <Image  role="presentation" src={`http://localhost:8080/public/${this.state.username}/${el.name}`} circle style={style}/>
          </div>
      </Col>
    </Row>
  </Grid>
    );
}
// let img = this.state.showImage ? {imgList} : '';


    // console.log(imgList);

        return(
            <div className="pictures">
            <div>{imgList}</div>
            {(this.state.photo.length < 5 &&  
      <div className="previewComponent">
        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
          <input className="fileInput" type="file" onChange={this.handleImageChange} />
          <button className="submitButton" type="submit" onClick={this.handleSubmit}>Upload Image</button>
        </form>
        <div className="imgPreview">
          {$imagePreview}
        </div>
          <div> {this.state.error} </div>

      </div>
|| this.state.photo.length > 4 && <div>Pas plus de 5 images!</div> )}

            </div>
        )
    }
}

export default editPictures;
