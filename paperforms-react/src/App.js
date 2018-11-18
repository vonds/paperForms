import React, { Component } from 'react';
import Landing from './components/Landing'
import Header from './components/Header'


import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header branding="Paper Forms" />
        <Landing title="Paper Forms" subtitle="Welcome" />
      </div>
    );
  }
}

export default App;
