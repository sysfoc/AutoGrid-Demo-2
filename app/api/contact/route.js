import { NextResponse } from "next/server"
import connectDB from "../../lib/mongodb"
import ContactMessage from "../../models/Contact"
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

// Email template function
const getEmailTemplate = (customerName, originalMessage, adminReply, emailUser) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Message Response</title>
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
                <p class="email-subtitle">Response to Your Contact Message</p>
              </div>
              
              <!-- Main Content -->
              <div class="email-body">
                <!-- Greeting -->
                <h2 class="greeting">Dear ${customerName},</h2>
                <p class="intro-text">Thank you for contacting us. We have carefully reviewed your message and are pleased to provide you with our response below.</p>
                
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
                    If you have any additional questions or need more information, please don't hesitate to contact us directly. Our team is here to help you.
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
                <p class="footer-disclaimer">This email was sent in response to your contact message. Please do not reply directly to this email.</p>
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
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All required fields must be provided." }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 })
    }

    // Create and save contact message
    const contactMessage = new ContactMessage({
      name,
      email,
      message,
      status: "pending",
    })

    await contactMessage.save()

    return NextResponse.json(
      {
        message: "Contact message submitted successfully.",
        messageId: contactMessage._id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Contact message submission error:", error)
    return NextResponse.json({ error: "Failed to submit contact message. Please try again later." }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()

    const contactMessages = await ContactMessage.find({}).sort({ createdAt: -1 })

    return NextResponse.json(contactMessages, { status: 200 })
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return NextResponse.json({ error: "Failed to fetch contact messages." }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { messageId, adminReply, repliedBy } = body

    if (!messageId || !adminReply || !repliedBy) {
      return NextResponse.json({ error: "Message ID, admin reply, and replied by are required." }, { status: 400 })
    }

    const contactMessage = await ContactMessage.findById(messageId)
    if (!contactMessage) {
      return NextResponse.json({ error: "Contact message not found." }, { status: 404 })
    }

    // Update message with admin reply
    contactMessage.adminReply = adminReply
    contactMessage.repliedBy = repliedBy
    contactMessage.status = "answered"
    contactMessage.repliedAt = new Date()

    await contactMessage.save()

    // Send email to customer
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: contactMessage.email,
        subject: "Response to Your Contact Message",
        html: getEmailTemplate(
          contactMessage.name,
          contactMessage.message,
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
    console.error("Error replying to contact message:", error)
    return NextResponse.json({ error: "Failed to send reply." }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    await connectDB()
    const body = await request.json()
    const { messageId } = body

    if (!messageId) {
      return NextResponse.json({ error: "Message ID is required." }, { status: 400 })
    }

    const deletedMessage = await ContactMessage.findByIdAndDelete(messageId)
    
    if (!deletedMessage) {
      return NextResponse.json({ error: "Contact message not found." }, { status: 404 })
    }

    return NextResponse.json({ message: "Contact message deleted successfully." }, { status: 200 })
    
  } catch (error) {
    console.error("Error deleting contact message:", error)
    return NextResponse.json({ error: "Failed to delete contact message." }, { status: 500 })
  }
}