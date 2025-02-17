import React from "react";
import Menu from "./menubar/Menu";

const Project = () => {
  return (
    <div className="project-all">
      <div className="project-html">
        <div className="project-body">
          <iframe
            src={`${process.env.PUBLIC_URL}/carousel.html`}
            title="External HTML"
            width="100%"
            height="950px"
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

export default Project;
