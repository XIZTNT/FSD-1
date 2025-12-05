//THIS IS SUPPOSEDLY SUPPOSED TO GO INSIDE THE HTML
//<script> , this is why the script tag was here!
//You can place the submit handler JS directly in the same HTML document you showed earlier. Usually, it goes:

// Either at the bottom of the <body>, just before the </body> tag, so the DOM elements already exist when the script runs.

// Or in a separate JS file that you link with <script src="your-script.js"></script> at the bottom of the HTML.
const form = document.getElementById('contact-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // stop default page reload

  // Build JS object from inputs
  const formData = {
    fullname: document.getElementById('fullname').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    company_name: document.getElementById('company_name').value,
    project_name: document.getElementById('project_name').value,
    department: document.getElementById('department').value,
    message: document.getElementById('message').value
  };

  try {
    const response = await fetch('http://localhost:5500/contact-us', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    // Show success or failure alert
    if (response.ok) {
      document.getElementById('alert_success').style.display = 'block';
    } else {
      document.getElementById('alert_failed').style.display = 'block';
    }

  } catch (err) {
    console.error(err);
    document.getElementById('alert_failed').style.display = 'block';
  }
});

