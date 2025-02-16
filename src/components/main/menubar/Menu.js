import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "../Home.css";

// Menu 컴포넌트 (GSAP 애니메이션)
const Menu = () => {
  const menuRef = useRef(null);
  const openRef = useRef(null);
  const closeRef = useRef(null);
  const tl = useRef(null);

  useEffect(() => {
    // menuRef 내부의 자식 요소들을 쉽게 선택하기 위한 헬퍼
    const q = gsap.utils.selector(menuRef);

    tl.current = gsap.timeline({ paused: true, duration: 0.3 });
    tl.current.to(q(".btn-container"), { top: "-100%", ease: "circ.out" });
    tl.current.to(
      q(".container"),
      {
        width: "480px",
        height: "550px",
        top: "-25px",
        right: "-25px",
        ease: "back.out(1.8)",
      },
      "<"
    );
    tl.current.to(q(".menu-item"), { opacity: 1 });
    tl.current.fromTo(
      q(".menu li"),
      { opacity: 0, rotateX: "90deg", translateY: 80, translateX: -20 },
      {
        opacity: 1,
        rotateX: 0,
        translateY: 0,
        translateX: 0,
        stagger: 0.1,
        ease: "power4.out",
      },
      "<"
    );
    tl.current.fromTo(
      q(".socials li"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, ease: "power4.out" },
      "<"
    );
  }, []);

  // 클릭 및 키보드 이벤트 핸들러
  const handleOpen = () => {
    tl.current.play();
    closeRef.current.focus();
  };

  const handleClose = () => {
    tl.current.reverse();
    openRef.current.focus();
  };

  const handleOpenKeyUp = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      tl.current.play();
      closeRef.current.focus();
    }
  };

  const handleCloseKeyUp = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      tl.current.reverse();
      openRef.current.focus();
    }
  };

  return (
    <section className="fixed right-8 top-6" ref={menuRef}>
      <div className="container relative">
        <div className="my-2 flex flex-col gap-5 menu-item">
          <ul className="text-5xl flex flex-col gap-y-2 menu">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/skills">Skills</Link>
            </li>
            <li>
              <Link to="/project">Project</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>

          <ul className="text-base socials mt-5">
            <li>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/145/145802.png"
                  alt="Facebook"
                  width="32"
                  height="32"
                />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/makhai92"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://cdn-icons-png.freepik.com/256/3291/3291667.png?ga=GA1.1.577663924.1722660619&semt=ais_hybrid"
                  alt="Github"
                  width="32"
                  height="32"
                />
              </a>
            </li>
            <li>
              <a
                href="http://yangs.dothome.co.kr/portfolio/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://cdn-icons-png.freepik.com/256/351/351456.png?ga=GA1.1.577663924.1722660619&semt=ais_hybrid"
                  alt="Portfolio"
                  width="32"
                  height="32"
                />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://cdn-icons-png.freepik.com/256/2111/2111463.png?ga=GA1.1.577663924.1722660619&semt=ais_hybrid"
                  alt="Instagram"
                  width="32"
                  height="32"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="button-style absolute top-0 right-0">
        <div className="relative w-full h-full btn-container">
          <div
            className="element"
            id="open"
            role="button"
            tabIndex="0"
            ref={openRef}
            onClick={handleOpen}
            onKeyUp={handleOpenKeyUp}
          >
            <div className="w-full h-full absolute menu-contain">
              <span className="front">Menu</span>
              <span className="back" aria-hidden="true">
                Menu
              </span>
            </div>
          </div>
          <div
            className="element"
            id="close"
            role="button"
            tabIndex="0"
            ref={closeRef}
            onClick={handleClose}
            onKeyUp={handleCloseKeyUp}
          >
            <div className="w-full h-full absolute menu-contain">
              <span className="front">Close</span>
              <span className="back" aria-hidden="true">
                Close
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main 컴포넌트 (Three.js Canvas와 Menu를 함께 렌더링)
const Menubar = () => {
  return (
    <div className="main-body">
      <div className="menubar">
        <Menu />
      </div>
    </div>
  );
};

export default Menubar;
