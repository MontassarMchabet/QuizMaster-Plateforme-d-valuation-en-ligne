import React from "react";

const Footer = () => {
  return (
    <footer className="content-footer footer bg-footer-theme">
      <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
        <div className="mb-2 mb-md-0">
          © copyright 2023
          <a href="#" target="_blank" className="footer-link fw-bolder ml-1">
            {" "}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
