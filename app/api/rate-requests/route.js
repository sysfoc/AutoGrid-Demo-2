import { NextResponse } from "next/server";
import dbConnect from "../../lib/mongodb";
import RateRequest from "../../models/RateRequest";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Rate request email template function
const getRateRequestEmailTemplate = (
  name,
  adminReply,
  calculationData,
  emailUser,
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rate Request Response</title>
      <style>
        .email-container {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #f5f5f5;
        }
        
        .email-wrapper {
          background-color: #f5f5f5;
          padding: 20px 0;
          width: 100%;
        }
        
        .email-content {
          max-width: 600px;
          width: 100%;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin: 0 auto;
        }
        
        .email-header {
          background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
          padding: 40px 30px;
          text-align: center;
        }
        
        .email-title {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        
        .email-subtitle {
          color: #ecf0f1;
          margin: 8px 0 0 0;
          font-size: 16px;
          font-weight: 400;
        }
        
        .email-body {
          padding: 40px 30px;
        }
        
        .greeting {
          color: #2c3e50;
          margin: 0 0 20px 0;
          font-size: 24px;
          font-weight: 600;
        }
        
        .intro-text {
          color: #5a6c7d;
          line-height: 1.6;
          margin: 0 0 30px 0;
          font-size: 16px;
        }
        
        .response-section {
          background-color: #f8fff9;
          border: 1px solid #d1ecf1;
          border-radius: 8px;
          padding: 24px;
          margin: 0 0 30px 0;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .section-indicator {
          width: 4px;
          height: 20px;
          margin-right: 12px;
          border-radius: 2px;
          background-color: #28a745;
        }
        
        .section-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #155724;
        }
        
        .admin-response {
          color: #155724;
          line-height: 1.6;
          margin: 0;
          font-size: 15px;
          white-space: pre-line;
        }
        
        .calculation-details {
          background-color: #fff9f0;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 20px;
          margin: 0 0 30px 0;
        }
        
        .details-title {
          color: #856404;
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
        }
        
        .details-table {
          width: 100%;
          font-size: 14px;
          color: #856404;
        }
        
        .details-table td {
          padding: 8px;
          border-bottom: 1px solid #f8f9fa;
        }
        
        .details-label {
          font-weight: 600;
          width: 50%;
        }
        
        .details-value {
          text-align: right;
        }
        
        .additional-info {
          background-color: #fff9f0;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 20px;
          margin: 0 0 30px 0;
        }
        
        .additional-info-text {
          color: #856404;
          line-height: 1.5;
          margin: 0;
          font-size: 14px;
        }
        
        .contact-section {
          border-top: 1px solid #e9ecef;
          padding-top: 24px;
          margin-top: 30px;
        }
        
        .contact-title {
          color: #2c3e50;
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .contact-table {
          width: 100%;
          font-size: 14px;
          color: #5a6c7d;
        }
        
        .contact-table td {
          padding: 8px;
        }
        
        .contact-label {
          width: 80px;
          font-weight: 600;
        }
        
        .email-footer {
          background-color: #f8f9fa;
          padding: 24px 30px;
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        
        .footer-regards {
          color: #6c757d;
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
        }
        
        .footer-team {
          color: #495057;
          margin: 0;
          font-size: 14px;
          font-weight: 700;
        }
        
        .footer-disclaimer {
          color: #adb5bd;
          margin: 16px 0 0 0;
          font-size: 12px;
        }
        
        @media (max-width: 600px) {
          .email-content {
            margin: 0 10px;
            max-width: calc(100% - 20px);
          }
          
          .email-header,
          .email-body,
          .email-footer {
            padding-left: 20px;
            padding-right: 20px;
          }
          
          .email-title {
            font-size: 24px;
          }
          
          .greeting {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body class="email-container">
      <table class="email-wrapper" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <div class="email-content">
              <!-- Header Section -->
              <div class="email-header">
                <h1 class="email-title">Finance Team</h1>
                <p class="email-subtitle">Response to Your Rate Request</p>
              </div>
              
              <!-- Main Content -->
              <div class="email-body">
                <!-- Greeting -->
                <h2 class="greeting">Dear ${name},</h2>
                <p class="intro-text">Thank you for your rate request. We have carefully reviewed your information and are pleased to provide you with our response below.</p>
                
                <!-- Response Section -->
                <div class="response-section">
                  <div class="section-header">
                    <div class="section-indicator"></div>
                    <h3 class="section-title">Our Response</h3>
                  </div>
                  <p class="admin-response">${adminReply}</p>
                </div>
                
                <!-- Calculation Details -->
                <div class="calculation-details">
                  <h4 class="details-title">Your Original Request Details</h4>
                  <table class="details-table" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="details-label">Car Price:</td>
                      <td class="details-value">$${calculationData.carPrice?.toLocaleString() || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="details-label">Car Year:</td>
                      <td class="details-value">${calculationData.carYear || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="details-label">Loan Amount:</td>
                      <td class="details-value">$${calculationData.loanAmount?.toLocaleString() || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="details-label">Loan Term:</td>
                      <td class="details-value">${calculationData.loanTerm || "N/A"} years</td>
                    </tr>
                    <tr>
                      <td class="details-label">Estimated Payment:</td>
                      <td class="details-value">$${calculationData.periodicPayment?.toLocaleString() || "N/A"} ${calculationData.repaymentFrequency || ""}</td>
                    </tr>
                  </table>
                </div>
                
                <!-- Additional Information -->
                <div class="additional-info">
                  <p class="additional-info-text">
                    <strong>Need Further Assistance?</strong><br>
                    If you have any additional questions or would like to discuss your financing options further, please don't hesitate to contact us directly. Our finance team is here to help you secure the best rates.
                  </p>
                </div>
              </div>
              
              <!-- Footer -->
              <div class="email-footer">
                <p class="footer-regards">Best regards,</p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// GET - Fetch all rate requests
export async function GET() {
  try {
    await dbConnect();

    const rateRequests = await RateRequest.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(rateRequests, { status: 200 });
  } catch (error) {
    console.error("Error fetching rate requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update rate request with admin reply
export async function PUT(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { requestId, adminReply, repliedBy } = body;

    if (!requestId || !adminReply?.trim() || !repliedBy) {
      return NextResponse.json(
        { error: "Request ID, admin reply, and replied by are required" },
        { status: 400 },
      );
    }

    const rateRequest = await RateRequest.findById(requestId);
    if (!rateRequest) {
      return NextResponse.json(
        { error: "Rate request not found" },
        { status: 404 },
      );
    }

    // Update the rate request
    rateRequest.adminReply = adminReply;
    rateRequest.repliedBy = repliedBy;
    rateRequest.status = "answered";
    rateRequest.repliedAt = new Date();

    await rateRequest.save();

    // Send email notification
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: rateRequest.email,
        subject: "Response to Your Rate Request",
        html: getRateRequestEmailTemplate(
          rateRequest.name,
          adminReply,
          rateRequest.calculationData,
          process.env.EMAIL_USER,
        ),
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        message: "Reply sent successfully and customer notified",
        rateRequest,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating rate request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a rate request
export async function DELETE(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 },
      );
    }

    const deletedRequest = await RateRequest.findByIdAndDelete(requestId);
    if (!deletedRequest) {
      return NextResponse.json(
        { error: "Rate request not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Rate request deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting rate request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
