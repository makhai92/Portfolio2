import React, { useRef, useEffect } from "react";
import Menu from "./menubar/Menu";
import "./About.css";

const About = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // ========================= Dot Animation (Canvas) =========================
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let dotCount = 100;
    let pointsRange = Math.min(window.innerWidth, window.innerHeight);
    let baseDotRadius = pointsRange > 300 ? 3 : 1.5;
    const maxLineDistance = pointsRange / 2;
    let xcenter = canvas.width / 2;
    let ycenter = canvas.height / 2;
    let dots = [];
    let alpha = 0,
      beta = 0,
      gamma = 0;
    let betaScrollAddition = 0,
      gammaScrollAddition = 0,
      timedAngleAddition = 0;

    const randomRange = (min, max) => Math.random() * (max - min) + min;

    function Dot(x = null, y = null, z = null) {
      this.radius = baseDotRadius;
      this.opacity = 1;
      this.position = {
        x: x !== null ? x : randomRange(-pointsRange, pointsRange),
        y: y !== null ? y : randomRange(-pointsRange, pointsRange),
        z: z !== null ? z : randomRange(-pointsRange, pointsRange),
      };
      this.initialPosition = { ...this.position };
    }
    Dot.prototype.update = function () {
      // z position
      let one = this.initialPosition.x * -Math.sin(beta);
      let two = this.initialPosition.y * Math.cos(beta) * Math.sin(gamma);
      let three = this.initialPosition.z * Math.cos(beta) * Math.cos(gamma);
      this.position.z = one + two + three;

      let zPercentage = this.position.z / pointsRange;
      this.radius = baseDotRadius + (baseDotRadius / 3) * zPercentage;
      this.opacity = 0.5 + (zPercentage + 1) / 4;
      let depthOfFieldMultiplier = (zPercentage + 1) / 2 + 0.5;

      // x position
      one = this.initialPosition.x * Math.cos(alpha) * Math.cos(beta);
      two =
        this.initialPosition.y *
        (Math.cos(alpha) * Math.sin(beta) * Math.sin(gamma) -
          Math.sin(alpha) * Math.cos(gamma));
      three =
        this.initialPosition.z *
        (Math.cos(alpha) * Math.sin(beta) * Math.cos(gamma) +
          Math.sin(alpha) * Math.sin(gamma));
      this.position.x = (one + two + three) * depthOfFieldMultiplier;

      // y position
      one = this.initialPosition.x * Math.sin(alpha) * Math.cos(beta);
      two =
        this.initialPosition.y *
        (Math.sin(alpha) * Math.sin(beta) * Math.sin(gamma) +
          Math.cos(alpha) * Math.cos(gamma));
      three =
        this.initialPosition.z *
        (Math.sin(alpha) * Math.sin(beta) * Math.cos(gamma) -
          Math.cos(alpha) * Math.sin(gamma));
      this.position.y = (one + two + three) * depthOfFieldMultiplier;
    };

    const renderFrame = () => {
      timedAngleAddition += (0.2 * Math.PI) / 180;
      beta = timedAngleAddition + betaScrollAddition;
      gamma = timedAngleAddition + gammaScrollAddition;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach((dot, index) => {
        dot.update();
        ctx.translate(xcenter + dot.position.x, ycenter + dot.position.y);

        for (let i = index; i < dots.length; i++) {
          let distance = Math.sqrt(
            Math.pow(dots[i].position.x - dot.position.x, 2) +
              Math.pow(dots[i].position.y - dot.position.y, 2) +
              Math.pow(dots[i].position.z - dot.position.z, 2)
          );
          if (distance < maxLineDistance) {
            ctx.lineWidth = 1;
            ctx.strokeStyle =
              "rgba(100, 100, 100, " +
              (1 - distance / maxLineDistance) / 2 +
              ")";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(
              dots[i].position.x - dot.position.x,
              dots[i].position.y - dot.position.y
            );
            ctx.stroke();
          }
        }

        ctx.fillStyle = "rgba(50, 60, 252, " + dot.opacity + ")";
        ctx.beginPath();
        ctx.arc(0, 0, dot.radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

      window.requestAnimationFrame(renderFrame);
    };

    const mouseMoveHandler = (e) => {
      let rect = e.target.getBoundingClientRect();
      let percentageX = (e.clientX - rect.left) / document.body.clientWidth;
      let percentageY = (e.clientY - rect.top) / document.body.clientHeight;
      betaScrollAddition = percentageX * 2 * Math.PI - Math.PI;
      gammaScrollAddition = -(percentageY * 2 * Math.PI) - Math.PI;
    };

    document.body.addEventListener("mousemove", mouseMoveHandler);

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      pointsRange = Math.min(window.innerWidth, window.innerHeight);
      xcenter = canvas.width / 2;
      ycenter = canvas.height / 2;
    };

    window.addEventListener("resize", resizeHandler);

    for (let i = 0; i < dotCount; i++) {
      dots.push(new Dot());
    }
    renderFrame();

    // ========================= Carousel (Drag & Spin) =========================
    // 만약 해당 요소들이 JSX에 포함되어 있다면, document.getElementById를 사용해도 됩니다.
    const odrag = document.getElementById("drag-container");
    const ospin = document.getElementById("spin-container");
    const aImg = ospin ? ospin.getElementsByTagName("img") : [];
    const aVid = ospin ? ospin.getElementsByTagName("video") : [];
    const aEle = ospin ? [...aImg, ...aVid] : [];
    // 이미지 크기 설정
    if (ospin) {
      ospin.style.width = imgWidth + "px";
      ospin.style.height = imgHeight + "px";
    }
    // Ground 크기 설정
    const ground = document.getElementById("ground");
    if (ground) {
      ground.style.width = radius * 3 + "px";
      ground.style.height = radius * 3 + "px";
    }
    // 초기 transform 적용 함수
    function init(delayTime) {
      for (let i = 0; i < aEle.length; i++) {
        aEle[i].style.transform =
          "rotateY(" +
          i * (360 / aEle.length) +
          "deg) translateZ(" +
          radius +
          "px)";
        aEle[i].style.transition = "transform 1s";
        aEle[i].style.transitionDelay =
          delayTime || (aEle.length - i) / 4 + "s";
      }
    }
    // 변수들 (Carousel 전역)
    var radius = 240,
      autoRotate = true,
      rotateSpeed = -60,
      imgWidth = 120,
      imgHeight = 170;
    // auto spin
    if (ospin && autoRotate) {
      var animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
      ospin.style.animation = `${animationName} ${Math.abs(
        rotateSpeed
      )}s infinite linear`;
    }
    // 배경 음악 추가
    var bgMusicURL =
      "https://api.soundcloud.com/tracks/143041228/stream?client_id=587aa2d384f7333a886010d5f52f302a";
    var bgMusicControls = true;
    const musicContainer = document.getElementById("music-container");
    if (bgMusicURL && musicContainer) {
      musicContainer.innerHTML += `
        <audio src="${bgMusicURL}" ${
        bgMusicControls ? "controls" : ""
      } autoplay loop>    
          <p>Your browser does not support the audio element.</p>
        </audio>
      `;
    }
    // setup pointer events for dragging
    if (odrag) {
      document.onpointerdown = function (e) {
        clearInterval(odrag.timer);
        e = e || window.event;
        var sX = e.clientX,
          sY = e.clientY;
        this.onpointermove = function (e) {
          e = e || window.event;
          var nX = e.clientX,
            nY = e.clientY;
          var desX = nX - sX;
          var desY = nY - sY;
          tX += desX * 0.1;
          tY += desY * 0.1;
          applyTransform(odrag);
          sX = nX;
          sY = nY;
        };
        this.onpointerup = function (e) {
          odrag.timer = setInterval(function () {
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.1;
            tY += desY * 0.1;
            applyTransform(odrag);
            playSpin(false);
            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
              clearInterval(odrag.timer);
              playSpin(true);
            }
          }, 17);
          this.onpointermove = this.onpointerup = null;
        };
        return false;
      };

      document.onmousewheel = function (e) {
        e = e || window.event;
        var d = e.wheelDelta / 20 || -e.detail;
        radius += d;
        init(1);
      };
    }
    var tX = 0,
      tY = 10,
      desX = 0,
      desY = 0;
    function applyTransform(obj) {
      if (tY > 180) tY = 180;
      if (tY < 0) tY = 0;
      obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
    }
    function playSpin(yes) {
      if (ospin) ospin.style.animationPlayState = yes ? "running" : "paused";
    }
    // 초기 carousel setup
    if (typeof init === "function") {
      setTimeout(() => {
        init();
      }, 1000);
    }
    // cleanup: 이벤트 제거 (간단히 document.onpointerdown 등 해제)
    return () => {
      document.onpointerdown = null;
      document.onmousewheel = null;
      document.body.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="project-all">
      <div className="project-html">
        <div className="project-body">
          {/* Canvas & Dot Animation */}
          <canvas id="canvas" ref={canvasRef}></canvas>
          <div className="page-wrap">
            <h1>3D Rotation Matrix</h1>
            <p>(move your mouse)</p>
          </div>

          {/* Website Corner Link */}
          <a
            className="website-link"
            href="https://codepen.io/coopergoeke"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="website-link__icon" viewBox="0 0 936.86 1054.94">
              <circle
                cx="468.43"
                cy="607.07"
                r="395.02"
                fill="#fff"
                stroke="#8aa8c5"
                strokeWidth="55"
                strokeMiterlimit="10"
              />
              <path
                d="M235.76 936.24l9.7-135.08c3.7-53.1 43.2-96.01 96.01-93.96h250.85c52.81-2.05 92.33 41.65 96.01 93.96l10.73 135.81s-98.94 65.12-231.06 65.12-232.24-65.85-232.24-65.85z"
                fill="#293b67"
              />
              <circle
                cx="468.43"
                cy="607.07"
                r="395.02"
                fill="none"
                stroke="#8aa8c5"
                strokeWidth="55"
                strokeMiterlimit="10"
              />
              <path
                d="M532.23 716.09c0 23.61-35.44 30-64.23 30s-64.23-8.39-64.23-30V607.76h128.46v108.33z"
                fill="#e2cfbb"
              />
              <path
                d="M532.23 678.63s-35.44 8.46-64.23 8.46-64.23-7.83-64.23-7.83v-130.5h128.46v129.87z"
                fill="#d3c2b2"
              />
              <path
                d="M722.57 326.26c0 193.67-79.11 350.67-255.53 350.67s-253.25-157-253.25-350.67 156.76-210.31 253.25-210.31c126.23 0 255.53 16.64 255.53 210.31z"
                fill="#ffe8cc"
              />
              <path
                d="M604.47 634.6c-11.18 8.23-23.2 15.37-36.06 21.33-29.33 13.58-63.06 20.99-101.38 20.99-31.91 0-60.57-5.14-86.1-14.7-50.16-18.78-88.26-54.66-115.33-102.22-35.3-62.04-51.82-143.95-51.82-233.74 0-83.76 29.32-134.41 70.41-164.91-90.46 362.86 101.1 570.06 320.28 473.25z"
                fill="#f3ddc3"
              />
              <path
                d="M701.59 182.44c-6.72-15.99-8.89-39.53-18.6-51.9-1.69-2.16-6.62-3.91-12.43-5.52-15.99-16.61-43.59-39.48-65.94-49.1-7.45-3.21-49.94-38.95-58.11-41.45-6.06-1.85-3.35 25.38-19.3 18.59-31.38-13.36-71.2-32.91-85.46-34.43-17.17-1.84 6.77 41.39-12.69 41.39-36.11 0-65.27-23.14-82.97-25.55-1.48 22.91-9.35 37.78-24.01 44.8-12.97 6.21-42.51.74-53.19 9.43 8.93 20.86-.31 22.93-1.87 37.18-7.32 3.08-17.47 5.36-17.47 5.36-11.17 13.67-10.86 35.77-18.24 54.03-7.44 18.42-12.96 39.27-16.63 62.75-3.65 23.39-3.52 72.17-3.52 101 0 96.83 56.25-132.84 91.88-160.87 35.63-28.02 164-32.7 164-32.7S620 163.71 648.95 193.9c28.95 30.18 75.9 249.36 75.9 160.96 0-59.25-7.63-135.22-23.26-172.42z"
                fill="#f2cf6f"
              />
              <path
                d="M441.75 18.63c-15.02-1.61 1.38 31.23-7.26 39.53 15.28-3.58 10.26-39.58 7.26-39.53z"
                fill="#d8b45c"
              />
              <path
                d="M346.09 34.47c-1.48 22.91-12.06 43.85-33.99 47.54 12.81-1.1 21.29 3.03 34.75-2.18 17.45-6.76 16.94-42.95-.76-45.36z"
                fill="#d8b45c"
              />
              <path
                d="M268.89 88.7c8.93 20.86-.31 22.93-1.87 37.18-7.32 3.08-17.47 5.36-17.47 5.36-11.17 13.67-10.86 35.77-18.24 54.03-7.44 18.42-12.96 39.27-16.63 62.75-3.65 23.39 15.73-33.35 48.77-64.39 32.36-30.39 16.12-103.62 5.44-94.93z"
                fill="#d8b45c"
              />
              <path
                d="M505.31 460.4c0-10.8-16.63-19.55-37.14-19.55s-37.14 8.75-37.14 19.55 74.28 10.79 74.28 0z"
                fill="#d3bfae"
              />
              <path
                d="M330.65 366.32c28.67-30.62 53.86-31.06 82.1 0"
                fill="none"
                stroke="#000"
                strokeWidth="14"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
              <path
                d="M521.65 366.32c28.67-30.62 53.86-31.06 82.1 0"
                fill="none"
                stroke="#000"
                strokeWidth="14"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
              <path
                d="M468.01 617.93c-35.42 0-71.93-28.05-71.93-55.82 0-12.56 10.52-18.84 23.38-18.84h97.43c12.86 0 23.38 6.31 23.38 18.84 0 30.2-36.84 55.82-72.26 55.82z"
                fill="#824446"
              />
              <defs>
                <path
                  id="a"
                  d="M468.01 617.93c-35.42 0-71.93-28.05-71.93-55.82 0-12.56 10.52-18.84 23.38-18.84h97.43c12.86 0 23.38 6.31 23.38 18.84 0 30.2-36.84 55.82-72.26 55.82z"
                />
              </defs>
              <clipPath id="b">
                <use xlinkHref="#a" overflow="visible" />
              </clipPath>
              <circle
                cx="468.17"
                cy="614.05"
                r="30"
                clipPath="url(#b)"
                fill="#f37879"
              />
            </svg>
            <span className="website-link__name">
              Cooper <span className="website-link__last-name">Goeke</span>
            </span>
            <span className="website-link__message">
              Check out more of my work
            </span>
          </a>

          {/* ================= Carousel Section ================= */}
          <div id="drag-container">
            <div id="spin-container">
              {/* 이미지들 (또는 영상) */}
              <img
                src="https://images.pexels.com/photos/206395/pexels-photo-206395.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                alt=""
              />
              <img
                src="https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                alt=""
              />
              <img
                src="https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                alt=""
              />
              <img
                src="https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                alt=""
              />
              <img
                src="https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                alt=""
              />
              <img
                src="https://images.pexels.com/photos/1462636/pexels-photo-1462636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                alt=""
              />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
              >
                <img
                  src="https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                  alt=""
                />
              </a>
              <video controls autoPlay loop>
                <source
                  src="https://player.vimeo.com/external/322244668.sd.mp4?s=338c48ac2dfcb1d4c0689968b5baf94eee6ca0c1&profile_id=165&oauth2_token_id=57447761"
                  type="video/mp4"
                />
              </video>
              <p>3D Tiktok Carousel</p>
            </div>
            <div id="ground"></div>
          </div>
          <div id="music-container"></div>
          <div className="menubar">
            <Menu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
