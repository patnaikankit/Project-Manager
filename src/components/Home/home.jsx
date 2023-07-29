import React from 'react';
import styles from './home.module.css';
import { ArrowRight } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import icon from '../../assets/designer.svg'

export default function Home(){
    const navigate = useNavigate();
    // there will be two cases when a user is either logged in or not
    // if the user is logged in he will be shown Manage else he will be shown lets get started
    // this will be achieved using states
    const handleClick = () => {
        navigate('/login')
    }

    return (
    <div className={styles.container}>
        <div className={styles.headers}>
            <div className={styles.left}>
                <p className={styles.heading}>
                    Project Manager
                </p>
                <p className={styles.tagline}>
                    One stop solution for all software development projects!
                </p>
                <button onClick={handleClick}>Let's Get Started <ArrowRight />{" "}</button>
            </div>
            <div className={styles.right}>
                <img src={icon} alt='icon'/>
            </div>
        </div>
    </div>
    );
}