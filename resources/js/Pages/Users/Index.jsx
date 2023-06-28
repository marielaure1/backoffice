import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { Icon } from '@iconify/react';
import api from '@/Services/Api.js';
import Modal from '@/Components/Modal';

// partial reloads
export default function Users({ auth }) {
    const [allUsers, setAllUsers] = useState(null);
     const [createForm, setCreateForm] = useState(false);
     const [deleteForm, setDeleteForm] = useState(false);
     const [deleteId, setDeleteId] = useState(false);
     const [getData, setData] = useState(null);
     const [getCreateData, setCreateData] = useState(null);
     const [getCreateDataError, setCreateDataError] = useState(null);
     const [getMessage, setMessage] = useState(false);

    const getAllUsersFetch = async () => {
            
        try{
            const response = await api.getAllUsers();

            // setAllUsers(response);
            console.log(response);

            if(response?.data?.allUser){
                setAllUsers(response?.data?.allUser)
            }
        } catch(error){
            console.log(error);
        }
    } 

    useEffect( () => {
        
        getAllUsersFetch()

        setCreateData((prev) => ({
            ...prev,
            role: "ADMIN"
            
        }));
        
    }, []);
    
    // useEffect( () => {
        
    //     console.log(getCreateData);
        
    // }, [getCreateData]);

    const createModal = (id) => {

        if(createForm){
            setCreateForm(false)
        } else{
            setCreateForm(true)
        }
    }

    const handleChangeData = async (e) => {
        e.preventDefault()

        let { id, value } = e.target

        setCreateData((prev) => ({
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

    const handleCreate = async () => {
        try{
            const response = await api.createOneUser(getCreateData);

            console.log(response);
            

            if(response?.data?.token){
                getAllUsersFetch()
                setCreateForm(false)

                if(response?.data?.message){
                    setMessage(response?.data?.message)

                    setTimeout(() => {
                        setMessage(false)
                    }, 5000);
                }
            }

            if(response?.data?.errors){
                setCreateDataError(response?.data?.errors)
            }

           

        } catch(error){
            console.log(error);
            setMessage(error)
        }
    };
    
    const deleteConfirm = (id) => {

        if(deleteForm){
            setDeleteForm(false)
            setDeleteId(false)
        } else{
            setDeleteForm(true)
            setDeleteId(id)
        }
    }

    const handleDelete = async (id) => {
        try{
            const response = await api.deleteOneUser(id);

            console.log(response);
            setDeleteForm(false)

            if(response?.data?.deleteUser){
                getAllUsersFetch()
            }

            if(response?.data?.message){
                setMessage(response?.data?.message)
            }

        } catch(error){
            console.log(error);
            setMessage(error)
        }
    };


    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-black leading-tight">Users</h2>}
        >
            <Head title="Users" />
            <div className="sm:px-6 lg:px-8">

                <div className='flex justify-between page-title'>

                    <h1 className='title'>Utilisateurs</h1>
                    
                    <button type="button"  onClick={createModal} className='btn btn-white' >Ajouter +</button>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 overflow-x-auto">
                        <table className='w-full'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nom complet</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {allUsers?.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.first_name} <strong>{user.last_name}</strong></td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.role == "ADMIN" ? "badge-purple" : "badge-blue"}`}>{user.role}</span>
                                    </td>
                                    <td className='actions flex'>
                                        <Link href={"/users/" + user.id} className="btn"><Icon icon="ph:eye" /></Link>
                                        {/* <Link href="/users/create" className="btn"><Icon icon="ph:pencil-light" /></Link> */}
                                        <button type="button"  onClick={() => { deleteConfirm(user.id) }} ><Icon icon="solar:trash-bin-2-outline" /></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        
                        {!allUsers &&  <p className='text-center p-3 text-gray-400'>Vous n'avez pas encore de plans.</p> }
                    </div>
                </div>

                <Modal show={createForm} maxWidth="xl" onClose={() => { setCreateForm(false) }}>
                    <h3 className='text-center font-bold mb-5'>Créer un nouvel utilisateur</h3>

                    <form className={`p-6 text-gray-900 w-full`}>
                       
                       <div className='block gap-4 w-full'>
                          
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="last_name" className='mb-2'>Nom</label>
                                <input type="text" defaultValue={getCreateData?.last_name} name="last_name" id="last_name" onChange={handleChangeData}/>
                                <p className='error'>{getCreateDataError?.last_name}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="first_name" className='mb-2'>Prénom</label>
                                <input type="text" defaultValue={getCreateData?.first_name} name="first_name" id="first_name" onChange={handleChangeData} />
                                <p className='error'>{getCreateDataError?.first_name}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="email" className='mb-2'>Email</label>
                                <input type="email" defaultValue={getCreateData?.email} name="email" id="email" onChange={handleChangeData} />
                                <p className='error'>{getCreateDataError?.email}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="phone" className='mb-2'>Téléphone</label>
                                <input type="tel" defaultValue={getCreateData?.phone} name="phone" id="phone" onChange={handleChangeData}/>
                                <p className='error'>{getCreateDataError?.phone}</p>
                            </div>
                            
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="role" className='mb-2'>Rôle</label>
                                <select name="role" id="role" defaultValue={getCreateData?.role} onChange={handleChangeData}>
                                    <option value="USER">Utilisateur</option>
                                    <option value="ADMIN" selected>Administrateur</option>
                                </select>
                                <p className='error'>{getCreateDataError?.role}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="line1" className='mb-2'>Libellé</label>
                                <input type="text" defaultValue={getCreateData?.address?.line1}  name="line1" id="line1" onChange={handleChangeData}/>
                                
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="postal_code" className='mb-2'>Code postal</label>
                                <input type="text" defaultValue={getCreateData?.address?.postal_code}  name="postal_code" id="postal_code" onChange={handleChangeData}/>
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="city" className='mb-2'>Ville</label>
                                <input type="text" defaultValue={getCreateData?.address?.city}  name="city" id="city" onChange={handleChangeData}/>
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="country" className='mb-2'>Pays</label>
                                <input type="text" defaultValue={getCreateData?.address?.country}  name="country" id="country" onChange={handleChangeData}/>
                                <p className='error'></p>
                            </div>

                            <input type="hidden" defaultValue={getCreateData?.address}  onChange={handleChangeData}/>
                       </div>
                   </form>

                    <div className='flex justify-center'>
                        <button type="button" className='btn btn-red mr-4' onClick={() => { handleCreate() }} >Ajouter</button>
                        <button type="button" className='btn btn-light' onClick={() => { setCreateForm(false) }}>Annuler</button>
                    </div>
                </Modal>

                <Modal show={deleteForm} maxWidth="lg" onClose={() => { setDeleteForm(false) }}>
                    <h3 className='text-center font-bold mb-5'>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</h3>

                    <div className='flex justify-center'>
                        <button type="button" className='btn btn-red mr-4' onClick={() => { handleDelete(deleteId) }} >Supprimer</button>
                        <button type="button" className='btn btn-light' onClick={() => { setDeleteForm(false) }}>Annuler</button>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
