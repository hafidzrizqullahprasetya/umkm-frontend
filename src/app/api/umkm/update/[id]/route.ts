import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const umkmId = parseInt(id);
    const body = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://be-mia-umkm.vercel.app';
    const response = await fetch(`${baseUrl}/api/umkm/update/${umkmId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', errorText);
      return NextResponse.json({ message: 'Backend API Error', error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating UMKM in backend:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update UMKM', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
