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
          Authorization: `Bearer ${localStorage.getItem('token')}`
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
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (response.data.status === true) {
      this.setState({ chats: response.data.data, pending: false });
    }
    console.log(response);
  };

  changeSelected = index => this.setState({ selectedChat: index });

  render() {
    let chatList = [];
    const { pending, chats, user, selectedChat } = this.state;
    if (!pending && chats) {
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
      <div>
        <div>
          <ul className="chatList">
            {chatList}
          </ul>
        </div>
        {chats.length > 0 && <Chat messages={chats[selectedChat].messages} />}
      </div>
    );
  }
}

export default Chats;


// import React from 'react';
//
// const chats = [
//   {
//     me: monUsername,
//     him: sonUsername,
//     messages: [
//       { from: username, message: 'faefwaag' },
//       { from: username, message: 'faefwaag' },
//       { from: username, message: 'faefwaag' },
//       { from: username, message: 'faefwaag' },
//       { from: username, message: 'faefwaag' },
//       { from: username, message: 'faefwaag' },
//       { from: username, message: 'faefwaag' },
//       { from: username, message: 'faefwaag' },
//     ]
//   },
// ]
//
// export default class Chats extends React.Component {
//   state = {
//     chats: [],
//     selectedChats: 0,
//   }
//
//   componentDidMount() {
//     const { chats } = this.state;
//     this.setState({ chats: api.getChats() }); // axios back
//     global.socket.on('new message', (data) => { // cherche quel chat correspond
//       const newChats = chats.map((chat) => {
//         if (chat.him === data.from) {
//           chat.messages = [...chat.message, data.message];
//         }
//         return chat;
//       });
//       this.setState({ chats: newChats });
//     });
//   }
//
//   componentWillunMount() {
//   }
//
//   sendMessage = (data) => {
//     global.socket.emit('new message', data);
//   }
//
//   changeSelected = (evt) => {
//     this.setState({ selectedChats: evt.target.id });
//   }
//
//   render() {
//     const chatList = this.state.chats.map((el, index) => <li key={index} id={index}>{el.him}</li>);
//     <div>
//       <ul>{chatList}</ul>
//       <Chat chat={this.state.chats[selectedChats]} onSend={this.sendMessage}></Chat>
//     </div>
//   }
// }
