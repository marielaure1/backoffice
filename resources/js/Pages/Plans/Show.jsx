import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { Icon } from '@iconify/react';
import { DateTime } from "luxon";
import { usePage } from '@inertiajs/react';
// import { useHistory } from "react-router-dom";
import { Inertia } from '@inertiajs/inertia';

export default function Show({ auth, data, id }) {
    const [getData, setData] = useState(null);
    const [formActive, setFormActive] = useState("");
    const [deleteForm, setDeleteForm] = useState(false);
    // const history = useHistory();

    const { url } = usePage();

    const goBack = () => {
        window.history.back();
    };

    useEffect(() => {
        setData({
            id: data.showUser.id,
            first_name: data.showUser.first_name,
            last_name: data.showUser.last_name,
            email: data.showUser.email,
            phone: data.showUser.phone,
            role: data.showUser.role,
            address: data.showUser.address,
            created_at: data.showUser.created_at
        });
    }, [data]);

    const openForm = (el) => {
        setFormActive(el)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(e);

        const { id, value } = e.target;

        setData((prev) => ({
            ...prev,
            first_name: id === 'first_name' ? value : prev.first_name,
            last_name: id === 'last_name' ? value : prev.last_name,
            email: id === 'email' ? value : prev.email,
            phone: id === 'phone' ? value : prev.phone,
            role: id === 'role' ? value : prev.role,
            address: {
                ...prev.address,
                line1: id === 'seo.line1' ? value : prev.seo.line1,
                postal_code: id === 'seo.postal_code' ? value : prev.seo.postal_code,
                city: id === 'seo.city' ? value : prev.seo.city,
                country: id === 'seo.country' ? value : prev.seo.country,
            },
        }));

        console.log(getData);

        fetch(`http://localhost:8000/users/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(getData),
        })
        .then((response) => {
            if (response.ok) {
            // Rediriger vers la page des utilisateurs ou une autre page appropriée
            history.push('/users');
            } else {
            // Gérer les erreurs en fonction de la réponse du serveur
            }
        })
        .catch((error) => {
            // Gérer les erreurs de connexion ou autres erreurs
        });

    };

    const deleteConfirm = () => {
        deleteForm ? setDeleteForm(false) : setDeleteForm(true)
    }

    const handleDelete = (id) => {
        console.log(id);
        Inertia.visit(`/users/${id}`, { method: 'delete' });
      };

    if (!getData) {
        return <div>Loading...</div>;
    }

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
                <div className={`bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4 block-data`}>
                    <div className={`p-6 text-gray-900 block-content ${formActive == "infos-form" ? "" : "active"}`}>
                       
                        <h2 className="flex items-center justify-between mb-3">
                            <div className="flex items-center font-semibold">
                                Informations personnelles 
                                <button type="button" className='ml-4' onClick={() => openForm("infos-form")}><Icon icon="ph:pencil-light" /></button>
                            </div>
                            <span className={`badge ${getData.role == "ADMIN" ? "badge-purple" : "badge-blue"}`}>{getData.role}</span>
                        </h2>
                        <p>{getData?.first_name} <strong>{getData.last_name}</strong></p>
                        <p>Email : <span>{getData.email}</span></p>
                        <p>Téléphone : {getData?.phone ? getData?.phone : <span className="text-red-600">N/C</span> }</p>
                        <p>Adresse : {getData?.address ? getData?.address?.line1 + ", " + getData?.address.postal_code + " " + getData?.address.city + ", " + getData?.address.country : <span className="text-red-600">N/C</span>}</p>
                        <p>C'est inscrit <span>{DateTime.fromISO(data?.created_at).toRelative()}  ({ DateTime.fromISO(data?.created_at).toFormat('f')})</span></p>
                    </div>

                    <form  onSubmit={handleSubmit}  className={`p-6 text-gray-900 w-full block-content ${formActive == "infos-form" ? "active" : ""}`}>
                       
                       <div className='lg:grid grid-cols-2 gap-4 w-full'>
                            <h2 className="flex items-center font-semibold col-span-2 lg:mb-0 mb-2">Informations personnelles <button type="button" className='ml-4' onClick={() => openForm("infos")}><Icon icon="system-uicons:cross" /></button></h2>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="last_name" className='mb-2'>Nom</label>
                                <input type="text" defaultValue={getData.last_name} name="last_name" id="last_name" />
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="first_name" className='mb-2'>Prénom</label>
                                <input type="text" defaultValue={getData.first_name} name="first_name" id="first_name" />
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="email" className='mb-2'>Email</label>
                                <input type="email" defaultValue={getData.email} name="email" id="email" />
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="phone" className='mb-2'>Téléphone</label>
                                <input type="tel" defaultValue={getData?.phone} name="phone" id="phone"/>
                                <p className='error'></p>
                            </div>
                            
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="role" className='mb-2'>Rôle</label>
                                <select name="role" id="role" defaultValue={getData.role}>
                                    <option value="USER">Utilisateur</option>
                                    <option value="ADMIN">Administrateur</option>
                                </select>
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="line1" className='mb-2'>Libellé</label>
                                <input type="text" defaultValue={getData?.address.line1}  name="line1" id="line1"/>
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="postal_code" className='mb-2'>Code postal</label>
                                <input type="text" defaultValue={getData?.address.postal_code}  name="postal_code" id="postal_code"/>
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="city" className='mb-2'>Ville</label>
                                <input type="text" defaultValue={getData?.address.city}  name="city" id="city"/>
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="country" className='mb-2'>Pays</label>
                                <input type="text" defaultValue={getData?.address.country}  name="country" id="country"/>
                                <p className='error'></p>
                            </div>

                            <input type="hidden" defaultValue={getData.address} />
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

                    <form className={`p-6 text-gray-900 block-content ${formActive == "mdp-form" ? "active" : ""}`}>
                        <div className='lg:grid grid-cols-2 gap-4 w-full'>
                            <h2 className="flex items-center font-semibold col-span-2 lg:mb-0 mb-2">Mot de passe <button type="button" className='ml-4' onClick={() => openForm("mdp")}><Icon icon="system-uicons:cross" /></button></h2>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="password" className='mb-2'>Nouveau mot de passe</label>
                                <input type="password" name="password" id="password" placeholder='******'/>
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="verifPassowrd" className='mb-2'>Confirmation mot de passe</label>
                                <input type="password" name="verifPassword" id="verifPassword" placeholder='******'/>
                                <p className='error'></p>
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
                        <button type="button" className='btn btn-red mr-4' onClick={() => { handleDelete(getData.id) }} >Supprimer</button>
                        <button type="button" className='btn btn-light' onClick={() => { setDeleteForm(false) }}>Annuler</button>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
