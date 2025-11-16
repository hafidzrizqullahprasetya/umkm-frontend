import { Umkm } from "@/types/umkm";
import { normalizeUrl } from "./utils";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
};

export async function getAllUmkm(): Promise<Umkm[]> {
  try {
    const baseUrl = getBaseUrl();
    console.log('Fetching UMKM from:', `${baseUrl}/api/umkm`);

    const res = await fetch(normalizeUrl(baseUrl, '/api/umkm'), {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Backend error:', errorText);
      throw new Error(`Failed to fetch UMKM data: ${res.status} ${errorText}`);
    }

    const data = await res.json();

    // Check if data is an array, if not try to get the array from a data property
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.error('Unexpected data format from backend:', typeof data, data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching UMKM data:', error);
    // Return empty array instead of crashing the app
    return [];
  }
}

export async function getUserUmkm(userEmail: string, token?: string): Promise<Umkm[]> {
  try {
    const baseUrl = getBaseUrl();
    console.log('Fetching user UMKM from:', `${baseUrl}/api/umkm/detail?email=${userEmail}`);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(normalizeUrl(baseUrl, `/api/umkm/detail?email=${encodeURIComponent(userEmail)}`), {
      method: 'GET',
      cache: 'no-store',
      headers: headers,
    });

    console.log('Response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Backend error:', errorText);

      // If 404 or 500, user doesn't have any UMKM yet or is administrator
      if (res.status === 404 || res.status === 500) {
        return [];
      }

      throw new Error(`Failed to fetch user UMKM data: ${res.status} ${errorText}`);
    }

    const result = await res.json();
    console.log('Fetched user UMKM:', result);

    // Backend returns { message, data } where data is the umkm object
    return result.data ? [result.data] : [];
  } catch (error) {
    console.error('Error fetching user UMKM data:', error);
    // Return empty array instead of crashing the app
    return [];
  }
}
