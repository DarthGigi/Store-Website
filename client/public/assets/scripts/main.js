function enableNextSection() {
  const nextSection = this.parentElement.parentElement.nextElementSibling;
  if (nextSection) {
    nextSection.classList.remove("opacity-30");
    const inputs = nextSection.querySelectorAll("input");
    inputs.forEach((input) => {
      input.disabled = false;
    });
  }
}
document.querySelectorAll("input").forEach((input) => input.addEventListener("change", enableNextSection));
document.querySelectorAll("input").forEach((input) => input.addEventListener("change", showPrice));
document.querySelectorAll("input").forEach((input) => input.addEventListener("change", showGuide));

let stripeprice;
let cryptoprice;
let robuxprice;
let robloxtxt;
function showPrice() {
  const tier = document.querySelector('input[name="tier"]:checked').value;
  const stripePrice = document.getElementById("stripePrice");
  const cryptoPrice = document.getElementById("cryptoPrice");
  const robuxPrice = document.getElementById("robuxPrice");
  const robloxButton = document.querySelector('label[for="Robux"]');

  if (tier === "Pro") {
    stripeprice = "$15.99";
    cryptoprice = "$13.99";
    robuxprice = "2,899";
    robloxtxt = "Buy the <a href='https://www.roblox.com/game-pass/19208841/Pro' target='_blank' class='underline'>Sirius Pro</a> gamepass, and then make a ticket with your Roblox profile link with public inventory enabled.";
    if (robloxButton.classList.contains("opacity-30")) {
      robloxButton.classList.remove("opacity-30");
    }
  } else if (tier === "Essential") {
    stripeprice = "$7.99";
    cryptoprice = "$6.99";
    robuxprice = "";
    robloxtxt = "Unfortunately, we do not support buying Essential with Robux. Please use a different payment method.";
    if (!robloxButton.classList.contains("opacity-30")) {
      robloxButton.classList.add("opacity-30");
    }
  } else {
    stripeprice = "Something went wrong";
    cryptoprice = "Something went wrong";
    robuxprice = "Something went wrong";
  }
  stripePrice.innerText = stripeprice;
  cryptoPrice.innerText = cryptoprice;
  robuxPrice.innerText = robuxprice;
}

document.querySelectorAll("input[name='tier']").forEach((input) => {
  input.addEventListener("change", showPrice);
});

function showGuide() {
  showPrice();
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  const howtobuy = document.getElementById("howtobuy");
  const howtobuytitle = document.getElementById("howtobuytitle");
  const howtobuytxt = document.getElementById("howtobuytxt");

  if (howtobuy.classList.contains("opacity-0", "scale-0") && paymentMethod !== "Stripe" && paymentMethod !== "Crypto") {
    howtobuy.classList.remove("opacity-0", "scale-0");
  } else if (howtobuy.classList.contains("opacity-0", "scale-0") === false && paymentMethod !== "Stripe" && paymentMethod !== "Crypto") {
    howtobuy.classList.add("opacity-0", "scale-0");
    setTimeout(() => {
      howtobuy.classList.remove("opacity-0", "scale-0");
    }, 500);
  } else if (howtobuy.classList.contains("opacity-0", "scale-0") === false && (paymentMethod === "Stripe" || paymentMethod === "Crypto")) {
    howtobuy.classList.add("opacity-0", "scale-0");
  }

  function showGuideTxt() {
    if (paymentMethod === "Robux") {
      howtobuytitle.innerHTML = "How to buy with Robux";
      howtobuytxt.innerHTML = robloxtxt;
    }
  }

  if (howtobuytitle.innerHTML === "" || howtobuytxt.innerHTML === "") {
    showGuideTxt();
  } else {
    setTimeout(() => {
      showGuideTxt();
    }, 500);
  }
}

document.querySelectorAll('input[name="payment"]').forEach((el) => {
  el.addEventListener("change", showGuide);
});

const submit = document.getElementById("buy");
const form = document.querySelector("form");
submit.addEventListener("click", () => {
  if (form.checkValidity()) {
    const tier = document.querySelector('input[name="tier"]:checked').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const email = document.getElementById("email").value;
    const discordid = document.getElementById("discordid").value;

    // Add a spinner to the button to indicate loading
    submit.classList.add("opacity-70", "cursor-wait", "p-1", "bg-transparent");
    submit.classList.remove("px-[15px]", "py-1", "bg-[#0071e3]", "hover:bg-[#147ce5]");
    submit.disabled = true;
    submit.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>`;
    // Send the data to the server to process
    var response = fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tier: tier,
        paymentMethod: paymentMethod,
        email: email,
        discordid: discordid,
      }),
    });
    response.then((res) => {
      res.json().then((data) => {
        window.location.href = data.url;
      });
    });
  } else {
    document.getElementById("error").classList.remove("scale-0", "opacity-0", "blur-md");
    setTimeout(() => {
      document.getElementById("error").classList.add("scale-0", "opacity-0", "blur-md");
    }, 3000);
  }
});

document.querySelectorAll('input[name="payment"]').forEach((el) => {
  if (el.value === "Stripe" || el.value === "Crypto") {
    el.addEventListener("change", () => {
      const details = document.getElementById("details");
      details.classList.remove("opacity-0", "scale-0");
      const inputs = details.querySelectorAll("input");
      inputs.forEach((input) => {
        input.disabled = false;
      });
    });
  } else {
    el.addEventListener("change", () => {
      const details = document.getElementById("details");
      details.classList.add("opacity-0", "scale-0");
      const inputs = details.querySelectorAll("input");
      inputs.forEach((input) => {
        input.disabled = true;
      });
    });
  }
});

const discordid = document.getElementById("discordid");

const invalidChars = ["-", "+", "e"];

discordid.addEventListener("input", function () {
  this.value = this.value.replace(/[e\+\-]/gi, "");
});

discordid.addEventListener("keydown", function (e) {
  if (invalidChars.includes(e.key)) {
    e.preventDefault();
  }
});
