import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { Icon } from '@iconify/react';
import api from '@/Services/Api.js';
import Modal from '@/Components/Modal';

// partial reloads
export default function Users({ auth }) {
    const [allUsers, setAllUsers] = useState(null);
     const [deleteForm, setDeleteForm] = useState(false);
     const [deleteId, setDeleteId] = useState(false);

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
        
    }, []);

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
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
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
                        
                    </div>
                </div>

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
