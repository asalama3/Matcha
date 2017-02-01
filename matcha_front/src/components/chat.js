import React from 'react';
import '../../css/chat.css';

class Chat extends React.Component {
  // display a chat form submit send MESSAGE
  // selectedChat from chats


  handleSubmit = (e) => {
    e.preventDefault();
  }
  drawMessages = () => this.props.messages.map((el, key) =>
    <div key={key}>

      <span className="sender">{el.from}: </span>
      <span className="mess">{el.message}</span>
    </div>,
  )

  // new message event socket a envoyer au back qui renvoie le message pour la bonne personne
  // save en back les messages verifier si le user est connecte ou non
  //

  render() {
    return (
      <div>
        <div className="drawMessages">
          {this.drawMessages()}
      </div>
        <form onSubmit={this.handleSubmit} className="chatForm">
          <input
            className="chatInput"
            type='text'
            autoComplete="off"
            placeholder="Enter a message"
          />
          <button className="chatButton">
            SEND
          </button>
        </form>
        <div className="clear_float" ></div>
        </div>
    )
  }
}

export default Chat;
