import { useState, useEffect, useRef} from 'react';
import './canvas.css'
// let pixelSize = 25;
// const numRowPixels = 20;
// const numColPixels = 30;

const Canvas = () => {
  const [backendData, setBackendData] = useState({ messages: [] }); 
  const [currentColor, setCurrentColor] = useState('#32a852'); 
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const startDrawing = (x, y) => {
    modifyPixel(x, y);
    setIsDrawing(true); 
  };

  const stopDrawing = () => {
    setIsDrawing(false); 
  };

  const draw = (x, y) => {
    if (isDrawing) {
      modifyPixel(x, y);
    }
  };

  const convertHexToRGB = (hex) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
    else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    return { r, g, b };
  };

  useEffect(() => {
    setIsLoading(true); // Start loading
    fetchMessages().then(() => setIsLoading(false)); // Stop loading after fetching
  }, []);
  
  const fetchMessages = async () => {
    try {
      const response = await fetch("https://pixelation-1.onrender.com/pixels");
      // const response = await fetch("http://localhost:9000/pixels");
      const data = await response.json();
      console.log(data);
      setBackendData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const modifyPixel = async (x, y) => {
    const { r, g, b } = convertHexToRGB(currentColor); // get the latest color values
    try {
      const response = await fetch(`https://pixelation-1.onrender.com/pixels/updateByCoordinates`, {
      // const response = await fetch(`http://localhost:9000/pixels/updateByCoordinates`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ x, y, r, g, b }), 
      });
  
      if (response.ok) {
        console.log("Pixel modified successfully");
        fetchMessages(); // refresh
      } else { console.error("Failed to modify pixel"); }
    } catch (error) { console.error("Error modifying pixel:", error);}
  };

  const pixelStyle = (r, g, b) => {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const textColor = luminance > 0.5 ? 'black' : 'white';
    return {
      width: '25px',
      height: '25px',
      backgroundColor: `rgb(${r},${g},${b})`,
      color: textColor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '12px',
    };
  };
  
  useEffect(() => {
    fetchMessages(); 
  }, []);

  return (  
    <div>
      <div style={{ padding: '1rem' }}>
      <label style={{ padding: '1rem' }}>Color:</label>
      <input
        type="color"
        value={currentColor}
        onChange={(e) => setCurrentColor(e.target.value)}
      />
      </div>
      {isLoading ? (
        <>
         <div className="spinner"></div>
         <p>Loading chat history...</p> 
       </>
        ) : (
        <div id="canvas"
            onMouseDown={(e) => startDrawing()}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}>
          {backendData.pixel && backendData.pixel.map((pixel, index) => (
            <div
              onMouseMove={() => draw(pixel.x, pixel.y)}
              onMouseDown={() => startDrawing(pixel.x, pixel.y)}
              key={index}
              style={pixelStyle(pixel.r, pixel.g, pixel.b)}
              title={`x: ${pixel.x}, y: ${pixel.y}, rgb(${pixel.r},${pixel.g},${pixel.b})`}>
            </div>
          ))}
      </div>)}
    </div>
  );
};

export default Canvas;