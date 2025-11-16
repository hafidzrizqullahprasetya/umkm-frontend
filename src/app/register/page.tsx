import { redirect } from 'next/navigation';

export default function Register(){
    // Redirect to home page since register is now a popup
    redirect('/');
}