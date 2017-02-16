import React from 'react';
import '../../css/chat.css';
var _ = require('lodash');

class Chat extends React.Component {
  // display a chat form submit send MESSAGE
  // selectedChat from chats


  handleSubmit = (e) => {
    e.preventDefault();
    const { other, onSend } = this.props;
    if ((_.isEmpty(e.target.message.value)) || (!e.target.message.value.replace(/\s/g, '').length )) {
      return ;
    }
    onSend({ message: e.target.message.value, to: other });
    e.target.message.value = '';
  }

  drawMessages = () => {
    const userWithPic = this.props.messages.map((el, key) =>
        <div className="scrollChat" key={key}>
        <span className="sender">{el.from}: </span>
        <span className="mess">{el.message}</span>
        </div>
      );
    return userWithPic;
  }

  // new message event socket a envoyer au back qui renvoie le message pour la bonne personne
  // save en back les messages verifier si le user est connecte ou non
  //

  render() {
    return (
      <div className="main">
        <div className="drawMessages">
          {this.drawMessages()}
      </div>
        <form onSubmit={this.handleSubmit} className="chatForm">
          <input
            className="chatInput"
            type='text'
            autoComplete="off"
            placeholder="Enter a message"
            name="message"
          />
          <button className="chatButton">
            SEND
          </button>
        </form>
        </div>
    )
  }
}

export default Chat;
