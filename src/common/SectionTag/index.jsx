import styles from './style.module.scss';

// Section marker: a mustard tag hanging from the section's top rule at the
// left frame line, and a corner bracket at the top-right. The parent section
// must be positioned (every section already is).
export default function SectionTag({ children }) {
  return (
    <>
      <span className={styles.tag}>{children}</span>
      <span className={styles.corner} aria-hidden="true" />
    </>
  );
}
