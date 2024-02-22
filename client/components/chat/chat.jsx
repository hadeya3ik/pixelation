import { useEffect, useState , useRef} from 'react';
import './chat.css'

function Chat() {
    const [backendData, setBackendData] = useState({ messages: [] }); 
    const [author, setAuthor] = useState('');
    const [messageText, setMessageText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const chatBoxRef = useRef(null);

    const fetchMessages = async () => {
      try {
        const response = await fetch("https://pixelation-1.onrender.com/api");
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

    useEffect(() => {
      setIsLoading(true); // Start loading
      fetchMessages().then(() => setIsLoading(false)); // Stop loading after fetching
    }, []);

    useEffect(() => {
      // Auto-scroll logic
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, [backendData.messages]);
    
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
          const response = await fetch('https://pixelation-1.onrender.com/api', {
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
        {isLoading ? (
          <>
            <div className="spinner"></div>
            <p>Loading chat history...</p> 
          </>
      ) : ( 
        <>
        <div className="chat_box" ref={chatBoxRef}> {/* Attach the ref to the chat box */}
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
                <input placeholder="Username" value={author} onChange={handleAuthorChange} />
                <input placeholder="Message" value={messageText} onChange={handleMessageChange} />
            </div>
            <button className="submit_button" type="submit">Post</button>
        </form>
        </>
      )}
    </div>
  )
}

export default Chat