import React from "react";
import styles from "./account.module.css"
import Form from "../InputForm/form.jsx";
import { Camera, LogOut, Edit2, Trash, GitHub, Paperclip } from "react-feather";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { Navigate } from "react-router-dom";

export default function Account(props){
    const userDetails = props.userDetails;
    const isAuth = props.auth;

    // logout logic
    const handleLogout = async () => {
        await signOut(auth);
    }

    return isAuth ? (
        <div className={styles.container}>
            <div className={styles.header}>
                <p className={styles.heading}>
                    Welcome <span>{userDetails.name}</span>
                </p>

                <div className={styles.logout} onClick={handleLogout}>
                    <LogOut /> Logout
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.title}>
                    Your profile
                </div>
                <div className={styles.profile}>
                    <div className={styles.left}>
                        <div className={styles.image}>
                            <img src=""  alt="Profile photo"/>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.row}>
                            <Form label="Name" 
                                  placeholder="John Doe"
                            />
                            <Form 
                                label="Title" 
                                placeholder="eg. Full Stack Developer"
                            />
                        </div>
                        <div className={styles.row}>
                            <Form 
                                label="Github" 
                                placeholder="Enter your github profile"
                            />
                            <Form 
                                label="LinkedIn" 
                                placeholder="Enter your linkedin profile"
                            />
                        </div>
                        <button className={styles.saveButton}>Save Details</button>
                    </div>
                </div>
            </div>
        </div>
    ) : (<Navigate to='/'/>
    );
}