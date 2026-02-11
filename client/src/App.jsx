import { Routes, Route } from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import EmailVerificationPage from "./pages/auth/emailverification";

import PeopleHome from "./pages/people-view/home";
import PeopleLayout from "./components/people-view/layout";

import { Skeleton } from "@/components/ui/skeleton"

import NotFound from "./pages/not-found/index";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page/index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";

import axios from 'axios';


function App() {
  const {user, isAuthenticated, isLoading} = useSelector(state=>state.auth);
  const dispatch = useDispatch();

  // Restore auth state from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Set default Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch(checkAuth());
    } else {
      // Still need to set loading to false if no token
      dispatch({ type: 'auth/checkAuth/rejected' });
    }
  }, [dispatch]);
  if(isLoading) return  <Skeleton className="w-[800] bg-black h-[600px] w-[600px]" />

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* common component 
      <h1>Header component</h1>
      */}
      <Routes>
      <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="verify-email" element={<EmailVerificationPage />} />
        </Route>

        {/*people related routes */}
        <Route path="/people" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <PeopleLayout/>
          </CheckAuth>
        }>
          <Route path="home" element={<PeopleHome />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
