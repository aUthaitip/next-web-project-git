import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import prisma from '@/backend/prisma';
import { sessionOptions, SessionData } from '@/backend/session';

export const runtime = 'nodejs';

export async function PUT(req: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }, { status: 401 });
    }

    const { name, email, phone, currentPassword, newPassword, image } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อและอีเมลให้ครบถ้วน' }, { status: 400 });
    }

    // Check if email is updated and unique
    if (email !== session.userEmail) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== session.userId) {
        return NextResponse.json({ error: 'อีเมลนี้ถูกใช้งานโดยบัญชีอื่นแล้ว' }, { status: 409 });
      }
    }

    // Load user to check current password if new password is provided
    const dbUser = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!dbUser) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้ในระบบ' }, { status: 404 });
    }

    let updateData: any = {
      name,
      email,
      phone: phone || null,
      image: image !== undefined ? image : undefined,
    };

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'กรุณากรอกรหัสผ่านปัจจุบันเพื่อเปลี่ยนรหัสผ่านใหม่' }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' }, { status: 400 });
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
    });

    // Save updated info in session
    session.userName = updatedUser.name;
    session.userEmail = updatedUser.email;
    session.userPhone = updatedUser.phone || '';
    session.userImage = updatedUser.image ? 'has_image' : '';
    await session.save();

    return NextResponse.json({
      success: true,
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        image: updatedUser.image,
      }
    });

  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: `เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์: ${error?.message || error}` }, { status: 500 });
  }
}
