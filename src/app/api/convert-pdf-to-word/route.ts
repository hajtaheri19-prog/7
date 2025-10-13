import { NextRequest, NextResponse } from 'next/server';
import { pdfToWord } from '@/lib/pdf-to-word';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'فایل انتخاب نشده است' },
        { status: 400 }
      );
    }

    // Validate file
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'فرمت فایل پشتیبانی نمی‌شود' },
        { status: 400 }
      );
    }

    if (file.size > 15 * 1024 * 1024) { // 15MB limit
      return NextResponse.json(
        { error: 'حجم فایل بیش از حد مجاز است' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert PDF to Word
    const result = await pdfToWord(buffer);

    // Create response with file data
    const response = new NextResponse(result.fileName, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${result.fileName}"`,
        'Content-Length': buffer.length.toString(),
      },
    });

    return response;
  } catch (error) {
    console.error('PDF to Word API Error:', error);
    return NextResponse.json(
      { error: 'خطا در تبدیل PDF به Word' },
      { status: 500 }
    );
  }
}
