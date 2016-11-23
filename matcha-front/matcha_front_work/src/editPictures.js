import Dropzone from 'react-dropzone';
import request from 'superagent';
import React from 'react';
import '../css/editPictures.css';
import axios from 'axios';
import {browerHistory} from 'react-router';


class editPictures extends React.Component{
    
  componentWillMount() {
    axios({
      method: 'post',
      url: 'http://localhost:8080/checklogin',
    }).then(({data}) => {
      console.log(data);
      if (data.status === true)
      {
        console.log("ok logged-in");
      }
      else{
        console.log('user not logged in:', data.details);
        browerHistory.push('/login');
      }
    })
  }

    constructor(props) {
        super(props);
        this.state = {};
        }

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    console.log(this.state.file.size);
    console.log(this.state.file.type);
    console.log(this.state.file);

    if (this.state.file.type !== "image/jpeg" || this.state.file.type !== "image/jpg" || this.state.file.type !== "image/png")
    {
      console.log("not ok wrong format.....");
      this.setState({imagePreviewUrl: '', error: "wrong file format"}) ;
    }else{
      console.log("does it go here");
    const response =  await axios({
      method: 'post',
      url: 'http://localhost:8080/editPic',
      data: {
        size: this.state.file.size,
        type: this.state.file.type,
        photo: this.state.imagePreviewUrl
      }
    })
    if (response.data.status === true)
      console.log('handle uploading-', response.data.details);
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

//  console.log(e.target.files[0].size);
  }

    render(){
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }
        return(
            <div className="pictures">
    
      <div className="previewComponent">
        <form onSubmit={this.handleSubmit}>
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