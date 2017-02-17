import React from 'react';
import axios from 'axios';
import Chat from './components/chat';
import '../css/chats.css';
var _ = require('lodash');

// import { browserHistory } from 'react-router';

class Chats extends React.Component {

  state = {
    user: '',
    chats: '',
    pending: true,
    selectedChat: 0,
  }

  _mounted = false;

  componentWillUnmount() { this._mounted = false; }

  componentDidMount = async () => {
    this._mounted = true;
    const checkAuth = await axios.get('http://localhost:8080/check_auth', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (!this._mounted) return false;
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
    if (!this._mounted) return false;
    if (response.data.status === true) {
      this.setState({ chats: response.data.data, pending: false });
    }
    global.socket.on('receive new message', this.handleNewMessage);
  };

  changeSelected = index => this.setState({ selectedChat: index });

  handleNewMessage = (message) => {
    const newMessage = this.state.chats.map((el) => {
      if (el.userA.username === message.from || el.userB.username === message.from) {
        return {
          ...el,
          messages: [
            ...el.messages,
            message,
          ],
        };
      }
      return el;
    });
    this.setState({ chats: newMessage });
  }

  sendMessage = (data) => {
    const { chats, user } = this.state;
    global.socket.emit('new message', data);
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
    if (!pending && !_.isEmpty(chats)) {
      chat = chats[selectedChat];
      other = chat.userA.username === user.username ? chat.userB.username : chat.userA.username;
      chatList = chats.map((src, index) =>
        <li
          onClick={() => this.changeSelected(index)}
          key={index}
          className="changeChat">
            <div>
              {src.userA.username === user.username ? src.userB.username : src.userA.username}
            </div>
        </li>);
    } else if (!pending) {
      chatList = "You don't have any chats available yet";
    }
    return (
      <div className="contain">
        <div className="all">
          <ul className="chatList">
            {chatList}
          </ul>
        </div>
        {chats.length > 0 && <Chat messages={chat.messages} other={other} user={this.state.user} onSend={this.sendMessage} />}
      </div>
    );
  }
}

export default Chats;
