import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import api from '@/Services/Api.js';
import { useState, useEffect } from "react"
import { Link } from '@inertiajs/react';

export default function ResetPassword({ token }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        password: '',
        password_confirmation: '',
    });

    const [formView, setFormView] = useState(true)
    const [getMessage, setMessage] = useState("")

    const handleToken = async() => {
        const response = await api.resetPasswordToken(token)

        console.log(response);

        if(response?.date?.user){
            setFormView(true)
        }
    }
    useEffect(() => {
        handleToken()
    }, []);

    const submit = async (e) => {
        e.preventDefault();

        const response = await api.resetPasswordTokenPost(data, token)

        console.log(response);

        if(response?.data?.error){
            setMessage(response?.data?.error)
        }
        
        if(response?.data?.message){
            setMessage(response?.data?.message)
            setFormView(false)
        }
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <form onSubmit={submit} className={`form-password ${formView == true ? "show" : ""}`}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Mot de passe" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirmation du mot de passe" />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>
                {getMessage && <p>{getMessage}</p>}

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={processing}>
                        Modifier le mot de passe
                    </PrimaryButton>
                </div>
            </form>


            <div className={`message-password ${formView == false ? "show" : ""}`}>
                <p>Ce lien à expiré</p>

                    <Link href="/login" className="ml-4" >
                       Se connecter
                    </Link>
            </div>
        </GuestLayout>
    );
}
