// Dotenv for loading .env file
import dotenv from "dotenv";
//.env for production, .envtest for development
dotenv.config({ path: `.env${process.env.NODE_ENV ? `${process.env.NODE_ENV}` : ""}` });
console.log(`Running in ${process.env.NODE_ENV} mode.`);
// Fetch for sending webhook to discord
import fetch from "node-fetch";
// Stripe for handling payments
import stripeModule from "stripe";
// Coinbase Commerce for handling crypto payments
import coinbase from "coinbase-commerce-node";
// Express for handling requests
import express from "express";
import { handler as ssrHandler } from "./public/dist/server/entry.mjs";
const app = express();
// Body parser for handling requests
import bodyParser from "body-parser";

// Stripe Setup
const stripe = stripeModule(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const DOMAIN = process.env.DOMAIN;

// Coinbase Commerce Setup
const Client = coinbase.Client;
const clientObj = Client.init(process.env.COINBASE_API_KEY, "https://api.commerce.coinbase.com/", "2018-03-22", 30000);

// Express
app.use(express.static("./public/dist/client/"));
app.use(ssrHandler);

// Body Parser for webhooks only
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook" || req.originalUrl === "/coinbase-webhook") {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

// Get the price of the roblox pass from https://apis.roblox.com/game-passes/v1/game-passes/19208841/product-info
/*
Access to fetch at 'https://apis.roblox.com/game-passes/v1/game-passes/19208841/product-info' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
*/
app.get("/roblox-price", async (req, res) => {
  let headers = new Headers();
  headers.append("Access-Control-Allow-Origin", "*");
  headers.append("Access-Control-Allow-Methods", "GET, POST");
  headers.append("Access-Control-Allow-Headers", "Content-Type");
  headers.append("Access-Control-Allow-Credentials", "true");
  const response = await fetch("https://apis.roblox.com/game-passes/v1/game-passes/19208841/product-info", {
    method: "GET",
    headers: headers,
  });
  const data = await response.json();
  console.log(data);
  res.json(data);
});

// This code creates a checkout session and returns the URL
app.post("/create-checkout-session", async (req, res) => {
  // Stripe checkout session
  if (req.body.paymentMethod == "Stripe") {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env[`PRICE_ID_${req.body.tier.toUpperCase()}`],
          quantity: 1,
        },
      ],
      customer_email: req.body.email,
      metadata: {
        DiscordID: req.body.discordid,
        Tier: req.body.tier,
      },
      mode: "payment",
      customer_creation: "always",
      success_url: `${DOMAIN}status?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}status?session_id={CHECKOUT_SESSION_ID}`,
      submit_type: "pay",
    });
    res.json({ url: session.url });
  }

  // Coinbase Commerce checkout session
  if (req.body.paymentMethod == "Crypto") {
    // Declare variables
    let productName;
    let productDescription;
    let productPrice;
    let productCurrency;
    // Set the variables to the correct values based on the tier
    if (req.body.tier == "Pro") {
      productName = "Sirius Pro";
      productDescription = "The ultimate suite of features.";
      productPrice = "13.99";
      productCurrency = "USD";
    } else if (req.body.tier == "Essential") {
      productName = "Sirius Essential";
      productDescription = "Enhance your experience with Essential.";
      productPrice = "6.99";
      productCurrency = "USD";
    }

    // Create a charge object with the required parameters
    const chargeData = {
      name: productName,
      description: productDescription,
      pricing_type: "fixed_price",
      local_price: {
        amount: productPrice,
        currency: productCurrency,
      },
      metadata: {
        discordID: req.body.discordid,
        tier: req.body.tier,
        email: req.body.email,
      },
      redirect_url: `${DOMAIN}status?code={code}`,
      cancel_url: `${DOMAIN}status?code={code}`,
      logo_url: "https://res.cloudinary.com/commerce/image/upload/v1644360162/d015hv1hhuhzbw0cety5.png",
    };

    // Create the charge
    const Charge = coinbase.resources.Charge;
    const chargeObj = await Charge.create(chargeData);
    // Get the charge URL
    const url = chargeObj.hosted_url;
    // store the charge code to fill in the redirect URL later
    global.chargeCode = chargeObj.code;
    console.log(global.chargeCode);
    // Send the URL to the client
    res.status(200).json({ url: url });
  }
});

