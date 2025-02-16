import React from "react";
import Menu from "./menubar/Menu";

const About = () => {
  return (
    <div className="about-all">
      <div className="about-html">
        <div className="about-body">
          <iframe
            src={`${process.env.PUBLIC_URL}/carousel.html`}
            title="External HTML"
            width="100%"
            height="400px"
            style={{ border: "none" }}
          ></iframe>
          <div className="menubar">
            <Menu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
