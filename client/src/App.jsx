import { Routes, Route } from "react-router-dom";
import './App.css'
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import EmailVerificationPage from "./pages/auth/emailverification";
import Dashboard from "./pages/people-view/dashboard";
import PeopleList from "./pages/people-view/peoplelist";
import AddPerson from "./pages/people-view/addperson";
import GroupsAndTags from "./pages/people-view/groupsandtags";
import Analytics from "./pages/people-view/analytics";
import Settings from "./pages/people-view/settings";
import PersonDetails from "./pages/people-view/PersonDetails";
import EditPerson from "./pages/people-view/EditPerson";
import Credits from "./pages/people-view/credits";
import LandingPage from "./pages/people-view/landing-page";

import PeopleLayout from "./components/people-view/layout";
import ForgetPassword from "./pages/auth/forgetpassword";
import ResetPassword from "./pages/auth/reset-password"

import { Skeleton } from "@/components/ui/skeleton"
import NotFound from "./pages/not-found/index";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page/index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth, setLoading } from "./store/auth-slice";
import axios from 'axios';






function App() {
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    const verifyAuth = async () => {
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Add timeout to prevent infinite loading
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth check timeout')), 5000)
          );
          
          await Promise.race([
            dispatch(checkAuth()).unwrap(),
            timeoutPromise
          ]);
        } catch (error) {
          console.log('Auth verification failed:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          delete axios.defaults.headers.common['Authorization'];
          dispatch(setLoading(false));
        }
      } else {
        // No token, immediately set loading to false
        dispatch(setLoading(false));
      }
    };

    verifyAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="w-[800px] h-[600px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} />
          }
        />
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated}>
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="verify-email" element={<EmailVerificationPage />} />
          <Route path="forget-password" element={<ForgetPassword/>}/>
          <Route path="reset-password/:uid/:token" element={<ResetPassword />} />
        </Route>
        <Route path="/people" element={
          <CheckAuth isAuthenticated={isAuthenticated}>
            <PeopleLayout/>
          </CheckAuth>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="list" element={<PeopleList />} />
          <Route path="add" element={<AddPerson />} />
          <Route path=":id" element={<PersonDetails />} />
          <Route path="edit/:id" element={<EditPerson />} />
          <Route path="groups" element={<GroupsAndTags />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="credits" element={<Credits />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App