import { useState, useEffect, useRef} from 'react';
import './canvas.css'
// let pixelSize = 25;
// const numRowPixels = 20;
// const numColPixels = 30;

let x = 0 
let y = 4

const Canvas = () => {
  const [backendData, setBackendData] = useState({ messages: [] }); 
  const [currentColor, setCurrentColor] = useState('#32a852'); 
  const currentColorRef = useRef(currentColor);

  const convertHexToRGB = (hex) => {
    let r = 0, g = 0, b = 0;
    // 3 digits
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits
    else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    return { r, g, b };
  };

  let curr_r = convertHexToRGB(currentColor).r
  let curr_g = convertHexToRGB(currentColor).g
  let curr_b = convertHexToRGB(currentColor).b
  
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

  const modifyPixel = async (x, y) => {
    const { r, g, b } = convertHexToRGB(currentColor); // get the latest color values
    try {
      const response = await fetch(`http://localhost:9000/pixels/updateByCoordinates`, {
        method: 'PUT', // Make sure this method is supported by your backend
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ x, y, r, g, b }), // use the state values directly
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

  const pixelStyle = (r, g, b) => {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const textColor = luminance > 0.5 ? 'black' : 'white';
    return {
      width: '30px',
      height: '30px',
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
      <div>canvas</div>
      <div id="canvas">
        {backendData.pixel && backendData.pixel.map((pixel, index) => (
          <div
            onClick={() => modifyPixel(pixel.x, pixel.y)}
            key={index}
            style={pixelStyle(pixel.r, pixel.g, pixel.b)}
            title={`x: ${pixel.x}, y: ${pixel.y}, rgb(${pixel.r},${pixel.g},${pixel.b})`}>
          </div>
          ))}
      </div>
      <div>
        <label>Color:</label>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
        />
        <p>r: {curr_r}, g: {curr_g}, b: {curr_b}</p>
      </div>
      <button onClick={() => modifyPixel(x, y)}>Modify Pixel at ({x}, {y})</button>
      {backendData.pixel && backendData.pixel.map((message, index) => (
          <div key={index}>{message.x}, {message.y} - {message.r}{message.g}{message.b}</div>
        ))}
    </div>
  );
};

export default Canvas;
