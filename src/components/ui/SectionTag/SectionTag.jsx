import styles from './SectionTag.module.css';

export default function SectionTag({ children }) {
  return <span className={styles.tag}>{children}</span>;
}
