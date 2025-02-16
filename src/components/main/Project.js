import React, { useRef, useEffect } from "react";
import "./About.css";

const About = () => {
  const dragRef = useRef(null);

  useEffect(() => {
    // ==================== Global Variables ====================
    let radius = 240; // how big of the radius
    const autoRotate = true; // auto rotate or not
    const rotateSpeed = -60; // unit: seconds/360 degrees
    const imgWidth = 120; // width of images (px)
    const imgHeight = 170; // height of images (px)
    const bgMusicURL =
      "https://api.soundcloud.com/tracks/143041228/stream?client_id=587aa2d384f7333a886010d5f52f302a";
    const bgMusicControls = true; // Show UI music control

    // ==================== Start Carousel ====================
    // Start animation after 1000 milliseconds
    setTimeout(init, 1000);

    const odrag = dragRef.current;
    if (!odrag) return;
    const ospin = odrag.querySelector("#spin-container");
    if (!ospin) return;
    const aImg = ospin.getElementsByTagName("img");
    const aVid = ospin.getElementsByTagName("video");
    const aEle = [...aImg, ...aVid]; // combine arrays

    // Set size of spin-container
    ospin.style.width = imgWidth + "px";
    ospin.style.height = imgHeight + "px";

    // Set size of ground (depends on radius)
    const ground = odrag.querySelector("#ground");
    if (ground) {
      ground.style.width = radius * 3 + "px";
      ground.style.height = radius * 3 + "px";
    }

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

    function applyTransform(obj) {
      if (tY > 180) tY = 180;
      if (tY < 0) tY = 0;
      obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
    }

    function playSpin(yes) {
      ospin.style.animationPlayState = yes ? "running" : "paused";
    }

    let sX,
      sY,
      nX,
      nY,
      desX = 0,
      desY = 0,
      tX = 0,
      tY = 10;

    // Auto spin
    if (autoRotate) {
      const animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
      ospin.style.animation = `${animationName} ${Math.abs(
        rotateSpeed
      )}s infinite linear`;
    }

    // Add background music
    const musicContainer = document.getElementById("music-container");
    if (bgMusicURL && musicContainer) {
      musicContainer.innerHTML += `
          <audio src="${bgMusicURL}" ${
        bgMusicControls ? "controls" : ""
      } autoPlay loop>
            <p>If you are reading this, it is because your browser does not support the audio element.</p>
          </audio>
        `;
    }

    // Setup pointer events
    document.onpointerdown = function (e) {
      clearInterval(odrag.timer);
      e = e || window.event;
      let sX = e.clientX,
        sY = e.clientY;

      this.onpointermove = function (e) {
        e = e || window.event;
        let nX = e.clientX,
          nY = e.clientY;
        let dX = nX - sX;
        let dY = nY - sY;
        tX += dX * 0.1;
        tY += dY * 0.1;
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
      let d = e.wheelDelta / 20 || -e.detail;
      radius += d;
      init(1);
    };

    // Cleanup event handlers on unmount
    return () => {
      document.onpointerdown = null;
      document.onmousewheel = null;
    };
  }, []);

  return (
    <div className="project-all">
      <div className="project-html">
        <div className="project-body">
          <div className="drag-container">
            <div className="spin-container">
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

          <a
            href="https://github.com/HoangTran0410/3DCarousel"
            target="_blank"
            rel="noopener noreferrer"
            className="github-corner"
            aria-label="View source on GitHub"
          >
            <svg
              className="github-corner__icon"
              viewBox="0 0 250 250"
              style={{
                fill: "#fff",
                color: "#000",
                position: "absolute",
                top: 0,
                border: 0,
                right: 0,
              }}
              aria-hidden="true"
            >
              <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
              <path
                d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
                fill="currentColor"
                style={{ transformOrigin: "130px 106px" }}
                className="octo-arm"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
