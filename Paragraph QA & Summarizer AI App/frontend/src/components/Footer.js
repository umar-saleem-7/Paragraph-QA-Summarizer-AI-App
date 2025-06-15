import React from "react";
import "../styles.css";

export default function Footer() {
  return (
    <footer className="footer-glass text-white py-3 px-4 d-flex justify-content-between align-items-center">
      <div className="text-start">
        <strong>Author 1</strong><br />
        <a href="mailto:author1@example.com" className="footer-link">author1@example.com</a><br />
        <a href="https://github.com/author1" target="_blank" rel="noreferrer" className="footer-link">GitHub</a> |{" "}
        <a href="https://linkedin.com/in/author1" target="_blank" rel="noreferrer" className="footer-link">LinkedIn</a>
      </div>

      <div className="text-end">
        <strong>Author 2</strong><br />
        <a href="mailto:author2@example.com" className="footer-link">author2@example.com</a><br />
        <a href="https://github.com/author2" target="_blank" rel="noreferrer" className="footer-link">GitHub</a> |{" "}
        <a href="https://linkedin.com/in/author2" target="_blank" rel="noreferrer" className="footer-link">LinkedIn</a>
      </div>
    </footer>
  );
}
