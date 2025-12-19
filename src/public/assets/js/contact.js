//DIRECTLY INTERACTING WITH HTML INSTEAD OF HAVING "SCRIPT" TAGS WITHIN INDEX.HTML
// <!-- BUTTON SUBMISSION EVENT LISTENER -->
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  if (!form) {
    console.error("contact-form not found");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const jsonBody = {
      fullname: document.getElementById("fullname").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      company_name: document.getElementById("company_name").value,
      project_name: document.getElementById("project_name").value,
      project_description: document.getElementById("project_description").value,
      department: document.getElementById("department").value,
      message: document.getElementById("message").value,
    };

    console.log("Form Contents", jsonBody);

    try {
      const response = await fetch("http://localhost:3004/contact-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonBody),
      });

      const result = await response.json();
      console.log("Server result:", result);

      if (response.ok) {
        // Show the Bootstrap modal instead of alert
        if (window.$) {
          $("#success-message").modal("show");
        } else if (window.bootstrap) {
          const modalEl = document.getElementById("success-message");
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        }

        // Form reset after successful submission
        form.reset();
      } else {
        // ---------------- Custom validation error alert ----------------
        let errorMessage = "Failed to save contact.";

        // Check if Mongoose returned validation errors (backend sends { errors: ... })
        if (result.errors) {
          const errors = result.errors;

          if (errors.email) {
            errorMessage += ` Invalid email: ${errors.email.message}.`;
          }
          if (errors.phone) {
            errorMessage += ` Invalid phone: ${errors.phone.message}.`;
          }
        }

        alert(errorMessage);
      }
    } catch (err) {
      console.error(err);
      alert("ERROR sending request.");
    }
  });
});


// <!-- BUTTON SUBMISSION EVENT LISTENER -->



var _hash = window.location.hash;

/**
	BROWSER HASH - from php/contact.php redirect!

	#alert_success 		= email sent
	#alert_failed		= email not sent - internal server error (404 error or SMTP problem)
	#alert_mandatory	= email not sent - required fields empty
**/	jQuery(_hash).show();

