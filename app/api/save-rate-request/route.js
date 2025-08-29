// import { type NextRequest, NextResponse } from "next/server"
// import dbConnect from "../../lib/mongodb"
// import RateRequest from "../../models/RateRequest"

// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect()

//     const body = await request.json()
//     const { name, email, mobile, calculationData } = body

//     // Validate required fields
//     if (!name || !email || !mobile) {
//       return NextResponse.json({ error: "Name, email, and mobile are required" }, { status: 400 })
//     }

//     const newRateRequest = new RateRequest({
//       name,
//       email,
//       mobile,
//       calculationData: {
//         carPrice: calculationData.carPrice || 0,
//         carYear: calculationData.carYear || "",
//         depositAmount: calculationData.depositAmount || 0,
//         loanTerm: calculationData.loanTerm || 5,
//         repaymentFrequency: calculationData.repaymentFrequency || "monthly",
//         hasEndOfLoanRepayment: calculationData.hasEndOfLoanRepayment || false,
//         endOfLoanPercentage: calculationData.endOfLoanPercentage || 0,
//         loanAmount: calculationData.loanAmount || 0,
//         interestRate: calculationData.interestRate || 0,
//         comparisonRate: calculationData.comparisonRate || 0,
//         periodicPayment: calculationData.periodicPayment || 0,
//         totalInterest: calculationData.totalInterest || 0,
//         endOfLoanAmount: calculationData.endOfLoanAmount || 0,
//         totalCostOfLoan: calculationData.totalCostOfLoan || 0,
//       },
//     })

//     const savedRequest = await newRateRequest.save()

//     return NextResponse.json(
//       {
//         message: "Rate request saved successfully",
//         id: savedRequest._id,
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     console.error("Error saving rate request:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }
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

// Admin notification email template function
const getAdminNotificationEmailTemplate = (
  name,
  email,
  mobile,
  calculationData,
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Vehicle Financing Enquiry</title>
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
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
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
        
        .customer-section {
          background-color: #f8f9ff;
          border: 1px solid #d1d8e8;
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
          background-color: #6c5ce7;
        }
        
        .section-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #2d3436;
        }
        
        .customer-table {
          width: 100%;
          font-size: 14px;
          color: #2d3436;
        }
        
        .customer-table td {
          padding: 8px;
          border-bottom: 1px solid #f8f9fa;
        }
        
        .customer-label {
          font-weight: 600;
          width: 30%;
        }
        
        .customer-value {
          text-align: left;
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
        
        .action-section {
          background-color: #fff5f5;
          border: 1px solid #fed7d7;
          border-radius: 8px;
          padding: 20px;
          margin: 0 0 30px 0;
        }
        
        .action-text {
          color: #c53030;
          line-height: 1.5;
          margin: 0;
          font-size: 14px;
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
                <h1 class="email-title">New Enquiry Alert</h1>
                <p class="email-subtitle">Vehicle Financing Request</p>
              </div>
              
              <!-- Main Content -->
              <div class="email-body">
                <!-- Greeting -->
                <h2 class="greeting">Admin Team,</h2>
                <p class="intro-text">A new vehicle financing enquiry has been submitted. Please review the details below and respond accordingly.</p>
                
                <!-- Customer Details Section -->
                <div class="customer-section">
                  <div class="section-header">
                    <div class="section-indicator"></div>
                    <h3 class="section-title">Customer Details</h3>
                  </div>
                  <table class="customer-table" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="customer-label">Name:</td>
                      <td class="customer-value">${name}</td>
                    </tr>
                    <tr>
                      <td class="customer-label">Email:</td>
                      <td class="customer-value">${email}</td>
                    </tr>
                    <tr>
                      <td class="customer-label">Mobile:</td>
                      <td class="customer-value">${mobile}</td>
                    </tr>
                  </table>
                </div>
                
                <!-- Calculation Details -->
                <div class="calculation-details">
                  <h4 class="details-title">Financing Request Details</h4>
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
                      <td class="details-label">Deposit Amount:</td>
                      <td class="details-value">$${calculationData.depositAmount?.toLocaleString() || "N/A"}</td>
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
                      <td class="details-label">Repayment Frequency:</td>
                      <td class="details-value">${calculationData.repaymentFrequency || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="details-label">Estimated Payment:</td>
                      <td class="details-value">$${calculationData.periodicPayment?.toLocaleString() || "N/A"} ${calculationData.repaymentFrequency || ""}</td>
                    </tr>
                    <tr>
                      <td class="details-label">Total Interest:</td>
                      <td class="details-value">$${calculationData.totalInterest?.toLocaleString() || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="details-label">Total Cost of Loan:</td>
                      <td class="details-value">$${calculationData.totalCostOfLoan?.toLocaleString() || "N/A"}</td>
                    </tr>
                    ${calculationData.hasEndOfLoanRepayment ? `
                    <tr>
                      <td class="details-label">End of Loan Payment:</td>
                      <td class="details-value">$${calculationData.endOfLoanAmount?.toLocaleString() || "N/A"}</td>
                    </tr>
                    ` : ''}
                  </table>
                </div>
                
                <!-- Action Required -->
                <div class="action-section">
                  <p class="action-text">
                    <strong>Action Required:</strong> Please log into the admin panel to respond to this enquiry and provide the customer with appropriate financing options.
                  </p>
                </div>
              </div>
              
              <!-- Footer -->
              <div class="email-footer">
                <p class="footer-regards">System Notification</p>
                <p class="footer-team">Finance Team Admin Panel</p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, mobile, calculationData } = body;

    // Validate required fields
    if (!name || !email || !mobile) {
      return NextResponse.json(
        { error: "Name, email, and mobile are required" },
        { status: 400 }
      );
    }

    const newRateRequest = new RateRequest({
      name,
      email,
      mobile,
      calculationData: {
        carPrice: calculationData.carPrice || 0,
        carYear: calculationData.carYear || "",
        depositAmount: calculationData.depositAmount || 0,
        loanTerm: calculationData.loanTerm || 5,
        repaymentFrequency: calculationData.repaymentFrequency || "monthly",
        hasEndOfLoanRepayment: calculationData.hasEndOfLoanRepayment || false,
        endOfLoanPercentage: calculationData.endOfLoanPercentage || 0,
        loanAmount: calculationData.loanAmount || 0,
        interestRate: calculationData.interestRate || 0,
        comparisonRate: calculationData.comparisonRate || 0,
        periodicPayment: calculationData.periodicPayment || 0,
        totalInterest: calculationData.totalInterest || 0,
        endOfLoanAmount: calculationData.endOfLoanAmount || 0,
        totalCostOfLoan: calculationData.totalCostOfLoan || 0,
      },
    });

    const savedRequest = await newRateRequest.save();

    // Send admin notification email
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Vehicle Financing Enquiry from ${name}`,
        html: getAdminNotificationEmailTemplate(
          name,
          email,
          mobile,
          calculationData
        ),
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Error sending admin notification email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        message: "Rate request saved successfully",
        id: savedRequest._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving rate request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}