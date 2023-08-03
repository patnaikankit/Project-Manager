// this modal function will ensure that whenever the project form is clicked that the box will be the highlight and rest of the things will be slightly dimmer
import React from "react";
import styles from './modal.module.css'

export default function Modal(props){
    return (
        <div
      className={styles.container}
      onClick={() => (props.onClose ? props.onClose() : "")}
    >
      <div
        className={styles.inner}
        onClick={(event) => event.stopPropagation()}
      >
        {props.children}
      </div>
    </div>
    );
}