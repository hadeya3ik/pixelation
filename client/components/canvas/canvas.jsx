import { useState, useEffect, useRef } from 'react';

// let pixelSize = 25;
// const numRowPixels = 20;
// const numColPixels = 30;

const Canvas = () => {
  const [backendData, setBackendData] = useState({ messages: [] }); 

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:9000/pixels");
      const data = await response.json();
      console.log(data);
      setBackendData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const modifyPixel = async () => {
    const pixelId = '65d599cb42c1d3ba70e99079';
    try {
      const response = await fetch(`http://localhost:9000/pixels/${pixelId}/update`, { // Use the correct pixel ID
        method: 'PUT', // Or 'PATCH', as appropriate
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ r: 255, g: 255, b: 255 }), 
      });
  
      if (response.ok) {
        console.log("Pixel modified successfully");
        fetchMessages(); // Refresh pixel data after modification
      } else {
        console.error("Failed to modify pixel");
      }
    } catch (error) {
      console.error("Error modifying pixel:", error);
    }
  };
  

  useEffect(() => {
    fetchMessages(); 
  }, []); 
  return (
    
    <div>
      <div>canvas</div>
      <button onClick={modifyPixel}>Modify Pixel at (0,0)</button>
      {backendData.pixel && backendData.pixel.map((message, index) => (
          <div key={index}>{message.x}, {message.y} - {message.r}{message.g}{message.b}</div>
        ))}
    </div>
  );
};

export default Canvas;

