import React, { ReactNode } from 'react';
import Header from './Header';
import styles from '../styles/Home.module.css';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.container}>
      <Header></Header>
      <main className={styles.main}>
        {
          children
        }
      </main>
    </div>
  );
};

export default Layout;
