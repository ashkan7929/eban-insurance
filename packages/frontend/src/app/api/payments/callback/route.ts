import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const orderId = searchParams.get('orderId') || searchParams.get('order_id') || '';
  const authority = searchParams.get('Authority') || searchParams.get('authority') || '';
  const status = searchParams.get('Status') || searchParams.get('status') || 'OK';
  const orderNo = searchParams.get('orderNo') || searchParams.get('order_no') || orderId;

  try {
    // TODO: Replace with actual payment gateway verification
    // const verifyResult = await api.post('/payments/verify', { authority, orderId });
    // const isSuccess = verifyResult.data?.success;
    // const finalOrderNumber = verifyResult.data?.orderNumber || orderNo;

    // MVP Mock: Treat 'OK' / 'success' status as verified payment
    const normalizedStatus = String(status).toLowerCase();
    const isSuccess =
      normalizedStatus === 'ok' ||
      normalizedStatus === 'success' ||
      normalizedStatus === 'successful' ||
      normalizedStatus === 'true' ||
      normalizedStatus === '1';

    // Simulate backend update of order status
    // await api.patch(`/orders/${orderId}`, {
    //   status: isSuccess ? 'PAID' : 'FAILED',
    //   transactionId: authority || `mock-tx-${Date.now()}`,
    // });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
      : '';

    if (isSuccess) {
      const redirectParams = new URLSearchParams();
      if (orderId) redirectParams.set('orderId', orderId);
      redirectParams.set('status', 'success');
      if (orderNo) redirectParams.set('orderNo', orderNo);
      return NextResponse.redirect(`${baseUrl}/payment/success?${redirectParams.toString()}`);
    }

    const failParams = new URLSearchParams();
    if (orderId) failParams.set('orderId', orderId);
    failParams.set('reason', 'gateway_rejected');
    return NextResponse.redirect(`${baseUrl}/payment/failed?${failParams.toString()}`);
  } catch (error) {
    const failParams = new URLSearchParams();
    if (orderId) failParams.set('orderId', orderId);
    failParams.set('reason', 'internal_error');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
      : '';
    return NextResponse.redirect(`${baseUrl}/payment/failed?${failParams.toString()}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const orderId =
      body?.orderId ||
      body?.order_id ||
      body?.OrderId ||
      '';
    const authority =
      body?.authority ||
      body?.Authority ||
      body?.token ||
      '';
    const status =
      body?.status ||
      body?.Status ||
      body?.ResCode ||
      '';
    const orderNo =
      body?.orderNo ||
      body?.order_no ||
      body?.OrderNo ||
      orderId;

    const normalizedStatus = String(status).toLowerCase();
    const isSuccess =
      normalizedStatus === 'ok' ||
      normalizedStatus === 'success' ||
      normalizedStatus === 'successful' ||
      normalizedStatus === 'true' ||
      normalizedStatus === '1' ||
      normalizedStatus === '0' || // Some gateways use 0 for success
      status === 0;

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        authority,
        verified: isSuccess,
        orderNo,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to handle payment callback',
      },
      { status: 500 }
    );
  }
}
