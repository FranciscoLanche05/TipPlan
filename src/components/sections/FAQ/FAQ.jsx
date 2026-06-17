import styles from './FAQ.module.css';
import FAQAccordion from './FAQAccordion';
import SectionTag from '../../ui/SectionTag/SectionTag';
import { faqData } from '../../../services/data/faq';

export default function FAQ() {
  return (
    <section className={styles.faqSection} id="faq">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <SectionTag>AYUDA</SectionTag>
            <h1 className={styles.title}>
              Preguntas <span className={styles.highlight}>frecuentes</span>
            </h1>
            <p className={styles.description}>
              Todo lo que necesitas saber antes de empezar tu aventura.
            </p>
          </div>
          <div className={styles.imageContainer}>
            <img 
              src="/images/thinking.png" 
              alt="Preguntas frecuentes" 
              className={styles.faqImage}
            />
          </div>
        </div>

        <div className={styles.accordion}>
          {faqData.map((item) => (
            <FAQAccordion
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
