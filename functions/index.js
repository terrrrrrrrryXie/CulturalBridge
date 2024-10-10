/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// const {
//   collection, addDoc, getDocs,
//   query, where, deleteDoc, doc,
// } = require("firebase/firestore")
// const db = require("../src/firebase/init.js")


const axios = require("axios");
const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey("REDACTED_SENDGRID_KEY");

admin.initializeApp();

exports.hideEvent = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const eventId = req.query.eventId;
    const action = req.query.action;

    if (!eventId || !action) {
      res.status(400).send("Invalid request");
      return;
    }

    try {
      const hideListCollection = admin.firestore().collection("hideList");

      if (action === "hide") {
        await hideListCollection.add({id: eventId});
        res.status(200).send("hide success");
      } else if (action === "unhide") {
        const q = hideListCollection.where("id", "==", eventId);
        const result = await q.get();
        result.docs[0].ref.delete();
        res.status(200).send("unhide success");
      } else {
        console.error("fail");
        res.status(400).send("invalid input");
        console.error("fail");
      }
    } catch (error) {
      console.error("Fail request", error.message);
      res.status(500).send(error.message);
    }
  });
});

exports.sendVerification = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const toEmail = req.query.toEmail;
    const code = req.query.code;
    if (!toEmail || !code) {
      res.status(400).send("Invalid request");
      return;
    }
    try {
      const msg = {
        to: toEmail,
        from: "15169131907@163.com",
        templateId: "d-b1753c57d9284b448d896fece8da1a3d",
        dynamic_template_data: {
          code: code,
        },
      };
      await sgMail.send(msg);
      res.status(200).send("success");
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
});

exports.sendConfirmation = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const toEmail = req.body.toEmail;
    const fileContent = req.body.content;
    if (!toEmail || !fileContent) {
      res.status(400).send("Invalid request");
      return;
    }
    try {
      const msg = {
        to: toEmail,
        from: "15169131907@163.com",
        subject: "Booking Confirmation",
        text: "Thank you for booking an event with us. " +
        "Please find the booking confirmation attached as a PDF file.",
        attachments: [
          {
            content: fileContent,
            filename: "BookingConfirmation.pdf",
            type: "application/pdf",
            disposition: "attachment",
          },
        ],
      };
      await sgMail.send(msg);
      res.status(200).send("success");
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
});

exports.getCommunityInfo = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const input = req.query.input;
      const key = "REDACTED_GOOGLE_API_KEY";

      const response = await axios.get("https://maps.googleapis.com/maps/api/place/textsearch/json", {
        params: {
          query: input,
          key: key,
        },
      });

      return res.status(200).send(response.data);
    } catch (error) {
      return res.status(500).send({error: "Failed to fetch community info."});
    }
  });
});

exports.getDirection = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const originLocation = req.query.origin;
    const destinationLocation = req.query.destination;
    const mode = req.query.mode;
    if (!originLocation || !destinationLocation || !mode) {
      res.status(400).send("Invalid request");
      return;
    }

    const apiKey = "REDACTED_GOOGLE_API_KEY";
    try {
      const response = await axios.get("https://maps.googleapis.com/maps/api/directions/json", {
        params: {
          origin: originLocation,
          destination: destinationLocation,
          mode: mode,
          key: apiKey,
          alternatives: true,
        },
      });

      console.log("Response data:", response.data);
      res.status(200).send(response.data);
    } catch (error) {
      res.status(500).send(error);
    }
  });
});

exports.sendBulkEmail = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const toEmails = JSON.parse(req.body.toEmails);
    const nickname = req.body.nickname;
    const event = JSON.parse(req.body.event);
    if (!toEmails || !event || !nickname) {
      res.status(400).send("Invalid request");
      return;
    }
    try {
      const msg = {
        to: toEmails,
        from: "15169131907@163.com",
        templateId: "d-cd8dcbfa81bb464fb12b869190ecbbe5",
        dynamic_template_data: {
          nickname: nickname,
          event_name: event.event_name,
          community: event.location.community,
          date: event.date,
          time: event.time,
          ticket_price: event.ticket_price,
          attendees: event.attendees,
          remaining_spots: event.remaining_spots,
        },
      };
      await sgMail.sendMultiple(msg);
      res.status(200).send("success");
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
});


