
//I NEED TO ADD OTHER OPTIONS FOR SORTING INSTEAD OF SAYING "ALL" AND ALSO FIXING SORTING


// Get the filter elements from the DOM
const filterFirstName = document.getElementById("filter-first-name");
const filterLastName = document.getElementById("filter-last-name");
const filterFee = document.getElementById("filter-fee");
const filterRating = document.getElementById("filter-rating");
const filterRegion = document.getElementById("filter-region");
const loader = document.querySelector("#preloader");  //Loader

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
        // API CALL WILL FETCH AGENTS AND DISPLAY ON RESIDENTIAL HTML PAGE
        const response = await fetch(`http://localhost:3004/agents-by-region?${queryString}`);
        const data = await response.json();

        if (data.agents && data.agents.length > 0) {
            renderAgentTable(data.agents);  // Render the table with fetched data
        } else {
            console.log("No agents found.");
        }
    } catch (error) {
        //WINDOW ALERT - WILL PROMPT AN ERROR IF SERVER IS NOT RUNNING
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
    tableBody.innerHTML = "";

    // Helper function for color based on rating
    function getRatingColor(rating) {
        if (rating === 100) return "#137f13"; // green
        if (rating >= 90) return "#3a8de1";   // blue
        return "#8e3ae1";                     // purple
    }    

    agents.forEach(agent => {
        const row = document.createElement("tr");

        // Set the background color of the entire row
        row.style.backgroundColor = getRatingColor(agent.rating);
        row.style.color = "white"; // Optional: improves readability

        row.innerHTML = `
            <td>${agent.first_name}</td>
            <td>${agent.last_name}</td>
            <td>$${agent.fee.toFixed(2)}</td>
            <td>${agent.rating}</td>
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
