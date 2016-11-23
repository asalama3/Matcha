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
        this.state = {file: '',imagePreviewUrl: ''};
        }

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    console.log(this.state.file);

    const response =  await axios({
      method: 'post',
      url: 'http://localhost:8080/editPic',
      data: {
        photo: this.state.imagePreviewUrl,
      }
    })
    if (response.data.status === true)
      console.log('handle uploading-', this.state.file);
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

      </div>
    
  
            </div>
        )
    }
}

export default editPictures;