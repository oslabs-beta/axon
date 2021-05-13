import React from 'react';
import RootComponent from '@/app/root';
import Particles from 'particlesjs';
import logo from '../../assets/AxonTitleIcon.png';



// Main App Component
const App = () => {

  // When Application Loads initially, start dynamic particle background
  window.onload = function () {
    Particles.init({
      selector: '.background',
      connectParticles: true,
      color: '#88c8ff',
      maxParticles: 175,
    });
  };

  return (
    <div className="app">
      {/* Logo at top of the page */}
      <header>
        <img id="axonTitle" src={logo} />
      </header>
      {/* Main Root Component, containing Application logic */}
      <RootComponent />
    </div>
  );
};

export default App;
