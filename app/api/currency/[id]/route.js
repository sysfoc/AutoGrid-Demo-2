import dbconnect from "../../../lib/mongodb.js"
import Currency from "../../../models/Currency.js"
import Car from "../../../models/Car.js"
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await dbconnect();
  const body = await req.json();
  
  const currentCurrency = await Currency.findById(params.id);
  if (!currentCurrency) {
    return NextResponse.json({ error: "Currency not found" }, { status: 404 });
  }
  
  // 1️⃣ If making this currency the new default
  if (body.isDefault && !currentCurrency.isDefault) {
    const prevDefault = await Currency.findOne({ isDefault: true });
    const allCurrencies = await Currency.find({ _id: { $ne: params.id } });
    
    const conversionFactor = parseFloat((1 / currentCurrency.value).toFixed(5));
    
    try {
      // a. Update all car prices to new base
      const cars = await Car.find({});
      for (const car of cars) {
        const newPrice = parseFloat((car.price * currentCurrency.value).toFixed(2));
        await Car.findByIdAndUpdate(car._id, { $set: { price: newPrice } });
      }

      // b. Unset previous default currency and adjust its value
      if (prevDefault) {
        const newPrevDefaultValue = prevDefault.value * conversionFactor;
        await Currency.findByIdAndUpdate(
          prevDefault._id, 
          { isDefault: false, value: newPrevDefaultValue }
        );
      }

      // c. Adjust all other currencies
      for (const currency of allCurrencies) {
        if (currency._id.toString() !== prevDefault?._id?.toString()) {
          const newValue = parseFloat((currency.value * conversionFactor).toFixed(5));
          await Currency.findByIdAndUpdate(currency._id, { value: newValue });
        }
      }

      // d. Finally, make this one default with value 1
      const updated = await Currency.findByIdAndUpdate(
        params.id, 
        { ...body, value: 1, isDefault: true },
        { new: true }
      );
      
      return NextResponse.json(updated);
    } catch (error) {
      console.error("Error updating currencies and cars:", error);
      return NextResponse.json({ error: "Failed to update currencies" }, { status: 500 });
    }
  } 
  
  // 2️⃣ If trying to unset the default currency without switching
  else if (!body.isDefault && currentCurrency.isDefault) {
    return NextResponse.json(
      { error: "Cannot unset default currency. Please set another currency as default first." }, 
      { status: 400 }
    );
  } 
  
  // 3️⃣ Any other normal update
  else {
    const updated = await Currency.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
  }
}

export async function DELETE(req, { params }) {
  await dbconnect();
  
  const currencyToDelete = await Currency.findById(params.id);
  if (currencyToDelete && currencyToDelete.isDefault) {
    return NextResponse.json(
      { error: "Cannot delete default currency. Please set another currency as default first." },
      { status: 400 }
    );
  }
  
  await Currency.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}

export async function GET(req, { params }) {
  await dbconnect();
  try {
    const currency = await Currency.findById(params.id);
    if (!currency) {
      return NextResponse.json({ error: "Currency not found" }, { status: 404 });
    }
    return NextResponse.json(currency, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid ID or server error" }, { status: 500 });
  }
}
