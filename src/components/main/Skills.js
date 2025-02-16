import React from "react";
import Menu from "./menubar/Menu";

const Skills = () => {
  return (
    <div className="skills-all">
      <iframe
        src={`${process.env.PUBLIC_URL}/3dcard.html`}
        title="External HTML"
        width="100%"
        height="930vh"
        style={{ border: "none" }}
      ></iframe>
      <div className="menubar">
        <Menu />
      </div>
    </div>
  );
};

export default Skills;
