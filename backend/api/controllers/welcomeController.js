import nodemailer from 'nodemailer';
import WelcomeLetter from '../models/welcomeModel.js';
import moment from "moment";

// Utility to generate email content
// const generateLetterHTML = (name, unitNumber) => `
//   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
//     <h2 style="color: #1e3a8a;">Welcome to ROF!</h2>
//     <p>Dear <strong>${name}</strong>,</p>
//     <p>
//       On behalf of <strong>ROF</strong>, congratulations on your new home purchase! We are delighted to welcome you to the ROF community.
//     </p>
//     <p>
//       Your new unit number is <strong>${unitNumber}</strong>. We are confident you'll enjoy the quality, comfort,
//       and convenience that ROF properties are known for.
//     </p>
//     <p>
//       Should you have any questions or need assistance during your move-in process, please do not hesitate to reach out to our team.
//     </p>
//     <p>
//       Once again, welcome to <strong>ROF</strong> – we are proud to have you as part of our growing family.
//     </p>
//     <br />
//     <p>Warm regards,</p>
//     <p><strong>The ROF Team</strong></p>
//   </div>
// `;




export const sendWelcomeLetter = async (req, res) => {
  const { name, email, phoneNumber, unitNumber, title } = req.body;

  if (!name || !email || !phoneNumber || !unitNumber || !title) {
    return res.status(400).json({ 
      message: 'Name, title, email, phone number, and unit number are required.' 
    });
  }

  try {
    // Save to DB
    const letter = new WelcomeLetter({
      name,
      email,
      phoneNumber,
      unitNumber,
      title,
    });
    await letter.save();

    // Format the date
    const formattedDate = moment(letter.createdAt).format("DD-MMM-YYYY");

    // Generate HTML letter content
//     const htmlContent = `
// <div style="background-image: url('https://i.postimg.cc/m2Swg8LC/letter-Head.png');
//             background-size: 100% 100%;
//             background-repeat: no-repeat;
//             width: 500px;
//             height: 700px;
//             font-family: 'Calibri', sans-serif;
//             color: #000;
//             position: relative;
//             margin: 0 auto;
//             padding: 0;">

//   <!-- Content Container -->
//   <div style="position: absolute;
//               top: 190px;
//               left: 50px;
//               font-size: 15px;
//               line-height: 1.5;
//               overflow: hidden;">

//     <p style="text-align: right; margin-bottom: 25px; font-size: 15px;">Date: ${formattedDate}</p>
    
//     <p style="    margin-top: 30px; margin-bottom: 8px; margin-left: 51px;">
//       To,<br />
//       <span style="font-size: 17px; font-weight: bold;">${title} ${name}</span><br />
//     </p>

//     <p style="margin-top: 20px; margin-bottom: 8px; margin-left: 51px;">
//       <strong>Subject:</strong> Welcome Letter – ROF Pravasa
//     </p>

//     <p style="margin-top: 20px; margin-bottom: 8px; margin-left: 51px;">Dear Sir/Madam,</p>

//     <p style="margin-top: 0px; margin-bottom: 8px; margin-left: 51px;">Greetings from <strong>ROF Group</strong>!</p>

//     <p style=" text-align: justify; margin-top: 8px; margin-bottom: 8px; margin-left: 51px;">
//       We sincerely appreciate your interest in our residential project <strong>"ROF PRAVASA"</strong>, 
//       located in Sector 88A, Gurugram, Haryana. It is our privilege to welcome you to the ROF family and 
//       thank you for the trust you've placed in us to help fulfill your dream of owning a home.
//     </p>

//     <p style="margin-top: 8px; margin-bottom: 8px; margin-left: 51px; text-align: justify;">
//       We are pleased to inform you that we have received your Expression of Interest for booking a residential 
//       unit at ROF PRAVASA. To proceed further, we kindly request you to complete the initial booking amount 
//       in accordance with the prescribed payment plan.
//     </p>

//     <p style="margin-top: 8px; margin-bottom: 8px; margin-left: 51px; text-align: justify;">
//       Your trust and investment mean a great deal to us. Our team is committed to deliver a seamless and 
//       enriching pre-sale and post-sale experience, ensuring your complete satisfaction.
//     </p>

//     <p style="margin-top: 8px; margin-bottom: 8px; margin-left: 51px;">
//       For any queries, please contact us at <strong>9717022776</strong> or email 
//       <strong>pravasa@rof.co.in</strong>.
//     </p>

//     <p style="margin-top: 8px; margin-bottom: 8px; margin-left: 51px; text-align: justify;">
//       Thank you once again for choosing ROF PRAVASA.
//     </p>

//     <p style="margin-top: 8px; margin-bottom: 8px; margin-left: 51px;">
//       Warm regards,<br />
//       <strong style="font-size: 17px;">ROF GROUP</strong>
//     </p>
//   </div>
// </div>
// `;
const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- Force light mode rendering with multiple approaches -->
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      /* Base styles */
      body, p, table, td, div {
        margin: 0;
        padding: 0;
      }
      
      /* Force green text */
      .green-text {
        color: #006633 !important;
      }
      
      /* Dark mode overrides for various clients */
      @media (prefers-color-scheme: dark) {
        .green-text {
          color: #006633 !important;
        }
        
        .dark-mode-bg {
          background-color: #ffffff !important;
        }
        
        .dark-mode-text {
          color: #006633 !important;
        }
      }
      
      /* Target Apple Mail dark mode */
      [data-ogsc] .green-text,
      [data-ogsb] .green-text {
        color: #006633 !important;
      }
      
      /* Target Gmail dark mode */
      u + .body .green-text {
        color: #006633 !important;
      }
      
      /* Responsive styles with smaller text for mobile */
      @media only screen and (max-width: 600px) {
        .email-container {
          width: 100% !important;
        }
        
        .content-wrapper {
          padding: 40px 20px !important;
        }
        
        .content {
          font-size: 13px !important;
        }
        
        .green-text {
          font-size: 13px !important;
        }
        
        .heading-text {
          font-size: 14px !important;
        }
        
        .signature-text {
          font-size: 14px !important;
        }
      }
    </style>
  </head>
  <body class="body" style="margin: 0; padding: 0; font-family: Calibri, Arial, sans-serif; background-color: #ffffff;">
    <!-- Main wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" role="presentation" class="dark-mode-bg">
      <tr>
        <td align="center" valign="top">
          <!-- Email container -->
          <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" role="presentation">
            <tr>
              <td align="center" valign="top">
                <!-- Content with background image -->
                <div style="background-image: url('https://i.postimg.cc/m2Swg8LC/letter-Head.png'); background-repeat: no-repeat; background-size: 100% 100%; width: 100%; max-width: 600px;" class="dark-mode-bg">
                  <!-- Content wrapper with padding -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                    <tr>
                      <td class="content-wrapper" style="padding: 80px 60px 80px 80px;">
                        <!-- Actual content -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                          <!-- Date -->
                          <tr>
                            <td align="right" style="padding-bottom: 20px;">
                              <p class="green-text dark-mode-text content" style="font-size: 15px; color: #006633 !important; font-weight: normal; margin: 0;">Date: ${formattedDate}</p>
                            </td>
                          </tr>
                          
                          <!-- Addressee -->
                          <tr>
                            <td style="padding-bottom: 15px;">
                              <p class="green-text dark-mode-text content" style="font-size: 15px; line-height: 1.6; color: #006633 !important; margin: 0;">
                                To,<br />
                                <strong class="heading-text" style="font-size: 16px; color: #006633 !important;">${title} ${name}</strong>
                              </p>
                            </td>
                          </tr>
                          
                          <!-- Subject -->
                          <tr>
                            <td style="padding-bottom: 15px;">
                              <p class="green-text dark-mode-text content" style="font-size: 15px; line-height: 1.6; color: #006633 !important; margin: 0;">
                                <strong style="color: #006633 !important;">Subject:</strong> Welcome Letter – ROF Pravasa
                              </p>
                            </td>
                          </tr>
                          
                          <!-- Greeting -->
                          <tr>
                            <td style="padding-bottom: 15px;">
                              <p class="green-text dark-mode-text content" style="font-size: 15px; line-height: 1.6; color: #006633 !important; margin: 0;">Dear Sir/Madam,</p>
                            </td>
                          </tr>
                          
                          <!-- Introduction -->
                          <tr>
                            <td style="padding-bottom: 15px;">
                              <p class="green-text dark-mode-text content" style="font-size: 15px; line-height: 1.6; color: #006633 !important; margin: 0;">Greetings from <strong style="color: #006633 !important;">ROF Group</strong>!</p>
                            </td>
                          </tr>
                          
                          <!-- Paragraph 1 -->
                          <tr>
                            <td style="padding-bottom: 15px;">
                              <p class="green-text dark-mode-text content" style="font-size: 15px; line-height: 1.6; color: #006633 !important; margin: 0; text-align: justify;">
                                We sincerely appreciate your interest in our residential project <strong style="color: #006633 !important;">"ROF PRAVASA"</strong>, 
                                located in Sector 88A, Gurugram, Haryana. It is our privilege to welcome you to the ROF family and 
                                thank you for the trust you've placed in us to help fulfill your dream of owning a home.
                              </p>
                            </td>
                          </tr>
                          
                          <!-- Paragraph 2 -->
                          <tr>
                            <td style="padding-bottom: 15px;">
                              <p class="green-text dark-mode-text content" style="font-size: 15px; line-height: 1.6; color: #006633 !important; margin: 0; text-align: justify;">
                                We are pleased to inform you that we have received your Expression of Interest for booking a residential 
                                unit at ROF PRAVASA. To proceed further, we kindly request you to complete the initial booking amount 
                                in accordance with the prescribed payment plan.
                              </p>
                            </td>
                          </tr>
                          
                          <!-- Paragraph 3 -->
                          <tr>
                            <td style="padding-bottom: 15px;">
                              <p class="green-text dark-mode-text content" style="font-size: 15px; line-height: 1.6; color: #006633 !important; margin: 0; text-align: justify;">
                                Your trust and investment mean a great deal to us. Our team is committed to deliver a seamless and 
                                enriching pre-sale and post-sale experience, ensuring your complete satisfaction.
                              </p>
                            </td>
                          </tr>
                          
                          <!-- Contact Info -->
                          <tr>
                            <td style="padding-bottom: 15px;">
                              <p class="green-text dark-mode-text content" style="font-size: 15px; line-height: 1.6; color: #006633 !important; margin: 0;">
                                For any queries, please contact us at <strong style="color: #006633 !important;">9717022776</strong> or email 
                                <strong style="color: #006633 !important;">pravasa@rof.co.in</strong>.
                              </p>
                            </td>
                          </tr>
                          
                          <!-- Thank You -->
                          <tr>
                            <td style="padding-bottom: 20px;">
                              <p class="green-text dark-mode-text content" style="font-size: 15px; line-height: 1.6; color: #006633 !important; margin: 0; text-align: justify;">
                                Thank you once again for choosing ROF PRAVASA.
                              </p>
                            </td>
                          </tr>
                          
                          <!-- Signature -->
                          <tr>
                            <td style="padding-top: 10px;">
                              <p class="green-text dark-mode-text content" style="font-size: 15px; line-height: 1.6; color: #006633 !important; margin: 0;">
                                Warm regards,<br />
                                <strong class="signature-text" style="font-size: 16px; color: #006633 !important;">ROF GROUP</strong>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`









    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome Letter – ROF Pravasa',
      html: htmlContent,
    });

    res.status(200).json({ message: 'Welcome letter sent and saved successfully.' });

  } catch (error) {
    console.error('Email or DB error:', error);
    res.status(500).json({ message: 'Failed to send welcome letter or save to database.' });
  }
};


export const getWelcomeLetter = async (req, res) => {
    try {
        const letters = await WelcomeLetter.find().sort({ createdAt: -1 });
        if (letters.length === 0) {
        return res.status(200).json({ letters: [], message: "No welcome letters found yet." });
        }
        return res.status(200).json({letters});
    } catch (error) {
        console.error("Error fetching letters:", error);
        return res.status(500).json({ message: "Failed to fetch letters" });
    }
}   

