import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

export async function POST(req: Request) {
  try {
    const { phoneNumber, message } = await req.json();

    // Basic normalization: ensure it starts with +
    let formattedNumber = phoneNumber.replace(/[^0-9+]/g, '');
    if (!formattedNumber.startsWith('+')) {
      // Default to US +1 if no country code, or handle differently based on your target region
      formattedNumber = '+' + formattedNumber;
    }

    if (!accountSid || !authToken || !twilioNumber) {
      console.error('Twilio credentials missing');
      return NextResponse.json({ error: 'Telephony service not configured' }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);

    // Create a call
    const call = await client.calls.create({
      twiml: `<Response><Say voice="Polly.Joey">${message}</Say></Response>`,
      to: formattedNumber,
      from: twilioNumber,
    });

    return NextResponse.json({ success: true, callSid: call.sid });
  } catch (error: any) {
    console.error('Twilio call error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
