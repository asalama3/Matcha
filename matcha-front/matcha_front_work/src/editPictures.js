// import Dropzone from 'react-dropzone';
// import request from 'superagent';
import React from 'react';
import '../css/editPictures.css';
import axios from 'axios';
import {browerHistory} from 'react-router';
import {Grid, Row, Col, Image} from 'react-bootstrap/lib';

class editPictures extends React.Component{
    state = {
      test: null,
      username: null,
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
        browerHistory.push('/');
      }
    })
  }

    constructor(props) {
        super(props);
        this.state = {photo: []};
        }

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
      this.setState({photo: response.data.data});
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



    render(){

    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img role="presentation" src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

// let urls = [
    // imagePreviewUrl,
// ];
// var imageUrls={urls};

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
if (this.state.photo){
    imgList = this.state.photo.map((el, key) =>

    <Grid>
    <Row>
      <Col xs={6} md={4}>
          <Image key={key} role="presentation" src={`http://localhost:8080/public/${this.state.username}/${el.name}`} circle style={style}/>
      </Col>
    </Row>
  </Grid>
    );
}
    console.log(imgList);

        return(
            <div className="pictures">
            <div> {imgList} </div>
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


            </div>
        )
    }
}

export default editPictures;
