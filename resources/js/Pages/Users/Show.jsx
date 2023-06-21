import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { Icon } from '@iconify/react';
import { DateTime } from "luxon";
import { usePage } from '@inertiajs/react';
// import { useHistory } from "react-router-dom";
import { Inertia } from '@inertiajs/inertia';
import api from '@/Services/Api.js';

export default function Show({ auth, id }) {
    const [getData, setData] = useState(null);
    const [getUpdateData, setUpdateData] = useState(null);
    const [getUpdatePassword, setUpdatePassword] = useState(null);
    const [getUpdateDataError, setUpdateDataError] = useState(null);
    const [getUpdatePasswordError, setUpdatePasswordError] = useState(null);
    const [formActive, setFormActive] = useState("");
    const [deleteForm, setDeleteForm] = useState(false);
    const [getMessage, setMessage] = useState(false);
    // const history = useHistory();

    const { url } = usePage();

    const goBack = () => {
        window.history.back();
    };

    const getOneUserFetch = async () => {
            
        try{
            const response = await api.getOneUser(id);

            console.log(response);

            if(response?.data?.showUser){
                setData(response?.data?.showUser)
                setUpdateData(response?.data?.showUser)
            }

            setMessage("")
        } catch(error){
            console.log(error);
            setMessage(error)
        }
    } 

    useEffect( () => {
        console.log(url);
        getOneUserFetch()
        
    }, []); 

    const openForm = (el) => {
        setFormActive(el)
    }

    const handleChangeData = (e) => {
        let { id, value } = e.target

        setUpdateData((prev) => ({
            ...prev,
            first_name: id === 'first_name' ? value : prev?.first_name,
            last_name: id === 'last_name' ? value : prev?.last_name,
            email: id === 'email' ? value : prev?.email,
            phone: id === 'phone' ? value : prev?.phone,
            role: id === 'role' ? value : prev?.role,
            address: {
                ...prev?.address,
                line1: id === 'line1' ? value : prev?.address?.line1,
                postal_code: id === 'postal_code' ? value : prev?.address?.postal_code,
                city: id === 'city' ? value : prev?.address?.city,
                country: id === 'country' ? value : prev?.address?.country,
            },
        }));
    }

    const handleChangePassword = (e) => {
        let { id, value } = e.target

        setUpdatePassword((prev) => ({
            ...prev,
            currentPassword: id === 'currentPassword' ? value : prev?.currentPassword,
            newPassword: id === 'newPassword' ? value : prev?.newPassword,
            verifPassword: id === 'verifPassword' ? value : prev?.verifPassword,
        }));
    }

    const handleSubmitData = async (e) => {
        e.preventDefault()
        
        try{
            const response = await api.updateOneUser(getUpdateData, id);

            console.log(response);

            if(response?.data?.updateUser){
                setData(response?.data?.updateUser)
                setUpdateData(response?.data?.updateUser)
            }

            if(response?.data?.error){
                setUpdateDataError(response?.data?.error)
            }

            if(response?.data?.message){
                setMessage(response?.data?.message)
            }
        } catch(error){
            console.log(error);
            setMessage(error)
        }

    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault()
        
        try{
            const response = await api.updateOneUserPassword(getUpdatePassword, id);

            console.log(response);

            if(response?.data?.updateUser){
                setUpdatePassword(null)
            }

            if(response?.data?.error){
                setUpdateDataError(response?.data?.error)
            }

            if(response?.data?.message){
                setMessage(response?.data?.message)
            }
        } catch(error){
            console.log(error);
            setMessage(error)
        }

    };

    useEffect(() => {
        console.log(getData);
    }, [getData]);

    const deleteConfirm = () => {
        deleteForm ? setDeleteForm(false) : setDeleteForm(true)
    }

    const handleDelete = (id) => {
        console.log(id);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-black leading-tight">Users</h2>}
        >
            <Head title="Users" />
            <div className="sm:px-6 lg:px-8">
                <div className='flex items-center page-title'>
                    <Link href="#" onClick={goBack} className='go-back'>
                        <Icon icon="ph:arrow-circle-left-light" />
                    </Link>

                    <h1 className='title'>Profile utilisateur</h1>
                    
                </div>
                {getMessage?.success && (
                    <div className="success-message ">{getMessage.success}</div>
                )}
                {getMessage?.error && (
                    <div className="error-message">{getMessage.error}</div>
                )}
                <div className={`bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4 block-data`}>
                    <div className={`p-6 text-gray-900 block-content ${formActive == "infos-form" ? "" : "active"}`}>
                       
                        <h2 className="flex items-center justify-between mb-3">
                            <div className="flex items-center font-semibold">
                                Informations personnelles 
                                <button type="button" className='ml-4' onClick={() => openForm("infos-form")}><Icon icon="ph:pencil-light" /></button>
                            </div>
                            <span className={`badge ${getData?.role == "ADMIN" ? "badge-purple" : "badge-blue"}`}>{getData?.role}</span>
                        </h2>
                        <p>{getData?.first_name} <strong>{getData?.last_name}</strong></p>
                        <p>Email : <span>{getData?.email}</span></p>
                        <p>Téléphone : {getData?.phone ? getData?.phone : <span className="text-red-600">N/C</span> }</p>
                        <p>Adresse : {getData?.address ? getData?.address?.line1 + ", " + getData?.address.postal_code + " " + getData?.address.city + ", " + getData?.address.country : <span className="text-red-600">N/C</span>}</p>
                        <p>C'est inscrit <span>{DateTime.fromISO(getData?.created_at).toRelative()}  ({ DateTime.fromISO(getData?.created_at).toFormat('f')})</span></p>
                    </div>

                    <form  onSubmit={handleSubmitData}  className={`p-6 text-gray-900 w-full block-content ${formActive == "infos-form" ? "active" : ""}`}>
                       
                       <div className='lg:grid grid-cols-2 gap-4 w-full'>
                            <h2 className="flex items-center font-semibold col-span-2 lg:mb-0 mb-2">Informations personnelles <button type="button" className='ml-4' onClick={() => openForm("infos")}><Icon icon="system-uicons:cross" /></button></h2>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="last_name" className='mb-2'>Nom</label>
                                <input type="text" defaultValue={getUpdateData?.last_name} name="last_name" id="last_name" onChange={handleChangeData}/>
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="first_name" className='mb-2'>Prénom</label>
                                <input type="text" defaultValue={getUpdateData?.first_name} name="first_name" id="first_name" onChange={handleChangeData} />
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="email" className='mb-2'>Email</label>
                                <input type="email" defaultValue={getUpdateData?.email} name="email" id="email" onChange={handleChangeData} />
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="phone" className='mb-2'>Téléphone</label>
                                <input type="tel" defaultValue={getUpdateData?.phone} name="phone" id="phone" onChange={handleChangeData}/>
                                <p className='error'></p>
                            </div>
                            
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="role" className='mb-2'>Rôle</label>
                                <select name="role" id="role" defaultValue={getUpdateData?.role} onChange={handleChangeData}>
                                    <option value="USER">Utilisateur</option>
                                    <option value="ADMIN">Administrateur</option>
                                </select>
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="line1" className='mb-2'>Libellé</label>
                                <input type="text" defaultValue={getUpdateData?.address?.line1}  name="line1" id="line1" onChange={handleChangeData}/>
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="postal_code" className='mb-2'>Code postal</label>
                                <input type="text" defaultValue={getUpdateData?.address?.postal_code}  name="postal_code" id="postal_code" onChange={handleChangeData}/>
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="city" className='mb-2'>Ville</label>
                                <input type="text" defaultValue={getUpdateData?.address?.city}  name="city" id="city" onChange={handleChangeData}/>
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="country" className='mb-2'>Pays</label>
                                <input type="text" defaultValue={getUpdateData?.address?.country}  name="country" id="country" onChange={handleChangeData}/>
                                <p className='error'></p>
                            </div>

                            <input type="hidden" defaultValue={getUpdateData?.address}  onChange={handleChangeData}/>
                            <div className='col-span-2 flex justify-end pt-2'>
                                <button type="submit" className='btn btn-purple mb-2'>Valider</button>
                            </div>
                       </div>
                   </form>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4 block-data">
                    <div className={`p-6 text-gray-900 w-full block-content  ${formActive == "mdp-form" ? "" : "active"}`}>
                       
                        <h2 className="flex items-center font-semibold mb-3">Mot de passe <button type="button" className='ml-4' onClick={() => openForm("mdp-form")}><Icon icon="ph:pencil-light" /></button></h2>
                        <p><strong>*********</strong></p>
                    </div>

                    <form onSubmit={handleSubmitPassword}  className={`p-6 text-gray-900 block-content ${formActive == "mdp-form" ? "active" : ""}`}>
                        <div className='lg:grid grid-cols-2 gap-4 w-full'>
                            <h2 className="flex items-center font-semibold col-span-2 lg:mb-0 mb-2">Mot de passe <button type="button" className='ml-4' onClick={() => openForm("mdp")}><Icon icon="system-uicons:cross" /></button></h2>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="currentPassword" className='mb-2'>Mot de passe actuel</label>
                                <input type="password" name="currentPassword" id="currentPassword" placeholder='******' defaultValue={getUpdatePassword?.currentPassword} onChange={handleChangePassword}/>
                                <p className='error'>{ getUpdateDataError?.currentPasswordError }</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="newPassword" className='mb-2'>Nouveau mot de passe</label>
                                <input type="password" name="newPassword" id="newPassword" placeholder='******' defaultValue={getUpdatePassword?.newPassword} onChange={handleChangePassword}/>
                                <p className='error'>{ getUpdateDataError?.newPasswordError }</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="verifPassowrd" className='mb-2'>Confirmation du nouveau mot de passe</label>
                                <input type="password" name="verifPassword" id="verifPassword" placeholder='******' defaultValue={getUpdatePassword?.verifPassword} onChange={handleChangePassword}/>
                                <p className='error'>{ getUpdateDataError?.verifPasswordError }</p>
                            </div>
                          
                            <div className='col-span-2 flex justify-end pt-2'>
                                <button type="submit" className='btn btn-purple mb-2'>Valider</button>
                            </div>
                        </div>
                   </form>
                </div>

                <button className='btn btn-red-line' onClick={deleteConfirm}>Supprimer l'utilisateur</button>

                <Modal show={deleteForm} maxWidth="lg" onClose={() => { setDeleteForm(false) }}>
                    <h3 className='text-center font-bold mb-5'>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</h3>

                    <div className='flex justify-center'>
                        <button type="button" className='btn btn-red mr-4' onClick={() => { handleDelete(getData?.id) }} >Supprimer</button>
                        <button type="button" className='btn btn-light' onClick={() => { setDeleteForm(false) }}>Annuler</button>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
