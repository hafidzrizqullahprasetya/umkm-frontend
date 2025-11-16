import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const umkmId = parseInt(params.id);
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://be-mia-umkm.vercel.app';
    const response = await fetch(`${baseUrl}/api/umkm/delete/${umkmId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', errorText);
      return NextResponse.json({ message: 'Backend API Error', error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting UMKM from backend:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete UMKM', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
