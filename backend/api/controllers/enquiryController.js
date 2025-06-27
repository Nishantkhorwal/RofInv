import LandingEnquiry from '../models/enquiryModel.js';
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const createEnquiry = async (req, res) => {
  const { name, phoneNumber, email } = req.body;
   const phoneRegex = /^[6-9]\d{9}$/; // Accepts 10-digit numbers starting with 6-9 (common in India)

  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ error: 'Invalid phone number. Please enter a 10-digit number.' });
  }

  try {
    const newEnquiry = new LandingEnquiry({ name, phoneNumber, email });
    await newEnquiry.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: `${process.env.ADMIN_EMAIL}, pravasa88@gmail.com`, // Receiver
      subject: 'New Enquiry Received',
      html: `
        <h3>New Enquiry Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Enquiry submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error while submitting enquiry' });
  }
};
