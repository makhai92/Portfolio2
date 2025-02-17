import React, { useEffect } from "react";
import Menu from "./menubar/Menu";
import "./Skills.css";

// TagCloud 라이브러리 import
import "https://cdn.jsdelivr.net/npm/TagCloud@2.2.0/dist/TagCloud.min.js";

const Skills = () => {
  useEffect(() => {
    const texts = [
      "HTML",
      "CSS3",
      "JAVASCRIPT",
      "React",
      "Jquery",
      "Ajax",
      "Java",
      "Eclipse",
      "Jsp&Servlet",
      "Spring",
      "SpringBoot",
      "Maven",
      "Mybatis",
      "Oracle",
      "VS Code",
      "STS",
      "Linux",
      "ApacheTomcat",
      "AWS",
      "Github",
      "Rest API",
      "Deploy",
      "SQL",
    ];

    // TagCloud 초기화
    window.TagCloud(".sphere", texts, {
      radius: 400,
      maxSpeed: "normal",
      initSpeed: "fast",
      direction: 175,
      keep: true,
    });

    // 텍스트 색상 설정
    document.querySelector(".sphere").style.color = "#FF5733";
  }, []);

  return (
    <div className="skills-all">
      <div className="menubar">
        <Menu />
      </div>
      <div className="sphere"></div>
    </div>
  );
};

export default Skills;
