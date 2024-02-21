import './App.css';
import Chat from '../components/chat/chat'
import Canvas from '../components/canvas/canvas'

function App() {
  return (
    <div className='page'>
      <Canvas/>
      <Chat/>
    </div>
  );
}

export default App;
