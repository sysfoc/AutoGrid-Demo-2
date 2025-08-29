import dbConnect from "../../lib/mongodb"
import Currency from "../../models/Currency"
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const currencies = await Currency.find();
  return NextResponse.json(currencies);
}


export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  if (body.value) {
    body.value = parseFloat(parseFloat(body.value).toFixed(5));
  }
  
  if (body.isDefault) {
    const prevDefault = await Currency.findOne({ isDefault: true });
    
    if (prevDefault) {
      const allCurrencies = await Currency.find();
      const conversionFactor = parseFloat((1 / currentCurrency.value).toFixed(5));
      const session = await Currency.startSession();
      
      try {
        session.startTransaction();
        const newPrevDefaultValue = parseFloat((prevDefault.value * conversionFactor).toFixed(5));
        await Currency.findByIdAndUpdate(
          prevDefault._id, 
          { isDefault: false, value: newPrevDefaultValue },
          { session }
        );
        
        for (const currency of allCurrencies) {
          if (currency._id.toString() !== prevDefault._id.toString()) {
            const newValue = parseFloat((currency.value * conversionFactor).toFixed(5));
            await Currency.findByIdAndUpdate(
              currency._id, 
              { value: newValue },
              { session }
            );
          }
        }
        
        const newCurrency = await Currency.create(
          [{ ...body, value: 1 }],
          { session }
        );
        
        await session.commitTransaction();
        return NextResponse.json(newCurrency[0], { status: 201 });
      } catch (error) {
        await session.abortTransaction();
        console.error("Transaction failed:", error);
        return NextResponse.json({ error: "Failed to create currency" }, { status: 500 });
      } finally {
        session.endSession();
      }
    } else {
      const newCurrency = await Currency.create({ ...body, value: 1 });
      return NextResponse.json(newCurrency, { status: 201 });
    }
  } else {
    const newCurrency = await Currency.create(body);
    return NextResponse.json(newCurrency, { status: 201 });
  }
}