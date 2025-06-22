import React from 'react';
import styles from '../styles/TestCard.module.css';

const TestCard = ({ title, subtitle = "Free Mock Test" }) => (
  <div className={styles.card}>
    <h3>{title}</h3>
    <p>{subtitle}</p>
    <button className={styles.startButton}>Start Test</button>
  </div>
);

export default TestCard;
