import { NextResponse } from "next/server"
import dbConnect from "../../lib/mongodb"
import Valuation from "../../models/Valuation"
import nodemailer from "nodemailer"

const getValuationEmailTemplate = (name, make, model, valuationType, estimatedValue, adminReply, repliedBy, valuationId) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Car Valuation is Ready!</title>
      <style>
        .email-container {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .email-title {
          color: #2563eb;
        }
        
        .vehicle-details {
          background-color: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .vehicle-details-title {
          margin-top: 0;
          color: #374151;
        }
        
        .response-section {
          background-color: #ecfdf5;
          border-left: 4px solid #10b981;
          padding: 20px;
          margin: 20px 0;
        }
        
        .response-title {
          margin-top: 0;
          color: #065f46;
        }
        
        .response-text {
          white-space: pre-wrap;
          color: #374151;
        }
        
        .footer-divider {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 30px 0;
        }
        
        .footer-info {
          font-size: 12px;
          color: #6b7280;
        }
        
        @media (max-width: 600px) {
          .email-container {
            margin: 0 10px;
            max-width: calc(100% - 20px);
          }
          
          .vehicle-details,
          .response-section {
            padding: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <h2 class="email-title">Your Car Valuation Response</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your patience. We have completed the valuation for your <strong>${make} ${model}</strong>.</p>
        
        <div class="vehicle-details">
          <h3 class="vehicle-details-title">Vehicle Details:</h3>
          <p><strong>Vehicle:</strong> ${make} ${model}</p>
          <p><strong>Valuation Type:</strong> ${valuationType}</p>
          ${estimatedValue ? `<p><strong>Estimated Value:</strong> ${estimatedValue}</p>` : ""}
        </div>
        
        <div class="response-section">
          <h3 class="response-title">Our Response:</h3>
          <p class="response-text">${adminReply}</p>
        </div>
        
        <p>If you have any questions about this valuation or would like to discuss next steps, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>
        ${repliedBy || "The Car Valuation Team"}</p>
        
        <hr class="footer-divider">
        <p class="footer-info">
          Request ID: ${valuationId}<br>
          Response Date: ${new Date().toLocaleDateString()}
        </p>
      </div>
    </body>
    </html>
  `
}

export async function GET() {
  try {
    await dbConnect()
    const valuations = await Valuation.find({}).sort({ createdAt: -1 })
    return NextResponse.json(valuations)
  } catch (error) {
    console.error("Error fetching valuations:", error)
    return NextResponse.json({ error: "Failed to fetch valuations" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const body = await request.json()

    const { name, email, make, model, valuationType } = body

    // Validation
    if (!name || !email || !make || !model || !valuationType) {
      return NextResponse.json({ error: "Name, email, make, model, and valuation type are required" }, { status: 400 })
    }

    const newValuation = await Valuation.create({
      name,
      email,
      make,
      model,
      valuationType,
    })

    // No emails sent on POST - just save the request
    return NextResponse.json({
      success: true,
      message: "Valuation request submitted successfully",
      valuation: newValuation,
    })
  } catch (error) {
    console.error("Error creating valuation:", error)
    return NextResponse.json({ error: "Failed to submit valuation request" }, { status: 500 })
  }
}

// PUT - Update valuation (admin reply)
export async function PUT(request) {
  try {
    await dbConnect()
    const body = await request.json()
    const { valuationId, adminReply, estimatedValue, repliedBy } = body

    if (!valuationId || !adminReply) {
      return NextResponse.json({ error: "Valuation ID and admin reply are required" }, { status: 400 })
    }

    const updatedValuation = await Valuation.findByIdAndUpdate(
      valuationId,
      {
        adminReply,
        estimatedValue: estimatedValue || "",
        repliedBy: repliedBy || "Admin",
        status: "responded",
        repliedAt: new Date(),
      },
      { new: true },
    )

    if (!updatedValuation) {
      return NextResponse.json({ error: "Valuation not found" }, { status: 404 })
    }

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      })

      // Test the connection
      await transporter.verify()
      
      const replyMailOptions = {
        from: process.env.EMAIL_USER,
        to: updatedValuation.email,
        subject: "Your Car Valuation is Ready!",
        html: getValuationEmailTemplate(
          updatedValuation.name,
          updatedValuation.make,
          updatedValuation.model,
          updatedValuation.valuationType,
          estimatedValue,
          adminReply,
          repliedBy,
          updatedValuation._id
        ),
      }

      await transporter.sendMail(replyMailOptions)
      
    } catch (emailError) {
      console.error("Detailed reply email error (PUT):", emailError)
      console.error("Error code:", emailError.code)
      console.error("Error message:", emailError.message)
      // Don't fail the request if email fails, but log the error
    }

    return NextResponse.json({
      success: true,
      message: "Reply sent successfully and customer notified via email",
      valuation: updatedValuation,
    })
  } catch (error) {
    console.error("Error updating valuation:", error)
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 })
  }
}

// DELETE - Delete valuation
export async function DELETE(request) {
  try {
    await dbConnect()
    const body = await request.json()
    const { valuationId } = body

    if (!valuationId) {
      return NextResponse.json({ error: "Valuation ID is required" }, { status: 400 })
    }

    const deletedValuation = await Valuation.findByIdAndDelete(valuationId)

    if (!deletedValuation) {
      return NextResponse.json({ error: "Valuation not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Valuation deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting valuation:", error)
    return NextResponse.json({ error: "Failed to delete valuation" }, { status: 500 })
  }
}