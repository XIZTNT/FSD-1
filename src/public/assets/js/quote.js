const params = new URLSearchParams({
    building_type: buildingType_select.value,
    numFloors: numFloors_input?.value || 0,
    numBasements: numBasements_input?.value || 0,
    numApts: numApt_input?.value || 0,
    maxOccupancy: maxOcc_input?.value || 0,
    numElevators: numElevators_input?.value || 0,
    tier: document.querySelector("input[name='tier']:checked")?.value || "standard"
  });
  const response = await fetch(`/calc?${params.toString()}`);
  const result = await response.json();
  


// "use strict";

// document.addEventListener("DOMContentLoaded", () => {
//   // === DOM ELEMENTS ===
//   const form = document.getElementById("quote-form");
//   const buildingType_select = document.getElementById("building-type");

//   const estimateNumElv_div = document.querySelector(".estimate-num-elv");
//   const numApt_input = document.querySelector("#number-of-apartments input");
//   const numFloors_input = document.querySelector("#number-of-floors input");
//   const numBasements_input = document.querySelector("#number-of-basements input");
//   const numElevators_input = document.querySelector("#number-of-elevators input");
//   const maxOcc_input = document.querySelector("#maximum-occupancy input");
//   const displayCalcElv_input = document.querySelector("#elevator-amount input");

//   const productLineSelection_div = document.querySelector(".product-line");
//   const radioBtns_div = document.querySelector(".radio-btns");
//   const warning_p = document.getElementById("warning");

//   const finalPricingDisplay_div = document.querySelector(".final-pricing-display");
//   const displayUnitPrice_input = document.querySelector("#elevator-unit-price input");
//   const displayElvTotalPrice_input = document.querySelector("#elevator-total-price input");
//   const displayInstallFee_input = document.querySelector("#installation-fees input");
//   const displayEstTotalCost_input = document.querySelector("#final-price input");

//   // === CONFIG ===
//   const buildingTypeFields = {
//     residential: ["number-of-apartments", "number-of-floors"],
//     commercial: ["number-of-floors", "maximum-occupancy"],
//     industrial: ["number-of-elevators"],
//   };

//   // === HELPERS ===
//   function resetForm() {
//     estimateNumElv_div.style.display = "none";
//     estimateNumElv_div.querySelectorAll("div").forEach((el) => {
//       el.querySelectorAll("input[type='number']").forEach((input) => {
//         input.value = "";
//       });
//       el.querySelectorAll("div.col-4").forEach((div) => {
//         div.classList.add("d-none");
//       });
//     });
//     displayCalcElv_input.value = "";
//     productLineSelection_div.style.display = "none";
//     warning_p.style.display = "none";
//     productLineSelection_div.querySelectorAll("input[type='radio']").forEach((radioBtn) => {
//       radioBtn.checked = false;
//     });
//     finalPricingDisplay_div.style.display = "none";
//     finalPricingDisplay_div.querySelectorAll("input[type='text']").forEach((input) => {
//       input.setAttribute("value", "");
//     });
//   }

//   function displayBuildingFields(buildingType) {
//     estimateNumElv_div.style.display = "block";
//     estimateNumElv_div.querySelector(".step-description").style.display = "block";
//     estimateNumElv_div.querySelector(".card-block").style.display = "block";
//     estimateNumElv_div.querySelectorAll(".row").forEach((row) => {
//       row.classList.remove("d-none");
//     });
//     for (let fieldID of buildingTypeFields[buildingType]) {
//       estimateNumElv_div.querySelector(`div[id='${fieldID}']`).classList.remove("d-none");
//     }
//     productLineSelection_div.style.display = "block";
//     finalPricingDisplay_div.style.display = "block";
//   }

//   // === EVENT LISTENERS ===
//   buildingType_select.addEventListener("change", function () {
//     console.log("Dropdown changed to:", this.value);
//     resetForm();
//     const buildingType = this.value;
//     if (buildingType !== "---Select---") {
//       displayBuildingFields(buildingType);
//     }
//   });

//   radioBtns_div.querySelectorAll("input[type='radio']").forEach((radioBtn) => {
//     radioBtn.addEventListener("click", () => {
//       // Just a warning if no elevator amount yet
//       if (!displayCalcElv_input.value) {
//         warning_p.style.display = "block";
//         radioBtn.checked = false;
//       } else {
//         warning_p.style.display = "none";
//       }
//     });
//   });

//   form.addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const jsonBody = {
//       building_type: document.getElementById("building-type").value,
//       numFloors: parseInt(numFloors_input?.value || 0),
//       numApts: parseInt(numApt_input?.value || 0),
//       maxOccupancy: parseInt(maxOcc_input?.value || 0),
//       numElevators: parseInt(numElevators_input?.value || 0),
//       productLine: document.querySelector("input[name='product-line']:checked")?.id,
//     };

//     const response = await fetch("http://localhost:3004/calc", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(jsonBody),
//     });

//     const result = await response.json();

//     // Populate pricing display with backend results
//     displayUnitPrice_input.value = `$${result.unitPrice}`;
//     displayElvTotalPrice_input.value = `$${result.elevatorCost}`;
//     displayInstallFee_input.value = `$${result.installationFee}`;
//     displayEstTotalCost_input.value = `$${result.totalCost}`;
//   });
// });
