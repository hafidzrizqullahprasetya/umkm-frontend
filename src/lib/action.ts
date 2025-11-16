import { signIn } from "next-auth/react";

export async function credetialLogin(formData: FormData) {
    try {
        // First, try to login via the backend to validate credentials and get proper error messages
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                error: data.message || 'Login gagal. Silakan coba lagi.'
            };
        }

        // If backend login is successful, use NextAuth credentials sign in
        const login = await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false
        });

        // Return login result with role from backend response
        return {
            ...login,
            role: data.data?.role
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            error: error instanceof Error ? error.message : 'An unknown error occurred during login'
        };
    }
}

export async function credentialRegister(formData: FormData) {
    try {
        console.log('[Register] Form Data:', {
            email: formData.get('email'),
            username: formData.get('username'),
            password: formData.get('password')
        });

        const registerRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.get('email'),
                username: formData.get('username'),
                password: formData.get('password')
            }),
        });

        const responseData = await registerRes.json();
        console.log('[Register] Response:', responseData);

        if (!registerRes.ok) {
            return {
                error: responseData.message || 'Registrasi gagal. Silakan coba lagi.'
            };
        }

        if (registerRes.status === 201) {
            // Automatically sign in after successful registration
            const login = await signIn('credentials', {
                email: formData.get('email'),
                password: formData.get('password'),
                redirect: false
            });

            return login;
        } else {
            return {
                error: 'Registrasi berhasil tetapi terjadi kesalahan saat masuk. Silakan coba login secara manual.'
            };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return {
            error: error instanceof Error ? error.message : 'An unknown error occurred during registration'
        };
    }
}