// This code handles the Stripe webhook
app.post("/webhook", bodyParser.raw({ type: "application/json" }), async (req, res) => {
  // Retrieve the event by verifying the signature using the raw body and secret.
  const sig = req.headers["stripe-signature"];
  // Verify the event by fetching it from Stripe
  let event;
  try {
    // Construct the event
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`);
    // On error, log and return the error message
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    // Get the all the data from the event
    const payment_intent_id = event.data.object.payment_intent;
    const payment_intent = await stripe.paymentIntents.retrieve(payment_intent_id);
    const charge_id = payment_intent.latest_charge;
    const charge = await stripe.charges.retrieve(charge_id);
    const receiptUrl = charge.receipt_url;
    const session = event.data.object;
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    // Store the data in variables for later use when sending the webhook
    // Email
    const customerEmail = session.customer_email || session.customer_details.email || "contact@gigi.asap";

    // Discord ID
    const discordUser = `<@${session.metadata.DiscordID ?? "This purchase was probably not made via buy.sirius.menu."}>`;

    // Tier
    const tier = session.metadata.Tier || lineItems.data[0].description;

    // Currency
    const currency = session.currency.toUpperCase() === "EUR" ? "€" : session.currency.toUpperCase() === "USD" ? "$" : session.currency.toUpperCase() === "GBP" ? "£" : session.currency.toUpperCase();

    // Amount Paid
    const amountPaid = `${session.amount_total == null ? "N/A" : (session.amount_total ?? -1) === -1 ? "Error: Invalid amount" : `${currency}${((session.amount_total ?? -1) / 100).toFixed(2)}`}`;

    // Date and Time of Purchase
    const created = `<t:${session.created ?? 0}:f>`;

    // Receipt URL
    const receiptLink = `[View Receipt](${receiptUrl ?? "https://dashboard.stripe.com/"})`;

    // Footer
    const footer = `Discord ID: ${session.metadata.DiscordID}${session.livemode === false ? " | Test Mode: True" : ""}`;

    // Send the webhook
    fetch(process.env.WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "Stripe",
        avatar_url: "https://stripe.com/img/v3/home/social.png",
        content: null,
        embeds: [
          {
            title: `Successful Purchase`,
            color: 3092790,
            fields: [
              {
                name: "Email:",
                value: customerEmail,
                inline: true,
              },
              {
                name: "Discord User:",
                value: discordUser,
                inline: true,
              },
              {
                name: "License Tier:",
                value: tier,
                inline: true,
              },
              {
                name: "Amount Paid:",
                value: amountPaid,
                inline: true,
              },
              {
                name: "Date Purchased:",
                value: created,
                inline: true,
              },
              {
                name: "Receipt:",
                value: receiptLink,
                inline: true,
              },
            ],
            footer: {
              text: footer,
            },
            thumbnail: {
              url: "https://cdn.discordapp.com/icons/939553319750344744/230b38fa4b3fc660cf37837359cbb7fc.webp",
            },
          },
        ],
      }),
    });
  }

  // Return a response to acknowledge receipt of the event, 200 is success
  res.status(200).send(`Webhook received: ${event.id}`);
});

// This code handles the Coinbase webhook
app.post("/coinbase-webhook", bodyParser.raw({ type: "application/json" }), async (req, res) => {
  // Retrieve the event by verifying the signature using the raw body and secret.
  let event;
  try {
    // Construct the event
    event = coinbase.Webhook.verifyEventBody(req.body, req.headers["x-cc-webhook-signature"], process.env.COINBASE_WEBHOOK_SECRET);
  } catch (err) {
    // On error, log and return the error message
    console.log("err.message: " + err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "charge:confirmed") {
    // log the event
    console.log("event: " + JSON.stringify(event));
    // Store the data in variables for later use when sending the webhook
    // Email
    let email;
    if (event.data.metadata.email == null) {
      email = "contact@gigi.asap";
    } else {
      email = event.data.metadata.email;
    }

    // Discord ID
    let discordID;
    let discordUser;
    if (event.data.metadata.discordID == null) {
      discordID = "This purchase was probably not made via buy.sirius.menu.";
      discordUser = "This purchase was probably not made via buy.sirius.menu.";
    } else {
      discordID = event.data.metadata.discordID;
      discordUser = `<@${event.data.metadata.discordID}>`;
    }

    // Tier
    let tier;
    if (event.data.metadata.tier == null) {
      tier = event.data.name;
    } else {
      tier = event.data.metadata.tier === "Pro" ? "Sirius Pro" : "Sirius Essential";
    }

    // Price
    let price;
    if (event.data.pricing.local.amount == null) {
      price = 9999999999;
    } else {
      price = event.data.pricing.local.amount;
    }

    // Time
    let timestamp;
    if (event.data.created_at == null) {
      timestamp = 0;
    } else {
      timestamp = Math.floor(new Date("2022-12-21T18:22:50Z").getTime() / 1000)
        .toString()
        .padStart(10, "0")
        .toUpperCase();
    }

    // Receipt URL
    let receiptUrl;
    if (event.data.hosted_url == null) {
      receiptUrl = "https://www.coinbase.com/";
    } else {
      receiptUrl = event.data.hosted_url;
    }

    // Send the webhook
    fetch(process.env.WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "Coinbase",
        avatar_url: "https://i.vgy.me/6uU65X.png",
        content: null,
        embeds: [
          {
            title: "Successful Purchase",
            color: 3092790,
            fields: [
              {
                name: "Email",
                value: email,
                inline: true,
              },
              {
                name: "Discord User",
                value: discordUser,
                inline: true,
              },
              {
                name: "License Tier",
                value: tier,
                inline: true,
              },
              {
                name: "Amount Paid",
                value: price,
                inline: true,
              },
              {
                name: "Date Purchased",
                value: `<t:${timestamp}:f>`,
                inline: true,
              },
              {
                name: "Receipt",
                value: `[View Receipt](${receiptUrl})`,
                inline: true,
              },
            ],
            footer: {
              text: `Discord ID: ${discordID}`,
            },
            thumbnail: {
              url: "https://cdn.discordapp.com/icons/939553319750344744/230b38fa4b3fc660cf37837359cbb7fc.webp",
            },
          },
        ],
      }),
    });
  }

  // Return a response to acknowledge receipt of the event, 200 is success
  res.status(200).send(`Webhook received: ${event.id}`);
});

// This code handles the status page
app.get("/status", async (req, res) => {
  let pageTitle;
  let title;
  let message;
  // Show status message only if there is a session id (stripe) in the url, if there is no session id in the url, redirect to home page
  if (!req.query.session_id) {
    res.redirect("/");
  } else {
    // If there is a session id in the url, get the session details
    try {
      const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
      const paid = session.payment_status === "paid";
      // If the payment was successful, show the success message
      if (paid) {
        pageTitle = "Success";
        title = "Thank you for your order.";
        message = "We have issued a request for your Sirius license to be added to your Discord account, this should only take a few minutes.";
      }
      // If the payment was not successful, show the failure message
      else {
        pageTitle = "Canceled";
        title = "Canceled.";
        message = "This order was canceled and you haven't been charged.";
      }
    } catch (err) {
      console.log("err.message: " + err.message);
      // If there is an error, show the error message
      pageTitle = "Error";
      title = "Something went wrong.";
      message = "Invalid Session ID.";
    }

    // Return the status page with the correct message and status code
    res.status(200).send(`<!DOCTYPE html><html class="h-full w-full"><head><title>${pageTitle}</title><link rel="stylesheet" href="./assets/styles/output.css" /><link href="../assets/images/logo.svg" rel="icon" type="image/svg+xml" /></head><body class="h-full w-full bg-black"><div class="flex h-full w-full items-center justify-center py-6 sm:py-8 lg:py-12"><div class="mx-auto max-w-screen-md px-4 text-[#979797] md:px-8"><h1 class="mb-2 !font-sfdisplay text-2xl font-medium text-white sm:text-3xl md:text-5xl">${title}</h1><p class="mb-6 !font-sfdisplay sm:text-lg md:mb-8">${message}</p></div></div></body></html>`);
  }
});

// Listen on port 80
app.listen(80);
