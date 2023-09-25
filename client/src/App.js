import React, { Component } from 'react';
import './App.css';
import './notebook_style/style.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutPage from './components/LayoutPage';
import ListNotes from './components/ListNotes';
import SaveNote from './components/SaveNote';
import Home from './components/Home';
import PrivateRoute from './auth/PrivateRoute';

class App extends Component {

  render() {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/note/save" element={<SaveNote />} />
              <Route path="/notes" element={<ListNotes />} />
            </Route>
            <Route path="/" element={<LayoutPage />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;