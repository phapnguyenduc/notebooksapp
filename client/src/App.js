import React, { Component } from 'react';
import './App.css';
import './NoteBookStyle/style.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutPage from './components/LayoutPage';
import ListNotes from './components/ListNotes';
import CreateNote from './components/CreateNote';

class App extends Component {
  state = {
    data: null
  };

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }
  // fetching the GET route from the Express server which matches the GET route from app.js
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  render() {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LayoutPage />}>
              <Route index element={<ListNotes />} />
              <Route path="/create" element={<CreateNote />} />
              {/* <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NoPage />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;