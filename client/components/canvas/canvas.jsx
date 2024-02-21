import { useState, useEffect, useRef } from 'react';

let pixelSize = 25;
const numRowPixels = 20;
const numColPixels = 30;

const Canvas = () => {
  const canvasRef = useRef(null);
  const [currentColor, setCurrentColor] = useState('#000000'); // Default color
  const currentColorRef = useRef(currentColor);

  // Function to handle painting a pixel
  const paintPixel = (event) => {
    if (event.type === 'mousedown' || event.buttons === 1) {
      const pixel = event.target;
      pixel.style.backgroundColor = currentColorRef.current; // Use ref's current value
      const x = pixel.dataset.x;
      const y = pixel.dataset.y;
      // Assuming you convert currentColorRef.current to r, g, b
      const {r, g, b} = convertHexToRGB(currentColorRef.current);
      updatePixel(x, y, r, g, b);
    }
  };

  // Convert hex color to RGB - utility function
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

  // Update a pixel's color in the database
  const updatePixel = async (x, y, r, g, b) => {
    try {
      const response = await fetch(`http://localhost:9000/pixels/${x}-${y}`, {
        method: 'PUT', // Assuming your API uses PUT to update pixel data
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ r, g, b })
      });

      if (!response.ok) {
        throw new Error('Failed to update pixel');
      }

      console.log("Pixel updated successfully");
    } catch (error) {
      console.error("Error updating pixel:", error);
    }
  };

  const renderCanvas = () => {
    const canvasElement = canvasRef.current;
    canvasElement.innerHTML = ''; 

    for (let i = 0; i < numRowPixels; i++) {
      let row = document.createElement('div');
      row.style.display = 'flex';

      for (let j = 0; j < numColPixels; j++) {
        let pixel = document.createElement('div');
        pixel.style.width = `${pixelSize}px`;
        pixel.style.height = `${pixelSize}px`;
        pixel.style.border = '1px solid #ddd';
        pixel.addEventListener('mousedown', paintPixel);
        pixel.addEventListener('mouseenter', paintPixel);
        row.appendChild(pixel);
      }
      canvasElement.appendChild(row);
    }
  };

  useEffect(() => {
    renderCanvas();
  }, []);

  // Update the ref whenever the currentColor changes
  useEffect(() => {
    currentColorRef.current = currentColor;
  }, [currentColor]);

  // Effect hook to render the canvas initially and on dependency change
  useEffect(() => {
    // Adding mouse event listeners for painting
    const handleMouseDown = () => (window.isMouseDown = true);
    const handleMouseUp = () => (window.isMouseDown = false);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Cleanup the event listeners on component unmount
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []); 


  return (
    
    <div>
      {/* <form onSubmit={init_pixel(2, 3, 4,5 ,5)}>
        <button type="submit">Post</button>
      </form> */}
      <h2>React Drawing Canvas</h2>
      <div>
        <label>Color:</label>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
        />
      </div>
      <div
        ref={canvasRef}
        className="canvas"
        style={{
          margin: '10px 0',
          border: '1px solid #000',
        }}
      ></div>
    </div>
  );
};

export default Canvas;

