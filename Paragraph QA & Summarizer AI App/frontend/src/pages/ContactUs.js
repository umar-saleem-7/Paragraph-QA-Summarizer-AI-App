import React from "react";
import "../styles.css";
import logo from "../assets/logo-placeholder.png";
import bgDefault from "../assets/bg-default.jpg"; // Keep your aesthetic background

export default function ContactUs() {
  const authors = [
    {
      name: "Omer Faisal",
      email: "official.omerfaisal@gmail.com",
      linkedin: "https://www.linkedin.com/in/omer-faisal-ab382425b",
      github: "https://github.com/Omer-443",
    },
    {
      name: "Umar Saleem",
      email: "umarsaleem0816@gmail.com",
      linkedin: "https://www.linkedin.com/in/umar-saleem-1a521325b",
      github: "https://github.com/umar-saleem-7",
    },
  ];

  return (
    <div
      className="bg-full d-flex justify-content-center align-items-center fade-in"
      style={{ backgroundImage: `url(${bgDefault})`, minHeight: "100vh" }}
    >
      <div className="card-glass p-5 text-center" style={{ maxWidth: "900px", width: "100%" }}>
        <img src={logo} alt="logo" className="logo-center mb-4" />
        <h2 className="mb-4 fw-bold text-primary">Contact Us</h2>
        <div className="row fade-in">
          {authors.map((author, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="border rounded p-4 bg-light h-100 shadow contact-card">
                <h5 className="fw-bold text-dark mb-3">{author.name}</h5>
                <p>
                  📧{" "}
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${author.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none text-primary link-hover"
                  >
                    {author.email}
                  </a>
                </p>
                <p>
                  💼{" "}
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none text-dark link-hover"
                  >
                    LinkedIn Profile
                  </a>
                </p>
                <p>
                  💻{" "}
                  <a
                    href={author.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none text-dark link-hover"
                  >
                    GitHub 
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
