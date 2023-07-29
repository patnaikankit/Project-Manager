import React from "react";
import styles from "./auth.module.css"
import Form from '../InputForm/form.jsx'

export default function Auth(props){
    var isSignup; 
    if(props.signup){
        isSignup = true;
     }
     else{
        isSignup = false;
     }
    return (
        <div className={styles.container}>
            <p className={styles.homelink}>{"< Back to Home!"}</p>
            <form className={styles.form}>
                <p className={styles.heading}>
                    {isSignup ? "Sign-Up" : "Login"}
                </p>
                <Form />
                <Form label={"password"} isPassword/>
            </form>
        </div>
    );
}