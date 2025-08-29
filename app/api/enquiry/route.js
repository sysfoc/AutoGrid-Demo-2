import { NextResponse } from "next/server"
import connectDB from "../../lib/mongodb"
import CarEnquiry from "../../models/CarEnquiry"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Car enquiry email template function
const getCarEnquiryEmailTemplate = (firstName, lastName, originalMessage, adminReply, emailUser) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Car Enquiry Response</title>
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
        
        .message-section {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 24px;
          margin: 0 0 24px 0;
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
        }
        
        .original-indicator {
          background-color: #6c757d;
        }
        
        .response-indicator {
          background-color: #28a745;
        }
        
        .section-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        
        .original-title {
          color: #495057;
        }
        
        .response-title {
          color: #155724;
        }
        
        .original-message {
          color: #6c757d;
          line-height: 1.5;
          margin: 0;
          font-size: 15px;
          font-style: italic;
        }
        
        .response-section {
          background-color: #f8fff9;
          border: 1px solid #d1ecf1;
          border-radius: 8px;
          padding: 24px;
          margin: 0 0 30px 0;
        }
        
        .admin-response {
          color: #155724;
          line-height: 1.6;
          margin: 0;
          font-size: 15px;
          white-space: pre-line;
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
                <h1 class="email-title">Car Dealership</h1>
                <p class="email-subtitle">Response to Your Vehicle Enquiry</p>
              </div>
              
              <!-- Main Content -->
              <div class="email-body">
                <!-- Greeting -->
                <h2 class="greeting">Dear ${firstName} ${lastName},</h2>
                <p class="intro-text">Thank you for your interest in our vehicles. We have carefully reviewed your enquiry and are pleased to provide you with our response below.</p>
                
                <!-- Original Message Section -->
                <div class="message-section">
                  <div class="section-header">
                    <div class="section-indicator original-indicator"></div>
                    <h3 class="section-title original-title">Your Original Message</h3>
                  </div>
                  <p class="original-message">${originalMessage}</p>
                </div>
                
                <!-- Response Section -->
                <div class="response-section">
                  <div class="section-header">
                    <div class="section-indicator response-indicator"></div>
                    <h3 class="section-title response-title">Our Response</h3>
                  </div>
                  <p class="admin-response">${adminReply}</p>
                </div>
                
                <!-- Additional Information -->
                <div class="additional-info">
                  <p class="additional-info-text">
                    <strong>Need Further Assistance?</strong><br>
                    If you have any additional questions or would like to schedule a test drive, please don't hesitate to contact us directly. Our team is here to help you find the perfect vehicle.
                  </p>
                </div>
                
                <!-- Contact Information -->
                <div class="contact-section">
                  <h4 class="contact-title">Contact Information</h4>
                  <table class="contact-table" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="contact-label">Phone:</td>
                      <td>+1 (555) 123-4567</td>
                    </tr>
                    <tr>
                      <td class="contact-label">Email:</td>
                      <td>${emailUser}</td>
                    </tr>
                    <tr>
                      <td class="contact-label">Hours:</td>
                      <td>Mon-Fri: 9:00 AM - 7:00 PM, Sat: 9:00 AM - 5:00 PM</td>
                    </tr>
                  </table>
                </div>
              </div>
              
              <!-- Footer -->
              <div class="email-footer">
                <p class="footer-regards">Best regards,</p>
                <p class="footer-team">Car Dealership Team</p>
                <p class="footer-disclaimer">This email was sent in response to your vehicle enquiry. Please do not reply directly to this email.</p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { carId, firstName, lastName, email, phone, message, recaptchaToken } = body // Destructure recaptchaToken

    // Fetch reCAPTCHA settings from DB to check if it's active
    const settingsRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/settings/general`,
      {
        cache: "no-store",
        next: { revalidate: 0 },
      },
    )
    const settingsData = await settingsRes.json()
    const recaptchaSettings = settingsData?.settings?.recaptcha

    // --- reCAPTCHA Verification Logic ---
    if (recaptchaSettings?.status === "active" && recaptchaSettings?.siteKey) {
      const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY

      if (!RECAPTCHA_SECRET_KEY) {
        console.error("RECAPTCHA_SECRET_KEY is not set in environment variables.")
        return NextResponse.json({ error: "Server reCAPTCHA configuration error." }, { status: 500 })
      }

      if (!recaptchaToken) {
        return NextResponse.json({ error: "reCAPTCHA token missing." }, { status: 400 })
      }

      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`
      const verifyResponse = await fetch(verifyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      })

      const recaptchaData = await verifyResponse.json()

      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return NextResponse.json({ error: "reCAPTCHA verification failed. Please try again." }, { status: 400 })
      }
    }
    // --- End reCAPTCHA Verification Logic ---

    if (!carId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: "All required fields must be provided." }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 })
    }

    // Create and save car enquiry
    const carEnquiry = new CarEnquiry({
      carId,
      firstName,
      lastName,
      email,
      phone,
      message: message || "",
      status: "pending",
    })

    await carEnquiry.save()

    return NextResponse.json(
      {
        message: "Car enquiry submitted successfully.",
        enquiryId: carEnquiry._id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Car enquiry submission error:", error)
    return NextResponse.json({ error: "Failed to submit car enquiry. Please try again later." }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()

    const enquiries = await CarEnquiry.find({}).sort({ createdAt: -1 })

    return NextResponse.json(enquiries, { status: 200 })
  } catch (error) {
    console.error("Error fetching car enquiries:", error)
    return NextResponse.json({ error: "Failed to fetch car enquiries." }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { enquiryId, adminReply, repliedBy } = body

    if (!enquiryId || !adminReply || !repliedBy) {
      return NextResponse.json({ error: "Enquiry ID, admin reply, and replied by are required." }, { status: 400 })
    }

    const enquiry = await CarEnquiry.findById(enquiryId)
    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found." }, { status: 404 })
    }

    // Update enquiry with admin reply
    enquiry.adminReply = adminReply
    enquiry.repliedBy = repliedBy
    enquiry.status = "answered"
    enquiry.repliedAt = new Date()

    await enquiry.save()

    // Send email to customer
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: enquiry.email,
        subject: "Response to Your Car Enquiry",
        html: getCarEnquiryEmailTemplate(
          enquiry.firstName,
          enquiry.lastName,
          enquiry.message,
          adminReply,
          process.env.EMAIL_USER
        ),
      }

      await transporter.sendMail(mailOptions)
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ message: "Reply sent successfully and customer notified." }, { status: 200 })
  } catch (error) {
    console.error("Error replying to enquiry:", error)
    return NextResponse.json({ error: "Failed to send reply." }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { enquiryId } = body;

    if (!enquiryId) {
      return NextResponse.json(
        { error: "Enquiry ID is required." },
        { status: 400 }
      );
    }

    const deletedEnquiry = await CarEnquiry.findByIdAndDelete(enquiryId);

    if (!deletedEnquiry) {
      return NextResponse.json(
        { error: "Enquiry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Enquiry deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete enquiry." },
      { status: 500 }
    );
  }
}