import { useRef } from "react";
import { useAsyncFn } from "react-use";
import { useRouter } from "next/router";

export default function Contact() {
  const fullNameRef = useRef();
  const emailRef = useRef();
  const messageRef = useRef();
  const router = useRouter();

  const [, creatEmail] = useAsyncFn(async () => {
    if (
      !emailRef.current.value ||
      !fullNameRef.current.value ||
      !messageRef.current.value
    )
      return;

    const content = `<html>
    <body>
        <p>
            <div>
                <label>From</label>
                ${emailRef.current.value}
            </div>
            <div>
                <label>Full Name</label>
                ${fullNameRef.current.value}
            </div>
            <div>
                <label>Message</label>
                ${messageRef.current.value}
            </div>
        </p>
    </body>
    </html>`;

    await fetch(
      "https://api-gateway.uptradeit.com/api/message_books/createemail",
      {
        method: "POST",
        headers: {
          ["Content-Type"]: "application/json",
        },
        body: JSON.stringify({
          toEmail: emailRef.current.value,
          content,
          nickName: "",
          subject: "Customer Message",
        }),
      }
    );

    router.push("/");
  }, [router]);

  return (
    <main className="contact-page">
      <div className="title-container">
        <h1>Contact us?</h1>
      </div>
      <div className="content-container">
        <div className="contact-card">
          <h2>Send us message</h2>
          <div className="card-content">
            <form action="#">
              <div className="name-fields">
                <div className="card-content-field">
                  <label>Full Name:</label>
                  <input type="text" ref={fullNameRef} />
                </div>
                <div className="card-content-field">
                  <label>Email:</label>
                  <input type="email" ref={emailRef} />
                </div>
              </div>
              <div className="card-content-field">
                <label>Message:</label>
                <input
                  type="text"
                  className="multiline-input"
                  ref={messageRef}
                />
              </div>

              <div className="button-container">
                <button onClick={creatEmail}>Submit</button>
              </div>
            </form>
            <div className="card-description">
              <div>
                <h3>We are located at</h3>
                <div>
                  UP Trade Technologies 550 S Watters Rd Suite 276 Allen, TX
                  75013
                </div>
              </div>
              <div>
                <h3>Hours</h3>
                <div>M-F: 9am to 5pm Saturday: CLOSED Sunday: CLOSED</div>
              </div>
              <div>
                <h3>Direct</h3>
                <div>972.833.0136</div>
              </div>
              <div>
                <h3>Email us</h3> <p>support@uptradeit.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
