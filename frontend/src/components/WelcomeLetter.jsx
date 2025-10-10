import React from "react";
import "../App.css";
export default function WelcomeLetterPreview({ formData }) {
  const { title, name, email, number, unitNumber } = formData;

  const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).replace(/ /g, "-"); // To format like 30-Nov-2024
  };

  return (
    <div className="max-w-3xl mx-auto bg-white carlito-regular  p-8 shadow-md rounded-lg border border-gray-200 font-serif">
      <div className="text-sm text-right mb-4">
        <strong>Date:</strong> {getFormattedDate()}
      </div>

      <div className="mb-6  text-gray-800 carlito-regular">
        <p className="whitespace-pre-line ">
          To,
          <br />
          {title || 'Mr./Mrs.'} {name || '{Name}'}
          {/* <br />
          Email Address: {email || '{Email}'}
          <br />
          Mobile: {number || '{Phone Number}'} */}
        </p>
      </div>

      <div className="mb-6">
        <p className="font-semibold underline text-gray-800 mb-2">
          Subject: Welcome Letter – ROF Pravasa
        </p>

        <p className="mb-4">Dear Sir/Madam,</p>

        <p className="mb-4">
          Greetings from <strong>ROF Group</strong>!
        </p>

        <p className="mb-4">
          We sincerely appreciate your interest in our residential project “<strong>ROF PRAVASA</strong>,” located in Sector 88A, Gurugram, Haryana. It is our privilege to welcome you to the ROF family and thank you for the trust you've placed in us to help fulfill your dream of owning a home.
        </p>

        <p className="mb-4">
          We are pleased to inform you that we have received your Expression of Interest for booking a residential unit at <strong>ROF PRAVASA</strong>. To proceed further, we kindly request you to complete the initial booking amount in accordance with the prescribed payment plan.
        </p>

        <p className="mb-4">
          Your trust and investment mean a great deal to us. We see this as an exceptional opportunity to serve you with dedication and excellence. Our team is committed to deliver a seamless and enriching pre-sale and post-sale experience, ensuring your complete satisfaction throughout the journey.
        </p>

        <p className="mb-4">
          Should you have any queries or require assistance, please feel free to contact us at <strong>9717022776</strong> or write to us at <strong>pravasa@rof.co.in</strong>. Our team is always here to support you at every step.
        </p>

        <p className="mb-4">
          Once again, thank you for choosing <strong>ROF PRAVASA</strong>. We look forward to building a lasting relationship with you.
        </p>
      </div>

      <div className="mt-6">
        <p>Warm regards,</p>
        <p className="font-semibold">ROF GROUP</p>
      </div>
    </div>
  );
}
