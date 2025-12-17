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

    console.log("📦 jsonBody:", jsonBody);
//Have the fetch point to the local ENV port instead of the local liveserver at 5500. 
    try {
      const response = await fetch("http://localhost:3004/contact-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonBody),
      });

      const result = await response.json();
      console.log("Server result:", result);

      if (response.ok) {
        // ✅ Show the Bootstrap modal instead of alert
        if (window.$) {
          // jQuery + Bootstrap 3/4 style
          $("#success-message").modal("show");
        } else if (window.bootstrap) {
          // Bootstrap 5 no-jQuery style (just in case)
          const modalEl = document.getElementById("success-message");
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        }

        // ✅ Clear the form AFTER success
        form.reset();
      } else {
        alert("FAILED");
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

