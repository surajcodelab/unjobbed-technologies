const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const form = document.getElementById("contactForm");

if (form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const status = document.getElementById("formStatus");
  const buttonLabel = submitButton ? submitButton.innerHTML : "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }
    if (status) status.textContent = "Sending your enquiry. Please wait.";

    const formData = Object.fromEntries(new FormData(form).entries());
    formData._replyto = formData.email;

    try {
      const response = await fetch("https://formsubmit.co/ajax/unjobbedtechnologies@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      // FormSubmit returns success as the string "true" for successful submissions.
      if (response.ok && (result.success === true || result.success === "true")) {
        form.reset();
        if (status) status.textContent = "Thank you! Your enquiry has been sent successfully. We will contact you soon.";
      } else {
        const message = result.message || "We couldn't send your enquiry. Please try again or email us at unjobbedtechnologies@gmail.com.";
        if (status) status.textContent = message;
      }
    } catch (error) {
      if (status) status.textContent = "Something went wrong while sending. Please check your internet connection and try again, or email unjobbedtechnologies@gmail.com.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = buttonLabel;
      }
    }
  });
}