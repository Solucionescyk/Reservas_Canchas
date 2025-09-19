//import "dotenv/config";
//import nodemailer from "nodemailer";

//const EMAIL_USER = process.env.EMAIL_USER;
//const EMAIL_PASS = (process.env.EMAIL_PASS || "").replace(/\s/g, "");
//const TO = process.env.TEST_TO || EMAIL_USER; // por defecto te escribes a ti mismo

//(async () => {
  //console.log({ EMAIL_USER, passLen: EMAIL_PASS.length }); // Debe ser 16
  //const transporter = nodemailer.createTransport({
    //host: "smtp.gmail.com",
    //port: 465,
    //secure: true,
    //auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    //logger: true, // logs útiles
    //debug: true,
  //});

  //await transporter.verify(); // debe pasar sin errores

  //const info = await transporter.sendMail({
    //from: EMAIL_USER,
    //to: TO,
    //subject: "Prueba SMTP ✔",
    //text: "Hola, este es un correo de prueba.",
    //html: "<p>Hola, este es un <b>correo de prueba</b>.</p>",
  //});

  //console.log("MessageID:", info.messageId);
  //console.log("Accepted:", info.accepted);
  //console.log("Rejected:", info.rejected);
//})();