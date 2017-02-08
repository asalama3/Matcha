import axios from 'axios';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import React from 'react';
import '../css/editPictures.css';

class editPictures extends React.Component {
  state = {
    test: '',
    username: '',
    showImage: true,
    photo: [],
  }

  componentDidMount = async () => {
    const checkAuth = await axios.get('http://localhost:8080/edit_pictures', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (checkAuth.data.status === true) {
      this.setState({ data: checkAuth.data.data, username: checkAuth.data.data.username, photo: checkAuth.data.data.photo });
    } else {
      browserHistory.push('/');
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.state.file.type !== 'image/jpeg' && this.state.file.type !== 'image/jpg' && this.state.file.type !== 'image/png') {
      this.setState({ imagePreviewUrl: '', file: '', error: 'wrong file format' });
    } else {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/addPic',
      data: {
        size: this.state.file.size,
        type: this.state.file.type,
        photo: this.state.imagePreviewUrl,
        name: this.state.file.name,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (response.data.status === true) {
      this.setState({ photo: response.data.data, imagePreviewUrl: '' });
    } else {
      // do something here
      }
    }
  }

  handleImageChange = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file,
        imagePreviewUrl: reader.result,
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  delImg = async (key, name) => {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/delPic',
      data: {
        name,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (response.data.status === true) {
      this.setState({ photo: response.data.values });
    }
  }

  profilePic = async (key, name) => {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/profilePic',
      data: {
        name,
        key,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (response.data.status === true) {
      console.log('ok profile pic added key');
      // add message de ok
    }
  }

  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img role="presentation" src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    const style = {
      width: 200,
      height: 200,
      padding: 5,
    };

    let imgList = [];
    if (this.state.photo !== null) {
      imgList = this.state.photo.map((el, key) =>
        <Grid key={key}>
          <Row>
            <Col xs={6} md={4}>
              <div className="hover_class">
                <button className="trash_button" onClick={() => this.delImg(key, el.name)}><i className="fa fa-trash-o fa-2x" aria-hidden="true"></i></button>
                <button className="profile_button" onClick={() => this.profilePic(key, el.name)}> <i className="fa fa-user fa-2x" aria-hidden="true"></i></button>
                <Image role="presentation" src={`http://localhost:8080/public/${this.state.username}/${el.name}`} style={style}/>
              </div>
            </Col>
          </Row>
        </Grid>,
      );
    }

    return (
      <div className="pictures">
        <div>{imgList}</div>
        {((this.state.photo.length < 5 &&
          <div className="previewComponent">
            <form onSubmit={this.handleSubmit} encType="multipart/form-data">
              <input className="fileInput" type="file" onChange={this.handleImageChange} />
              <button className="submitButton" type="submit" onClick={this.handleSubmit}>Upload Image</button>
            </form>
            <div className="imgPreview">
              {$imagePreview}
            </div>
            <div> {this.state.error} </div>
          </div>)
          || (this.state.photo.length > 4 && <div>Pas plus de 5 images!</div>))}
      </div>
    );
  }
}

export default editPictures;
