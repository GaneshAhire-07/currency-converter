const BASE_URL = "https://api.exchangerate-api.com/v4/latest/USD";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch exchange rates");

    const data = await response.json();
    const fromRate = data.rates[fromCurr.value];
    const toRate = data.rates[toCurr.value];

    // Convert amount using the rates
    const convertedAmount = ((amtVal / fromRate) * toRate).toFixed(4);

    // Display the result
    msg.innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
  } catch (error) {
    console.error(error);
    msg.innerText = "Error fetching exchange rates. Please try again later.";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
