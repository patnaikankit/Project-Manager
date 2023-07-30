import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, updateUserDb } from '../../firebase.js'
import styles from "./auth.module.css"
import Form from '../InputForm/form.jsx'

export default function Auth(props){
    const isSignup = props.signup ? true : false;

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

    }

    // signup logic
    const handleSignup = () => {
        // check is all the fields are filled
        if(!data.name || !data.email || !data.password){
            setErrorMsg("All field are required!");
            return ;
        }
        // user is has clicked the submit button so it should be disabled
        setButtonDisable(true);
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (response) => {
                // request was processed so button is enabled for the next instance 
                const userId = response.user.uid;
                await updateUserDb({name: data.name, email: data.email}, userId);
                setButtonDisable(false);
            })
            .catch((err) => {
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


                <p className={styles.error}>This is an error!</p>
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
