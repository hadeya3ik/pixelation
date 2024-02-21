import { useEffect, useState } from 'react';
import './chat.css'

function Chat() {
    const [backendData, setBackendData] = useState({ messages: [] }); 
    const [author, setAuthor] = useState('');
    const [messageText, setMessageText] = useState('');
  
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:9000/api");
        const data = await response.json();
        console.log(data);
        setBackendData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    useEffect(() => {
      fetchMessages();
    }, []); 

    
    const handleAuthorChange = (event) => {
        setAuthor(event.target.value);
      };
    
      const handleMessageChange = (event) => {
        setMessageText(event.target.value);
      };

      const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch('http://localhost:9000/api', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ author: author, messageText: messageText }),
          });
    
          if (response.ok) {
            console.log("Message posted successfully");
            setAuthor('');
            setMessageText('');
            fetchMessages();
          } else {
            console.error("Failed to post message");
          }
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      };
  return (
    <div className='chat_root'>
        <h2>chat:</h2>
        <div className="chat_box">
          {backendData.messages && backendData.messages.map((message, index) => (
            <div className="message" key={index}>
            <div className="message_user">
              {message.user}
            </div>
            <div className="message_date">
              {formatDate(message.added)}
            </div>
            <div className="message_text">
              {message.text}
            </div>
            </div>
          ))}
        </div>
        <form className='form' onSubmit={handleSubmit}>
          <div className="inputs">
            
            <input placeholder="Username"  value={author} onChange={handleAuthorChange} />
            <input placeholder="Message"  value={messageText} onChange={handleMessageChange} />
          </div>
          <button className="submit_button" type="submit">Post</button>
        </form>
    </div>
  )
}

export default Chat