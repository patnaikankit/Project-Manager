// this user input form format will be used for different purposes
import React, { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import styles from "./form.module.css"

export default function Form({label, isPassword, ...props}){
    const [visible, isvisible] = useState(false)
    return (
        <div className={styles.container}>
        {/* label -  to provide the basic stub code for the form */}
          {label && <label>{label}</label>}
          <div className={styles.inputContainer}>
            <input
              type={isPassword ? (visible ? "text" : "password") : "text"}
            // spread opertor to handle data provided via input 
              {...props}
            />
            {/* only if the isPassword is enabled in the form then all the features of the password section will be applicable */}
            {isPassword && (
              <div className={styles.icon}>
                {visible ? (
                  <EyeOff onClick={() => isvisible((prev) => !prev)} />
                ) : (
                  <Eye onClick={() => isvisible((prev) => !prev)} />
                )}
              </div>
            )}
          </div>
        </div>
      );;
}