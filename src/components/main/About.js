import React, { useRef, useEffect } from "react";
import Menu from "./menubar/Menu";
import "./About.css"; // 필요한 CSS 파일

const About = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // 캔버스 초기 크기 설정
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 변수들 선언
    const dotCount = 100;
    let pointsRange = Math.min(window.innerWidth, window.innerHeight);
    let baseDotRadius = pointsRange > 300 ? 3 : 1.5;
    const maxLineDistance = pointsRange / 2;
    let xcenter = canvas.width / 2;
    let ycenter = canvas.height / 2;
    let dots = [];
    let alpha = 0;
    let beta = 0;
    let gamma = 0;
    let betaScrollAddition = 0;
    let gammaScrollAddition = 0;
    let timedAngleAddition = 0;

    // Helper function
    const randomRange = (min, max) => Math.random() * (max - min) + min;

    // Dot Class
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
      // z position 업데이트
      let one = this.initialPosition.x * -Math.sin(beta);
      let two = this.initialPosition.y * Math.cos(beta) * Math.sin(gamma);
      let three = this.initialPosition.z * Math.cos(beta) * Math.cos(gamma);
      this.position.z = one + two + three;

      // z 값에 따른 깊이 효과
      let zPercentage = this.position.z / pointsRange;
      this.radius = baseDotRadius + (baseDotRadius / 3) * zPercentage;
      this.opacity = 0.5 + (zPercentage + 1) / 4;
      let depthOfFieldMultiplier = (zPercentage + 1) / 2 + 0.5;

      // x position 업데이트
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

      // y position 업데이트
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

    // 애니메이션 렌더 함수
    const renderFrame = () => {
      timedAngleAddition += (0.2 * Math.PI) / 180;
      beta = timedAngleAddition + betaScrollAddition;
      gamma = timedAngleAddition + gammaScrollAddition;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach((dot, index) => {
        dot.update();
        ctx.translate(xcenter + dot.position.x, ycenter + dot.position.y);

        // 점들 사이에 선 그리기
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

        // 점 그리기
        ctx.fillStyle = "rgba(50, 60, 252, " + dot.opacity + ")";
        ctx.beginPath();
        ctx.arc(0, 0, dot.radius, 0, 2 * Math.PI);
        ctx.fill();

        // 변환 행렬 리셋
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

      window.requestAnimationFrame(renderFrame);
    };

    // 마우스 움직임 이벤트 리스너
    const mouseMoveHandler = (e) => {
      let rect = e.target.getBoundingClientRect();
      let percentageX = (e.clientX - rect.left) / document.body.clientWidth;
      let percentageY = (e.clientY - rect.top) / document.body.clientHeight;
      betaScrollAddition = percentageX * 2 * Math.PI - Math.PI;
      gammaScrollAddition = -(percentageY * 2 * Math.PI) - Math.PI;
    };

    document.body.addEventListener("mousemove", mouseMoveHandler);

    // 창 크기 변경 이벤트 리스너
    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      pointsRange = Math.min(window.innerWidth, window.innerHeight);
      xcenter = canvas.width / 2;
      ycenter = canvas.height / 2;
    };

    window.addEventListener("resize", resizeHandler);

    // 초기 점 생성
    for (let i = 0; i < dotCount; i++) {
      dots.push(new Dot());
    }

    // 애니메이션 시작
    renderFrame();

    // 컴포넌트 언마운트 시 이벤트 제거
    return () => {
      document.body.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []); // 의존성 배열이 빈 배열이므로 마운트 시 한 번만 실행

  return (
    <div className="about-all">
      <div className="about-html">
        <div className="about-body">
          <canvas id="about-canvas" ref={canvasRef}></canvas>
          <div className="about-page-wrap">
            <div className="about-content">
              <iframe
                src={`${process.env.PUBLIC_URL}/3Dpicture.html`}
                title="External HTML"
                width="100%"
                height="500vh"
                style={{ border: "none", marginBottom: "7%" }}
              ></iframe>
              <h1>About Me</h1>
              <p className="intro-text">
                "안녕하세요, 개발자를 꿈꾸는 양창모입니다."
              </p>

              <p className="description">
                우직하게 목표를 향해 지나온 하루하루가 쌓여 즐거움 가득 고민한
                걸음씩 내딛은 도전의 발자취는 결국 꿈에 이르는 길입니다.
                끊임없는 고민과 도전 속에서 우리는 예상치 못한 깊은 깨달음을
                얻고,
              </p>
              <p className="description">
                그 깨달음은 우리를 한층 더 성숙하게 만듭니다. 어려움 속에서도 매
                순간 배우고, 실패를 통해 성장하는 경험들이 모여 오늘의 나를
                만들어줍니다.
              </p>

              <p className="description">
                앞으로도 저는 변화하는 세상 속에서 매일 한 걸음씩, 자신을
                갈고닦으며, 모두를 위한 최상의 해결책을 찾는 개발자가
                되겠습니다.
              </p>
            </div>
          </div>

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

          <div className="menubar">
            <Menu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
