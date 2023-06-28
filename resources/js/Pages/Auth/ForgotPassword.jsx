import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import ResetPassword from './ResetPassword';
import api from '@/Services/Api.js';
import { useState, useEffect } from "react"

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const [getForm, setForm] = useState(true)

    const submit = async (e) => {
        e.preventDefault();

        const response = await api.resetPassword(data)

        console.log(response);

        if(response?.data?.user){
            setForm(false)
        }
    };


    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-gray-600">
            Mot de passe oublié? Aucun problème. Indiquez-nous simplement votre adresse e-mail et nous vous enverrons par e-mail un lien de réinitialisation de mot de passe qui vous permettra d'en choisir un nouveau.
            </div>

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit} className={`form-password ${getForm == true ? "show" : ""}`}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={processing}>
                        Réinitaliser mon mot de passe
                    </PrimaryButton>
                </div>
            </form>

            <div className={`message-password ${getForm == false ? "show" : ""}`}>
                <p>Un email de rénitialisation à été envoyé</p>
            </div>
        </GuestLayout>
    );
}
