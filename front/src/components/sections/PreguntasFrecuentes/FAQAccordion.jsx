import { useState } from 'react';
import styles from './FAQ.module.css';

export default function FAQAccordion({ id, question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.accordionItem}>
      <button
        className={`${styles.accordionHeader} ${isOpen ? styles.active : ''}`}
        onClick={toggleAccordion}
        aria-expanded={isOpen}
      >
        <span className={styles.question}>{question}</span>
        <span className={styles.icon}>+</span>
      </button>
      {isOpen && (
        <div className={styles.accordionContent}>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
