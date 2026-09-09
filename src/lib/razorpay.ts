import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_RDTLsgCLL2DhPX',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 's@6HFpTfj77LDrz',
});
