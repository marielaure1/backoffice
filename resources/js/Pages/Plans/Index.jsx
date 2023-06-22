import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { Icon } from '@iconify/react';
import api from '@/Services/Api.js';
import Modal from '@/Components/Modal';

// partial reloads
export default function Plans({ auth }) {
    const [allPlans, setAllPlans] = useState(null);
     const [deleteForm, setDeleteForm] = useState(false);
     const [deleteId, setDeleteId] = useState(false);

    const getAllPlansFetch = async () => {
            
        try{
            const response = await api.getPlansPlans();

            // setAllPlans(response);
            console.log(response);

            if(response?.data?.allPlan){
                setAllPlans(response?.data?.allPlan)
            }
        } catch(error){
            console.log(error);
        }
    } 

    useEffect( () => {
        
        getAllPlansFetch()
        
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
            const response = await api.deleteOnePlan(id);

            console.log(response);
            setDeleteForm(false)

            if(response?.data?.deletePlan){
                getAllPlansFetch()
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
            header={<h2 className="font-semibold text-xl text-black leading-tight">Plans</h2>}
        >
            <Head title="Plans" />
            <div className="sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <table className='w-full'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Titre</th>
                                    <th>Prix</th>
                                    <th>Publier</th>
                                    <th>Interval</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {allPlans?.map((plan) => (
                                <tr key={plan.id}>
                                    <td>{plan.id}</td>
                                    <td>{plan.title}</td>
                                    <td>{plan.amount * 0.01}</td>
                                    <td>
                                        <span className={`badge ${plan.published == "true" ? "badge-purple" : "badge-blue"}`}>{plan.published}</span>
                                    </td>
                                    <td>{plan.interval}</td>
                                    <td className='actions flex'>
                                        <Link href={"/plans/" + plan.id} className="btn"><Icon icon="ph:eye" /></Link>
                                        {/* <Link href="/plans/create" className="btn"><Icon icon="ph:pencil-light" /></Link> */}
                                        <button type="button"  onClick={() => { deleteConfirm(plan.id) }} ><Icon icon="solar:trash-bin-2-outline" /></button>
                                    </td>
                                </tr>
                            ))}
                            
                            </tbody>
                        </table>
                        {!allPlans &&  <p className='text-center p-3 text-gray-400'>Vous n'avez pas encore de plans.</p> }
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
