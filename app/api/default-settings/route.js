import mongoose from 'mongoose';
import DefaultSettings from "../../models/settings/DefaultSettings"
import { NextResponse } from 'next/server';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export async function GET() {
  await connectDB();

  try {
    let settings = await DefaultSettings.findOne();
    if (!settings) {
      settings = new DefaultSettings({});
      await settings.save();
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request) {
  await connectDB();

  try {
    const { distance, address, license } = await request.json();
    
    let settings = await DefaultSettings.findOne();
    if (!settings) {
      settings = new DefaultSettings({});
    }

    // Update only the fields that are provided
    if (distance !== undefined) settings.distance = distance;
    if (address !== undefined) settings.address = address;
    if (license !== undefined) settings.license = license;

    await settings.save();
    return NextResponse.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}