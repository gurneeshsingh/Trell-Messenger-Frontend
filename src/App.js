/* eslint-disable react-hooks/exhaustive-deps */
import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Register from "./pages/Register";
import Login from "./pages/Login"
import ChooseAvatar from './pages/ChooseAvatar';
import LoginChangeAvatar from './pages/LoginChangeAvatar'
import Chats from "./pages/Chats";
import {  useDispatch } from "react-redux"
import { reset } from './redux/features/userSlice';
import { useEffect} from 'react';
import { getMe } from './redux/features/userSlice';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  const dispatch = useDispatch()

  const token = JSON.parse(localStorage.getItem('token'));
  
  

  useEffect(() => {
    async function callGetme() {

      await dispatch(getMe(token))
      dispatch(reset())

    }
    token && callGetme()


  }, [token])

  


  return (
    <Routes>
      <Route path='/' element={!token ? <Welcome /> : <Chats />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/chooseavatar' element={<ProtectedRoute auth={token}>
        <ChooseAvatar />
      </ProtectedRoute>} />
      <Route path='/loginchangeavatar' element={<ProtectedRoute auth={token}>
        <LoginChangeAvatar />
      </ProtectedRoute>} />
      <Route path='/chats' element={<ProtectedRoute auth={token}>
        <Chats />
      </ProtectedRoute>} />

    </Routes>
  );
}

export default App;