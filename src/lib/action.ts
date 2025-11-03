import { signIn } from "next-auth/react"

export async function credetialLogin(formData: FormData) {
    try {
        const login = await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false
        })
        return login
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred')
    }
}

export async function credentialRegister(formData: FormData) {
    try {
        console.log('[Register] Form Data:', formData)
        const registerRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.get('email'),
              username: formData.get('username'),
              password: formData.get('password')
            }),
          })
          const check = await registerRes.json()
          console.log('[Register] Response:', check)
          if (registerRes.status === 201) { 
            const login = await signIn('credentials', {
                email: formData.get('email'),
                password: formData.get('password'),
                redirect: false
            })
            return login
          }
    } catch (error) {
        console.log(error)
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred')
    }
}