import React from 'react';
// import './app.scss';
import RootComponent from '@/app/root';
import logo from '../../assets/AxonFinalLogo.png';
import Particles from 'particlesjs'
import { reduceEachTrailingCommentRange } from 'typescript';

const App = () => {

  window.onload = function () {
    Particles.init({
      selector: '.background',
      connectParticles: true,
      color: '#88c8ff',
      maxParticles: 175,
    })
}
  
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