import React, { useState, useEffect, useRef } from 'react';

let pixelSize = 25; 

const Canvas = () => {
  const canvasRef = useRef(null);
  const [currentColor, setCurrentColor] = useState('#000000'); // Default color
  const canvasSize = 500; // Fixed canvas size for simplicity

  // Function to handle painting a pixel
  const paintPixel = (event, color) => {
    if (event.type === 'mousedown' || event.buttons === 1) {
      event.target.style.backgroundColor = color;
    }
  };

  // Function to render the canvas grid
  const renderCanvas = () => {
    const canvasElement = canvasRef.current;
    canvasElement.innerHTML = ''; // Clear the canvas

    const numPixels = Math.floor(canvasSize / pixelSize);
    for (let i = 0; i < numPixels; i++) {
      let row = document.createElement('div');
      row.style.display = 'flex';

      for (let j = 0; j < numPixels; j++) {
        let pixel = document.createElement('div');
        pixel.style.width = `${pixelSize}px`;
        pixel.style.height = `${pixelSize}px`;
        pixel.style.border = '1px solid #ddd';
        pixel.addEventListener('mousedown', (e) => paintPixel(e, currentColor));
        pixel.addEventListener('mouseenter', (e) => paintPixel(e, currentColor));
        row.appendChild(pixel);
      }

      canvasElement.appendChild(row);
    }
  };

  // Effect hook to render the canvas initially and on dependency change
  useEffect(() => {
    renderCanvas();

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
  }, [currentColor]); // Dependencies to re-render the canvas

  return (
    <div>
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
          width: `${canvasSize}px`,
          margin: '10px 0',
          border: '1px solid #000',
        }}
      ></div>
    </div>
  );
};

export default Canvas;
