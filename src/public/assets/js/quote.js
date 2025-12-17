//FRONT-END INTERACTION WITH BACKEND FOR QUOTE CALCULATION
async function updateBackendQuote() {
  const params = new URLSearchParams({
    building_type: buildingType_select.value,
    numFloors: numFloors_input?.value || 0,
    numApts: numApt_input?.value || 0,
    maxOccupancy: maxOcc_input?.value || 0,
    numElevators: numElevators_input?.value || 0,
    tier: document.querySelector("input[name='product-line']:checked")?.id || "standard"
  });

  const response = await fetch(`/calc?${params.toString()}`);
  const result = await response.json();

  displayCalcElv_input.value = result.elevatorCount;
  displayUnitPrice_input.value = `$${result.unitPrice}`;
  displayElvTotalPrice_input.value = `$${result.elevatorCost}`;
  displayInstallFee_input.value = `$${result.installationFee}`;
  displayEstTotalCost_input.value = `$${result.totalCost}`;
}


  

//QUOTE.HTML DIRECT QUOTE PAGE FORM (Consolidated Old Code)
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // === DOM ELEMENTS ===
  const form = document.getElementById("quote-form");
  const buildingType_select = document.getElementById("building-type");

  const estimateNumElv_div = document.querySelector(".estimate-num-elv");
  const numApt_input = document.querySelector("#number-of-apartments input");
  const numFloors_input = document.querySelector("#number-of-floors input");
  const numElevators_input = document.querySelector("#number-of-elevators input");
  const maxOcc_input = document.querySelector("#maximum-occupancy input");
  const displayCalcElv_input = document.querySelector("#elevator-amount input");

  const productLineSelection_div = document.querySelector(".product-line");
  const radioBtns_div = document.querySelector(".radio-btns");
  const warning_p = document.getElementById("warning");

  const finalPricingDisplay_div = document.querySelector(".final-pricing-display");
  const displayUnitPrice_input = document.querySelector("#elevator-unit-price input");
  const displayElvTotalPrice_input = document.querySelector("#elevator-total-price input");
  const displayInstallFee_input = document.querySelector("#installation-fees input");
  const displayEstTotalCost_input = document.querySelector("#final-price input");

  // === CONFIG ===
  const buildingTypeFields = {
    residential: ["number-of-apartments", "number-of-floors"],
    commercial: ["number-of-floors", "maximum-occupancy"],
    industrial: ["number-of-elevators"]
  };

  const unitPrices = { standard: 8000, premium: 12000, excelium: 15000 };
  const installPercentFees = { standard: 10, premium: 15, excelium: 20 };
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  // === CALCULATION FUNCTIONS ===
  function calcResidentialElev(numFloors, numApts) {
    return Math.max(1, Math.ceil(numApts / numFloors / 6) * Math.ceil(numFloors / 20));
  }

  function calcCommercialElev(numFloors, maxOccupancy) {
    const regular = Math.ceil((maxOccupancy * numFloors) / 200) * Math.ceil(numFloors / 10);
    const freight = Math.ceil(numFloors / 10);
    return regular + freight;
  }

  function calcInstallFee(totalPrice, percent) {
    return (percent / 100) * totalPrice;
  }

  // === DISPLAY FUNCTIONS ===
  function displayElvCalcResult(buildingType) {
    let elevatorsRequired = 1;
    if (buildingType === "residential") {
      elevatorsRequired = calcResidentialElev(parseInt(numFloors_input.value), parseInt(numApt_input.value));
    } else if (buildingType === "commercial") {
      elevatorsRequired = calcCommercialElev(parseInt(numFloors_input.value), parseInt(maxOcc_input.value));
    } else if (buildingType === "industrial") {
      elevatorsRequired = parseInt(numElevators_input.value) || 1;
    }
    displayCalcElv_input.value = elevatorsRequired;
    return elevatorsRequired;
  }

  function displayPricing(productLine, numElv) {
    const unitPrice = unitPrices[productLine];
    const subtotal = unitPrice * numElv;
    const installFee = calcInstallFee(subtotal, installPercentFees[productLine]);
    const total = subtotal + installFee;

    displayUnitPrice_input.setAttribute("value", formatter.format(unitPrice));
    displayElvTotalPrice_input.setAttribute("value", formatter.format(subtotal));
    displayInstallFee_input.setAttribute("value", formatter.format(installFee));
    displayEstTotalCost_input.setAttribute("value", formatter.format(total));
  }

  function updatePricingDisplay() {
    if (!displayCalcElv_input.value) {
      warning_p.style.display = "block";
      return;
    }
    warning_p.style.display = "none";
    const productLine = document.querySelector("input[name='product-line']:checked")?.id;
    if (productLine) {
      displayPricing(productLine, parseInt(displayCalcElv_input.value));
    }
  }

  function allBuildingFieldsCompleted(buildingType) {
    return buildingTypeFields[buildingType].every(fieldID => {
      return estimateNumElv_div.querySelector(`div[id='${fieldID}'] input`).value !== "";
    });
  }

  function resetForm() {
    estimateNumElv_div.style.display = "none";
    estimateNumElv_div.querySelectorAll("div").forEach(el => {
      el.querySelectorAll("input[type='number']").forEach(input => input.value = "");
      el.querySelectorAll("div.col-4").forEach(div => div.classList.add("d-none"));
    });
    displayCalcElv_input.value = "";
    productLineSelection_div.style.display = "none";
    warning_p.style.display = "none";
    productLineSelection_div.querySelectorAll("input[type='radio']").forEach(r => r.checked = false);
    finalPricingDisplay_div.style.display = "none";
    finalPricingDisplay_div.querySelectorAll("input[type='text']").forEach(input => input.setAttribute("value", ""));
  }

  function displayBuildingFields(buildingType) {
    estimateNumElv_div.style.display = "block";
    estimateNumElv_div.querySelector(".step-description").style.display = "block";
    estimateNumElv_div.querySelector(".card-block").style.display = "block";
    estimateNumElv_div.querySelectorAll(".row").forEach(row => row.classList.remove("d-none"));
    buildingTypeFields[buildingType].forEach(fieldID => {
      estimateNumElv_div.querySelector(`div[id='${fieldID}']`).classList.remove("d-none");
    });
    productLineSelection_div.style.display = "block";
    finalPricingDisplay_div.style.display = "block";
  }

  // === EVENT LISTENERS ===
  buildingType_select.addEventListener("change", function () {
    resetForm();
    const buildingType = this.value;
    if (buildingType !== "---Select---") {
      displayBuildingFields(buildingType);

      // Only calculate elevators and pricing if all required fields are filled
      estimateNumElv_div.addEventListener("input", function () {
        if (allBuildingFieldsCompleted(buildingType)) {
          displayElvCalcResult(buildingType);
          updatePricingDisplay();
        }
      });
    }
  });

  radioBtns_div.querySelectorAll("input[type='radio']").forEach(radioBtn => {
    radioBtn.addEventListener("click", updatePricingDisplay);
  });
});
