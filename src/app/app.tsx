import React from 'react';
// import './app.scss';
import RootComponent from '@/app/root';
import logo from '../../assets/AxonLogoDotSize.png';
const App = () => {
  return (
    <div className="app">
      {/* Logo at top of the page */}
      <header>
        <img id="axonTitle" src={logo}></img>
      </header>
      <RootComponent />
    </div>
  );
}

export default App;