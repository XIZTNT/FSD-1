// agents.js - Full setup for fetching agent data and rendering it in the HTML table

// Get the filter elements from the DOM
const filterFirstName = document.getElementById("filter-first-name");
const filterLastName = document.getElementById("filter-last-name");
const filterFee = document.getElementById("filter-fee");
const filterRating = document.getElementById("filter-rating");
const filterRegion = document.getElementById("filter-region");
const loader = document.querySelector("#preloader");  // Assuming you want to show a loader

// Store current sort parameters
let currentSortBy = "name";
let currentSortDirection = "asc";  // Default to ascending order

// Function to fetch agent data
async function fetchAgents() {
    if (loader) {
        loader.style.display = "block";  // Show loading spinner
    }

    // Collect the filter values from the dropdowns
    const firstName = filterFirstName.value;
    const lastName = filterLastName.value;
    const fee = filterFee.value;
    const rating = filterRating.value;
    const region = filterRegion.value;

    // Build the query string for the API call
    const queryString = new URLSearchParams({
        firstName,
        lastName,
        fee,
        rating,
        region,
        sortBy: currentSortBy,
        sortDirection: currentSortDirection
    }).toString();

    try {
        // API CALL WILL FETCH AGENTS AND DISPLAY ON RESIDENTIAL HTML PAGE T
        const response = await fetch(`http://localhost:3004/agents-by-region?${queryString}`);
        const data = await response.json();

        if (data.agents && data.agents.length > 0) {
            renderAgentTable(data.agents);  // Render the table with fetched data
        } else {
            console.log("No agents found.");
        }
    } catch (error) {
        console.error("Error fetching agents:", error);
        alert("There was an issue fetching agent data.");
    } finally {
        if (loader) {
            loader.style.display = "none";  // Hide loading spinner
        }
    }
}

// Render the agent data in the table
function renderAgentTable(agents) {
    const tableBody = document.querySelector("#agents-table tbody");
    tableBody.innerHTML = "";  // Clear existing table rows

    // Loop through each agent and create a new table row
    agents.forEach(agent => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${agent.first_name} ${agent.last_name}</td>
            <td style="color: ${agent.ratingColor || 'black'}">${agent.rating}</td>
            <td>$${agent.fee.toFixed(2)}</td>
            <td>${agent.region}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Event listeners for the filter dropdowns to fetch data when changed
filterFirstName.addEventListener("change", fetchAgents);
filterLastName.addEventListener("change", fetchAgents);
filterFee.addEventListener("change", fetchAgents);
filterRating.addEventListener("change", fetchAgents);
filterRegion.addEventListener("change", fetchAgents);

// Event listener for sorting headers
function handleSort(column) {
    // Toggle sorting direction: if the same column, change direction; otherwise, default to ascending
    if (currentSortBy === column) {
        currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
    } else {
        currentSortBy = column;
        currentSortDirection = "asc";  // Reset to ascending when changing column
    }

    // Fetch agents again with the updated sort parameters
    fetchAgents();
}

// Attach event listeners to column headers for sorting
document.getElementById("sort-first-name").addEventListener("click", () => handleSort("first_name"));
document.getElementById("sort-last-name").addEventListener("click", () => handleSort("last_name"));
document.getElementById("sort-fee").addEventListener("click", () => handleSort("fee"));
document.getElementById("sort-rating").addEventListener("click", () => handleSort("rating"));
document.getElementById("sort-region").addEventListener("click", () => handleSort("region"));

// Initialize fetching of agent data when the page loads
document.addEventListener("DOMContentLoaded", fetchAgents);
