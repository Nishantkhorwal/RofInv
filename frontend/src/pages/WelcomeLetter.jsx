import React from 'react';

export default function WelcomeLetterEmail() {
  return (
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{ fontFamily: 'Calibri, sans-serif', backgroundColor: '#f4f4f4', padding: '20px 0' }}
    >
      <tbody>
        <tr>
          <td align="center">
            <table
              width="566"
              
              cellPadding="0"
              cellSpacing="0"
              style={{
                backgroundImage: "url('https://i.postimg.cc/m2Swg8LC/letter-Head.png')",
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
                width: '566px',
                height: '400px',
                backgroundColor: '#fff',
                color: '#000',
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: '140px 40px 100px 40px',
                      fontSize: '16px',
                      lineHeight: '1.5',
                    }}
                  >
                    <p style={{ textAlign: 'right', marginBottom: '25px', fontSize: '15px' }}>
                      Date: {/* Insert date dynamically */}
                    </p>

                    <p style={{ marginBottom: '8px', fontSize: '16px' }}>
                      To,<br />
                      <span style={{ fontSize: '17px', fontWeight: 'bold' }}>title : Name</span>
                      <br />
                    </p>

                    <p style={{ margin: '25px 0 20px 0', fontSize: '17px' }}>
                      <strong>Subject:</strong> Welcome Letter – ROF Pravasa
                    </p>

                    <p style={{ marginBottom: '18px' }}>Dear Sir/Madam,</p>

                    <p style={{ marginBottom: '18px' }}>
                      Greetings from <strong>ROF Group</strong>!
                    </p>

                    <p style={{ marginBottom: '18px', textAlign: 'justify' }}>
                      We sincerely appreciate your interest in our residential project{' '}
                      <strong>"ROF PRAVASA"</strong>, located in Sector 88A, Gurugram, Haryana.
                      It is our privilege to welcome you to the ROF family and thank you for the
                      trust you've placed in us to help fulfill your dream of owning a home.
                    </p>

                    <p style={{ marginBottom: '18px', textAlign: 'justify' }}>
                      We are pleased to inform you that we have received your Expression of
                      Interest for booking a residential unit at ROF PRAVASA. To proceed
                      further, we kindly request you to complete the initial booking amount in
                      accordance with the prescribed payment plan.
                    </p>

                    <p style={{ marginBottom: '18px', textAlign: 'justify' }}>
                      Your trust and investment mean a great deal to us. Our team is committed
                      to deliver a seamless and enriching pre-sale and post-sale experience,
                      ensuring your complete satisfaction.
                    </p>

                    <p style={{ marginBottom: '18px' }}>
                      For any queries, please contact us at <strong>9717022776</strong> or email{' '}
                      <strong>pravasa@rof.co.in</strong>.
                    </p>

                    <p style={{ marginBottom: '25px', textAlign: 'justify' }}>
                      Thank you once again for choosing ROF PRAVASA.
                    </p>

                    <p style={{ marginTop: '40px' }}>
                      Warm regards,<br />
                      <strong style={{ fontSize: '17px' }}>ROF GROUP</strong>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
