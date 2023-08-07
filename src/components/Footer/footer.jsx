import React from 'react';
import { Twitter, Instagram, Linkedin, GitHub } from 'react-feather';
import styles from './footer.module.css'; 

export default function Footer() {
  return (
    <footer className={`${styles.footer}`}>
      <div className={`p-4 pb-0`}>
        <section className={`mb-4 ${styles.socialIcons}`}>

          <a
            className={`social-icon`}
            href='#!'
            role='button'
          >
            <Twitter size={24} />
          </a>

          <a
            className={`social-icon ${styles.instagram}`}
            href='#!'
            role='button'
          >
            <Instagram size={24} />
          </a>

          <a
            className={`social-icon ${styles.linkedin}`}
            href='#!'
            role='button'
          >
            <Linkedin size={24} />
          </a>

          <a
            className={`social-icon ${styles.github}`}
            href='#!'
            role='button'
          >
            <GitHub size={24} />
          </a>
        </section>
      </div>

      <div className={`${styles.footer}`}>
        © 2020 Copyright:
        <a className={`${styles.textWhite}`} href='https://mdbootstrap.com/'>
          MDBootstrap.com
        </a>
      </div>
    </footer>
  );
}
