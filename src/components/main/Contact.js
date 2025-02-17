import $ from "jquery";
import React, { useState, useEffect } from "react";
import Menu from "./menubar/Menu";
import emailjs from "emailjs-com";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 폼 제출 핸들러 (emailjs 사용)
  const handleSubmit = (event) => {
    event.preventDefault();

    // EmailJS 서비스 정보
    const serviceID = "lucky92";
    const templateID = "template_f02m4h9";
    const publicKey = "1RNc-JVK21uORNll7";

    // EmailJS 전송 요청
    emailjs.send(serviceID, templateID, formData, publicKey);

    // 애니메이션 전환
    $(".envelope").removeClass("open").addClass("send");
  };
  useEffect(() => {
    // jQuery 코드 원본을 그대로 실행
    if (!$(".envelope").hasClass("open")) {
      $(".envelope").click(function () {
        $(this).removeClass("new").addClass("open");
      });
    }

    $(".mailform input, .mailform textarea")
      .on("keyup", function () {
        if (this.value !== "") {
          $(this).prev("label").addClass("show");
        } else {
          $(this).prev("label").removeClass("show");
        }
      })
      .on("focus", function () {
        $(this).prev("label").addClass("focus");
      })
      .on("blur", function () {
        $(this).prev("label").removeClass("focus");
      });

    $(".notification")
      .find("p")
      .last()
      .click(function () {
        $(this)
          .closest(".notification")
          .prev(".envelope")
          .removeClass("send")
          .addClass("new");
        $(this)
          .closest(".notification")
          .prev(".envelope")
          .find(".mailform")[0]
          .reset();
        $(this)
          .closest(".notification")
          .prev(".envelope")
          .find("label")
          .removeClass("show");
      });

    $(".mailform").submit(function (event) {
      event.preventDefault();

      $(this).closest(".envelope").removeClass("open").addClass("send");

      // 여기에 AJAX 폼 제출 코드를 추가할 수 있습니다.
    });
  }, []);

  return (
    <div className="contact-all">
      <div className="contact-html">
        <div className="contact-body">
          <div className="envelope new">
            <div className="front">
              <div className="stamp">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/8052/8052663.png"
                  alt="stamp"
                  className="stamp-image"
                />
              </div>
              <div className="mailme">
                <p>누르고 연락주세요!</p>
                <p>makkai9210@gmail.com</p>
              </div>
            </div>
            <div className="back">
              <div className="letter">
                <form className="mailform" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name">이름</label>
                    <input
                      type="text"
                      name="name"
                      size="40"
                      placeholder="이름"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="emailadress">Email 주소</label>
                    <input
                      type="text"
                      name="email"
                      size="40"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message">내용</label>
                    <textarea
                      name="message"
                      cols="40"
                      rows="5"
                      placeholder="내용"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div>
                    <input type="submit" value="보내기" />
                  </div>
                </form>
              </div>
              <div className="flap left-flap"></div>
              <div className="flap right-flap"></div>
              <div className="flap bottom-flap"></div>
              <div className="flap top-flap"></div>
            </div>
          </div>
          <div className="notification">
            <div>
              <div>
                <p>메일 전송완료!</p>
                <p>새로운 메일 작성</p>
              </div>
            </div>
          </div>
          <div className="menubar">
            <Menu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
