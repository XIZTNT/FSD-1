{/* <script> */}
const quoteForm = document.getElementById('quote-form');

quoteForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const buildingType = document.getElementById('buildingType').value;
  const apartments = document.getElementById('apartments').value;
  const floors = document.getElementById('floors').value;
  const occupancies = document.getElementById('occupancies').value;
  const elevators = document.getElementById('elevators').value;
  const tier = document.getElementById('tier').value;

  if (!buildingType || !floors || !tier) {
    alert('Please fill all required fields.');
    return;
  }

  // Build query parameters
  const queryParams = new URLSearchParams({
    apartments,
    floors,
    occupancies,
    elevators,
    tier
  });

  try {
    const response = await fetch(`/calc/${buildingType}?${queryParams.toString()}`, {
      method: 'GET'
    });

    const data = await response.json();

    const resultDiv = document.getElementById('quote-result');
    resultDiv.style.display = 'block';

    if (response.ok) {
      resultDiv.innerHTML = `
        <p>Elevators Required: ${data.elevators_required}</p>
        <p>Total Cost: $${data.cost}</p>
      `;
    } else {
      resultDiv.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
    }
  } catch (err) {
    console.error(err);
    document.getElementById('quote-result').innerHTML = `<p style="color:red;">Failed to fetch quote.</p>`;
  }
});
// </script>
