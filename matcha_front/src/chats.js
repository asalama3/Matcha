import React from 'react';
import axios from 'axios';
import Chat from './components/chat';
import '../css/chats.css';
// import { browserHistory } from 'react-router';

class Chats extends React.Component {

  state = {
    user: '',
    chats: '',
    pending: true,
    selectedChat: 0,
  }

  componentDidMount = async () => {
    const checkAuth = await axios.get('http://localhost:8080/check_auth', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (checkAuth.data.status === true) {
      const loggedUser = checkAuth.data.data;
      this.setState({
        user: loggedUser,
      });
    }
    const response = await axios.get('http://localhost:8080/get_matches', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.data.status === true) {
      this.setState({ chats: response.data.data, pending: false });
    }
    console.log(response);
  };

  changeSelected = index => this.setState({ selectedChat: index });

  sendMessage = (data) => {
    const { chats, user } = this.state;
    global.socket.emit('messsage', data);
    const newChats = chats.map((el) => {
      if (el.userA.username === data.to || el.userB.username === data.to) {
        return {
          ...el,
          messages: [
            ...el.messages,
            { from: user.username, message: data.message },
          ],
        };
      }
      return el;
    });
    this.setState({ chats: newChats });
  }

  render() {
    let chatList = [];
    let chat;
    let other;
    const { pending, chats, user, selectedChat } = this.state;
    if (!pending && chats) {
      chat = chats[selectedChat];
      other = chat.userA.username === user.username ? chat.userB.username : chat.userA.username;
      chatList = chats.map((src, index) =>
        <li
          onClick={() => this.changeSelected(index)}
          key={index}
          className="changeChat">
            <div>
              {src.userB.username === user.userame ? src.userA.username : src.userB.username}
            </div>
        </li>);
    }
    return (
      <div className="contain">
        <div className= "all">
          <ul className="chatList">
            {chatList}
          </ul>
        </div>
        {chats.length > 0 && <Chat messages={chat.messages} other={other} onSend={this.sendMessage} />}
      </div>
    );
  }
}

export default Chats;
