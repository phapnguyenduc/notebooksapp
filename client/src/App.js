import React, { Component } from 'react';
import './App.css';
import './notebook_style/style.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutPage from './components/LayoutPage';
import ListNotes from './components/ListNotes';
import SaveNote from './components/SaveNote';
import Home from './components/Home';
import PrivateRoute from './auth/PrivateRoute';
import getRouteUrl from './config/route-config';

class App extends Component {

  render() {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path={getRouteUrl('root')} element={<PrivateRoute />}>
              <Route path={getRouteUrl('note-save')} element={<SaveNote />} />
              <Route path={getRouteUrl('notes')} element={<ListNotes />} />
            </Route>
            <Route path={getRouteUrl('root')} element={<LayoutPage />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;