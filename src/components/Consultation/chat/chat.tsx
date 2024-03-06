import React, { useState, useEffect } from 'react';
import { useXMTP } from './xmtpContext';
import { sendMessage, streamMessages } from './xmtp';


interface Message {
  id: string;
  senderId: string; // User address
  text: string;
}

interface MessageListProps {
  messages: Message[];
}

interface SendMessageFormProps {
  sendMessage: (conversation: any, message: string) => void;
  conversation: any;
}

interface SendMessageFormState {
  message: string;
}

class MessageList extends React.Component<MessageListProps> {
  render() {
      return (
          <ul className="message-list">
              {this.props.messages.map((message, index) => {
                  return (
                    <li key={message.id} className="message">
                      <div>{message.senderId}</div>
                      <div>{message.text}</div>
                    </li>
                  )
              })}
          </ul>
      )
  }
}


class SendMessageForm extends React.Component<SendMessageFormProps, SendMessageFormState> {
  constructor(props: SendMessageFormProps) {
      super(props);
      this.state = {
          message: ''
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(e) {
      this.setState({
          message: e.target.value
      })
  }
  
  handleSubmit(e) {
    e.preventDefault();
    if (this.props.conversation) {
        this.props.sendMessage(this.props.conversation, this.state.message);
        this.setState({
            message: ''
        });
    }
}
  
  render() {
      return (
          <form
              onSubmit={this.handleSubmit}
              className="send-message-form">
              <input
                  onChange={this.handleChange}
                  value={this.state.message}
                  placeholder="Type your message and hit ENTER"
                  type="text" />
          </form>
      )
  }
}

function Title() {
return <p className="title">BlockMedSecure Medical Chat</p>
}

const Chat = () =>{
  const [messages, setMessages] = useState([]);
  const [conversationList, setConversationList] = useState(null);
  const xmtp = useXMTP();

  useEffect(() => {
    const retrieveMessages = async () => {
      if (xmtp.conversation) {
        for await (const message of await streamMessages(xmtp.conversation)) {
          setMessages(prevMessages => [...prevMessages, message]);
        }
      }
    };

    retrieveMessages();
  }, [xmtp.conversation]);

  useEffect(() => {
    setConversationList(xmtp.conversationList);
  }, [xmtp.conversationList]); // Conversation list currently not used


  const handleSendMessage = async (text) => {
    if (xmtp.conversation) {
      await sendMessage(xmtp.conversation, text);
    }
  };

  return (
    <div className="app">
      <Title />
      <MessageList messages={messages} /> 
      <SendMessageForm sendMessage={handleSendMessage} conversation={xmtp.conversation} />
    </div>
  );
};

export default Chat;