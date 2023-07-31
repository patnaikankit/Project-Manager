import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Home from './components/Home/home.jsx'
import Auth from './components/Auth/auth.jsx'
import { auth, getUserDb } from './firebase'
import Spinner from './components/Spinner/spinner.jsx'
import Account from './components/Account/account.jsx'

function App() {
  // the state will be changed to true if the user is authenticated
  const [isAuth, setIsAuth] = useState(false);
  // retriving user data in order for redirecting them to their account
  const [userDetails, setUserDetails] = useState({});
  // there is slight delay in authticating when the page is refreshed so it first shows the unauthenticated home page then the authenticated home page
  const [isDataLoaded, setDataLoaded] = useState(false);

  const fetchUserDetails = async (uid) => {
    const userDetails = await getUserDb(uid);
    setUserDetails(userDetails);
    setDataLoaded(true);
  }

  {/* to check if the user is authenticated or not */}
  useEffect(() => {
    const check = auth.onAuthStateChanged((user) => {
      // if data provided doesn't exist in the db
      if(!user){
        setDataLoaded(true);
        setIsAuth(false);
        return ;
      }
      // if user is successfully signedup/login
      setIsAuth(true);
      fetchUserDetails(user.uid);
    });

    return () => check();
  }, []);

  return (
    <div className='App'>
      <Router>
      {isDataLoaded ?
        (<Routes>
          {/* the login/signup will only appear if the user is unauthenticated */}
          {
            !isAuth && <>
              <Route path="/login" element={<Auth />}/>
              <Route path="/signup" element={<Auth signup/>}/>
            </>
          }
          <Route path="/" element={<Home auth={isAuth}/>}/>
          <Route path="/account" element={<Account userDetails={userDetails} auth={isAuth}/>}/>
          <Route path="/" element={<Navigate to='/'/>}/>
        </Routes>) 
        : (
          <div className="spinner">
            <Spinner />
          </div>
        )}
      </Router>
    </div>
  )
}

export default App
