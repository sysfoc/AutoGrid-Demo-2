import { NextResponse , NextRequest } from "next/server";
import dbConnect from "../../../lib/mongodb"
import Currency from "../../../models/Currency"
export async function GET() {
  await dbConnect();
  const defaultCurrency = await Currency.findOne({ isDefault: true });
  
  if (!defaultCurrency) {
    return NextResponse.json(null, { status: 404 });
  }
  
  return NextResponse.json(defaultCurrency);
}
export async function POST(req:NextRequest) {
  await dbConnect();
  const body = await req.json();
  
  const { amount, fromCurrency, toCurrency } = body;
  
  if (!amount || !fromCurrency || !toCurrency) {
    return NextResponse.json(
      { error: "Missing required parameters" }, 
      { status: 400 }
    );
  }
  
  try {
    const fromCurrencyDoc = await Currency.findById(fromCurrency);
    const toCurrencyDoc = await Currency.findById(toCurrency);
    
    if (!fromCurrencyDoc || !toCurrencyDoc) {
      return NextResponse.json(
        { error: "One or both currencies not found" }, 
        { status: 404 }
      );
    }
    const convertedAmount = parseFloat(((amount * toCurrencyDoc.value) / fromCurrencyDoc.value).toFixed(5));
    
    return NextResponse.json({
      amount,
      convertedAmount,
      fromCurrency: fromCurrencyDoc.name,
      toCurrency: toCurrencyDoc.name
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error converting currencies" }, 
      { status: 500 }
    );
  }
}