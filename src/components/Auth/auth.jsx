import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, updateUserDb } from '../../firebase.js'
import styles from "./auth.module.css"
import Form from '../InputForm/form.jsx'

export default function Auth(props){
    const isSignup = props.signup ? true : false;
    const navigate = useNavigate();

    // to store user data
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    // to show the appropriate error message
    const [errorMsg, setErrorMsg] = useState("");
    // once the user has clicked the submit button, the button should be disabled so that the request can be processed
    const [buttonDisable, setButtonDisable] = useState(false);

    // login logic
    const handleLogin = () => {
        // check if all the fields are filled
        if(!data.email || !data.password){
            setErrorMsg("All field are required!");
            return ;
        }
        // user has clicked the submit button so it should be disabled
        setButtonDisable(true);
        // in case of signin just check if the user exists in the db or not
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then(async () => {
                setButtonDisable(false);
                navigate("/");
            })
            .catch((err) => {
                // submit button enabled so the user can retry and issue will be displayed
                setButtonDisable(false);
                setErrorMsg(err.message);
            })
    }

    // signup logic
    const handleSignup = () => {
        // check is all the fields are filled
        if(!data.name || !data.email || !data.password){
            setErrorMsg("All field are required!");
            return ;
        }
        // user has clicked the submit button so it should be disabled
        setButtonDisable(true);
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (response) => {
                // request was processed so button is enabled for the next instance 
                const userId = response.user.uid;
                // new entry should be created in the db when there is a signup
                await updateUserDb({name: data.name, email: data.email}, userId);
                setButtonDisable(false);
                navigate("/");
            })
            .catch((err) => {
                // submit button enabled so the user can retry and issue will be displayed
                setButtonDisable(false);
                setErrorMsg(err.message);
            })
    }

    // Data submission
    const handleClick = (event) => {
        event.preventDefault();
        if(isSignup){
            handleSignup();
        }
        else{
            handleLogin();
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleClick}>
                <p className={styles.homelink}>
                <Link to='/'>{"< Back to home"}</Link>
                </p>
                <p className={styles.heading}>
                    {isSignup ? "Signup" : "Login"}
                </p>


                {isSignup &&
                    (<Form label="Name" 
                           placeholder="Enter your name"
                           onChange={(event) =>
                                setData((prev) => ({ ...prev, name: event.target.value }))
                            } 
                        />)
                }
                <Form label="Email" 
                      placeholder="Enter your email"
                      onChange={(event) =>
                            setData((prev) => ({ ...prev, email: event.target.value }))
                        }  
                      />
                <Form label="Password" 
                      placeholder="Enter your password" 
                      isPassword
                      onChange={(event) =>
                            setData((prev) => ({ ...prev, password: event.target.value }))
                        }   
                      />

                {/*in case there is an error made by the user or there is any issue with the server - it will be displayed here  */}
                <p className={styles.error}>{errorMsg}</p>

                <button type="submit" disabled={buttonDisable}>{isSignup ? "Signup" : "Login"}</button>
                <div className={styles.bottom}>
                    {isSignup ? (
                        <p>Already have an account? <Link to='/login'>Login here</Link></p>
                    ) : (
                        <p>New here? <Link to='/signup'>Create an account</Link></p>
                    )}
                </div>
            </form>
        </div>
    );
}
