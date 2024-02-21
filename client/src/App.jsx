import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [backendData, setBackendData] = useState({ messages: [] }); // Adjusted assuming the backend returns { messages: [...] }
  const [author, setAuthor] = useState('');
  const [messageText, setMessageText] = useState('');

  // Function to fetch messages
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
    fetchMessages(); // Call on component mount
  }, []); // Empty dependency array ensures this runs once on mount

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessageText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:9000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author: author, messageText: messageText }), // Ensure these names match your server-side expectations
      });

      if (response.ok) {
        console.log("Message posted successfully");
        // Reset form
        setAuthor('');
        setMessageText('');
        // Fetch messages again to refresh the list
        fetchMessages();
      } else {
        console.error("Failed to post message");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <h1>Pixel Project</h1>
      <div>
        <h2>chat:</h2>
        {backendData.messages && backendData.messages.map((message, index) => (
          <div key={index}>{message.text} - {message.user}</div>
        ))}
        <form onSubmit={handleSubmit}>
          <h6>user:</h6>
          <input value={author} onChange={handleAuthorChange} />
          <h6>message:</h6>
          <input value={messageText} onChange={handleMessageChange} />
          <button type="submit">Post</button>
        </form>
      </div>
    </>
  );
}

export default App;
