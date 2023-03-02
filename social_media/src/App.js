import React from 'react'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomeView from './views/HomeView';
import ProfileView from './views/ProfileView';
import SignUpView from './views/SignUpView'
import LogIn from './views/LogInView'
import ProtectedRoutes from "./ProtectedRoute";
import CreatePostView from "./views/CreatePostView"
import AccountListView from "./views/AccountListView"



import ChatView from "./views/ChatView"

function App() {
  return <div className="App">
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={<HomeView />} />
          <Route path='profile' element={<ProfileView />} />
          <Route path='/create' element={<CreatePostView />} />
          <Route path='/friend/:pk' element={<ChatView />} />
          <Route path='/friend' element={<AccountListView />} />
        </Route>

        <Route path='signup' element={<SignUpView />} />
        <Route path='login' element={<LogIn />} />
      </Routes>
    </BrowserRouter>
    
  </div>;
}

export default App;
