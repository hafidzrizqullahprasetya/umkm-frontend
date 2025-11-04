import LoginPage from "@/modules/auth/login";

export default function Register(){
    return(
        <>
            <LoginPage isRegister={true} />
        </>
    )
}