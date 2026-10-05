import React from "react";

export default function StyleGuide() {
  return (
    <div style={styles.page}>
      <header style={styles.nav}>
        <div style={styles.navLogo}>My App</div>
        <nav style={styles.navLinks}>
          <span style={styles.navItem}>Home</span>
          <span style={styles.navItem}>Campaigns</span>
          <span style={styles.navItem}>Characters</span>
        </nav>
      </header>

      <section style={styles.section}>
        <h2 style={styles.secondaryHeading}>Color Palette</h2>
        <div style={styles.swatchRow}>
          <ColorSwatch label="Primary" color="#2F4F3A" />
          <ColorSwatch label="Accent" color="#B4473A" />
          <ColorSwatch label="Neutral Light" color="#E8E2D6" />
          <ColorSwatch label="Neutral Dark" color="#2B2B2B" />
        </div>
      </section>

      <section style={styles.section}>
        <h1 style={styles.primaryHeading}>My Heading</h1>
        <h2 style={styles.secondaryHeading}>My Secondary Heading</h2>
        <p style={styles.bodyText}>
          This is body text. It demonstrates the default font, spacing, and
          readability for the application.
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>My List Item</li>
          <li style={styles.listItem}>Another List Item</li>
        </ul>
      </section>

      <section style={styles.section}>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" /> My Checkbox
        </label>

        <input
          type="text"
          placeholder="My Text Input"
          style={styles.textInput}
        />

        <select style={styles.dropdown}>
          <option>My Dropdown Option</option>
          <option>Another Option</option>
        </select>
      </section>

      <section style={styles.section}>
        <button style={styles.primaryButton}>My Primary Button</button>
        <button style={styles.secondaryButton}>My Secondary Button</button>
      </section>

      <section style={styles.section}>
        <div style={styles.card}>
          <h3 style={styles.cardHeading}>My Card</h3>
          <p style={styles.bodyText}>
            This is a simple card or panel component that reflects the overall
            visual style.
          </p>
        </div>
      </section>
    </div>
  );
}

function ColorSwatch({ label, color }: { label: string; color: string }) {
  return (
    <div style={styles.swatch}>
      <div style={{ ...styles.swatchColor, backgroundColor: color }} />
      <span style={styles.swatchLabel}>{label}</span>
      <span style={styles.swatchHex}>{color}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "Arial, sans-serif",
    padding: "32px",
    backgroundColor: "#F7F5F0",
    color: "#2B2B2B",
  },
  section: {
    marginTop: "32px",
    marginBottom: "32px",
  },
  primaryHeading: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#2F4F3A",
    marginBottom: "16px",
  },
  secondaryHeading: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#B4473A",
    marginBottom: "12px",
  },
  bodyText: {
    fontSize: "16px",
    lineHeight: "1.5",
    marginBottom: "12px",
  },
  list: {
    paddingLeft: "20px",
    marginTop: "8px",
  },
  listItem: {
    marginBottom: "8px",
    fontSize: "16px",
  },
  checkboxLabel: {
    display: "block",
    marginBottom: "16px",
    fontSize: "16px",
  },
  textInput: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #2F4F3A",
    marginBottom: "16px",
    width: "260px",
    backgroundColor: "#FFFFFF",
  },
  dropdown: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #2F4F3A",
    marginBottom: "16px",
    width: "260px",
    backgroundColor: "#FFFFFF",
  },
  primaryButton: {
    backgroundColor: "#2F4F3A",
    color: "#FFFFFF",
    padding: "12px 20px",
    borderRadius: "6px",
    border: "none",
    marginRight: "12px",
    cursor: "pointer",
    fontSize: "16px",
  },
  secondaryButton: {
    backgroundColor: "#B4473A",
    color: "#FFFFFF",
    padding: "12px 20px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #DDD",
    maxWidth: "380px",
  },
  cardHeading: {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "10px",
    color: "#2F4F3A",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2F4F3A",
    color: "#FFFFFF",
    padding: "16px 24px",
    borderRadius: "8px",
  },
  navLogo: {
    fontSize: "20px",
    fontWeight: 700,
  },
  navLinks: {
    display: "flex",
    gap: "20px",
  },
  navItem: {
    cursor: "pointer",
    fontSize: "16px",
  },
  swatchRow: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    marginTop: "16px",
  },
  swatch: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "120px",
  },
  swatchColor: {
    width: "100%",
    height: "60px",
    borderRadius: "6px",
    marginBottom: "8px",
  },
  swatchLabel: {
    fontWeight: 600,
    fontSize: "14px",
  },
  swatchHex: {
    fontSize: "13px",
    color: "#555555",
  },
};
