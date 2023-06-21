import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { Icon } from '@iconify/react';
import api from '@/Services/Api.js';

// partial reloads
export default function Users({ auth }) {
    const [allUsers, setAllUsers] = useState(null);

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
                                        <Link href="/users/create" className="btn"><Icon icon="ph:pencil-light" /></Link>
                                        <Link href="/" className="btn"><Icon icon="solar:trash-bin-2-outline" /></Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
