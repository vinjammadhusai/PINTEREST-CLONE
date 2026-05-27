export default function Home() {
  return (
    <div>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>MyWebsite</h2>

        <div style={styles.links}>
          <a href="#" style={styles.link}>Home</a>
          <a href="#" style={styles.link}>About</a>
          <a href="#" style={styles.link}>Contact</a>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={styles.content}>
        <h1>Welcome to My Website 🚀</h1>
        <p>This is my first Next.js website</p>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#111",
    color: "white",
  },
  logo: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },
  content: {
    textAlign: "center",
    marginTop: "80px",
  },
};