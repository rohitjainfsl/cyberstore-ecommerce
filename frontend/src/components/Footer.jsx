const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "auto" }}>
      <p>&copy; {currentYear} CyberStore. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
