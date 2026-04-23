import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Welcome to Career Site</h1>
        <p style={styles.subtitle}>Your gateway to career planning and guidance</p>
      </div>

      <div style={styles.cardsContainer}>
        <div 
          style={styles.card}
          onClick={() => navigate("/counsellor/landing")}
        >
          <div style={styles.cardIcon}>📚</div>
          <h2 style={styles.cardTitle}>For Counsellors</h2>
          <p style={styles.cardDescription}>Manage students, create tests, and track progress</p>
          <button style={styles.button}>Get Started</button>
        </div>

        <div 
          style={styles.card}
          onClick={() => navigate("/student/login")}
        >
          <div style={styles.cardIcon}>🎓</div>
          <h2 style={styles.cardTitle}>For Students</h2>
          <p style={styles.cardDescription}>Take tests and explore career paths</p>
          <button style={styles.button}>Get Started</button>
        </div>
      </div>

      <div style={styles.footer}>
        <p>© 2024 Career Site. All rights reserved.</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
  },
  hero: {
    textAlign: "center",
    marginBottom: "60px",
    color: "white",
  },
  title: {
    fontSize: "48px",
    margin: "0 0 20px 0",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "20px",
    margin: "0",
    opacity: "0.9",
  },
  cardsContainer: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "60px",
    width: "100%",
    maxWidth: "900px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px 30px",
    width: "300px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    cursor: "pointer",
  },
  cardIcon: {
    fontSize: "60px",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "24px",
    margin: "0 0 15px 0",
    color: "#333",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "25px",
    lineHeight: "1.6",
  },
  button: {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    padding: "12px 30px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  footer: {
    color: "white",
    textAlign: "center",
    fontSize: "14px",
    opacity: "0.7",
  },
};
