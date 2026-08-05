import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // User ID passed in state
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (error) {
    console.error('LINE Login Callback Error:', error, errorDescription);
    return NextResponse.redirect(`${siteUrl}/profile?error=${encodeURIComponent(errorDescription || 'LINE login cancelled')}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${siteUrl}/profile?error=Invalid+callback+parameters`);
  }

  const userId = parseInt(state);
  if (isNaN(userId)) {
    return NextResponse.redirect(`${siteUrl}/profile?error=Invalid+session+state`);
  }

  const clientId = process.env.LINE_LOGIN_CHANNEL_ID || process.env.LINE_CHANNEL_ID;
  const clientSecret = process.env.LINE_LOGIN_CHANNEL_SECRET || process.env.LINE_CHANNEL_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing LINE Login channel credentials in environment variables.');
    return NextResponse.redirect(`${siteUrl}/profile?error=Server+configuration+error`);
  }

  try {
    // Exchange auth code for access token
    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'authorization_code');
    tokenParams.append('code', code);
    tokenParams.append('redirect_uri', `${siteUrl}/api/auth/line/callback`);
    tokenParams.append('client_id', clientId);
    tokenParams.append('client_secret', clientSecret);

    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams,
    });

    if (!tokenRes.ok) {
      const tokenErrorText = await tokenRes.text();
      console.error('Failed to get token from LINE:', tokenErrorText);
      return NextResponse.redirect(`${siteUrl}/profile?error=Failed+to+authenticate+with+LINE`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile from LINE using the access token
    const profileRes = await fetch('https://api.line.me/v2/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!profileRes.ok) {
      const profileErrorText = await profileRes.text();
      console.error('Failed to get user profile from LINE:', profileErrorText);
      return NextResponse.redirect(`${siteUrl}/profile?error=Failed+to+fetch+LINE+profile`);
    }

    const profileData = await profileRes.json();
    const lineUserId = profileData.userId; // User ID from LINE

    if (!lineUserId) {
      return NextResponse.redirect(`${siteUrl}/profile?error=Unable+to+retrieve+LINE+User+ID`);
    }

    // Save lineUserId to the User database record
    await prisma.user.update({
      where: { id: userId },
      data: { lineUserId },
    });

    return NextResponse.redirect(`${siteUrl}/profile?success=LINE+account+connected+successfully`);
  } catch (err) {
    console.error('Error in LINE callback route:', err);
    return NextResponse.redirect(`${siteUrl}/profile?error=Internal+server+error`);
  }
}
