import $ from "jquery";
import React, { useEffect } from "react";
import Menu from "./menubar/Menu";
import "./Contact.css";

const Contact = () => {
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
              <div className="stamp"></div>
              <div className="mailme">
                <p>Click and get in touch!</p>
                <p>example@example.com</p>
              </div>
            </div>
            <div className="back">
              <div className="letter">
                <form className="mailform">
                  <div>
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      name="name"
                      size="40"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="emailadress">Email adress</label>
                    <input
                      type="text"
                      name="emailadress"
                      size="40"
                      placeholder="Email adress"
                    />
                  </div>
                  <div>
                    <label htmlFor="message">Message</label>
                    <textarea
                      name="message"
                      cols="40"
                      rows="5"
                      placeholder="Message"
                    ></textarea>
                  </div>
                  <div>
                    <input type="submit" value="Send" />
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
                <p>Message sent!</p>
                <p>Write a new message</p>
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
