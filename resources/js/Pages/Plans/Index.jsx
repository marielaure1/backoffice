import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { Icon } from '@iconify/react';

// partial reloads
export default function Plans({ auth, plans }) {
    const [allPlans, setAllPlans] = useState([]);
    const [getData, setData] = useState({});
    const [createForm, setCreateForm] = useState(false);
    console.log(plans);

    const createConfirm = () => {
        createForm ? setCreateForm(false) : setCreateForm(true)
    }


    useEffect(() => {
        setAllPlans(plans.allPlans);
    }, [plans]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-black leading-tight">Plans</h2>}
        >
            <Head title="Plans" />
            <div className="sm:px-6 lg:px-8">
                <div className='flex items-center justify-between page-title'>
                    <h1 className='title'>Plans</h1> 
                    <button className='btn-round btn-white' onClick={createConfirm}>+</button>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <table className='w-full'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Titre</th>
                                    <th>Image</th>
                                    <th>Prix</th>
                                    <th>Publier</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {allPlans?.map((plan) => (
                                <tr key={plan.id}>
                                    <td>{plan.id}</td>
                                    <td>{plan.title}</td>
                                    <td>{plan.image}</td>
                                    <td>{plan.amount}</td>
                                    <td>
                                        <span className={`badge ${plan.published == false ? "badge-purple" : "badge-blue"}`}>{plan.published ? "OUI" : "NON"}</span>
                                    </td>
                                    <td className='actions flex'>
                                        <Link href={"/plans/" + plan.id} className="btn"><Icon icon="ph:eye" /></Link>
                                        <Link href="/plans/create" className="btn"><Icon icon="ph:pencil-light" /></Link>
                                        <Link href="/" className="btn"><Icon icon="solar:trash-bin-2-outline" /></Link>
                                    </td>
                                </tr>
                            ))}

                            
                            </tbody>
                        </table>

                        { allPlans.length <= 0 && <div className='text-center p-2 text-gray-500'>Il n'y a aucun produit</div>}
                        
                    </div>
                </div>
            </div>

            <Modal show={createForm} maxWidth="lg" onClose={() => { setCreateForm(false) }}>
                <h3 className='text-xl font-bold mb-5'>Création d'un nouveau plan</h3>
                <form className={`text-gray-900 w-full`}>
                       
                       <div className='lg:grid grid-cols-2 gap-4 w-full'>
                        
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="title" className='mb-2'>Title</label>
                                <input type="text" defaultValue={getData.title} name="title" id="title" />
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="image" className='mb-2'>Image</label>
                                <input type="text" defaultValue={getData.image} name="image" id="image" />
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="amount" className='mb-2'>Email</label>
                                <input type="text" defaultValue={getData.amount} name="amount" id="amount" />
                                <p className='error'></p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="slug" className='mb-2'>Slug</label>
                                <input type="text" defaultValue={getData?.slug} name="slug" id="slug"/>
                                <p className='error'></p>
                            </div>
                            
                            <div className='col-span-2 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="description" className='mb-2'>Description</label>
                                <textarea name="description" id="description" defaultValue={getData.description}></textarea>
                                <p className='error'></p>
                            </div>
                            <div className='col-span-2 flex justify-end pt-2'>
                                <button type="submit" className='btn btn-purple mb-2'>Valider</button>
                            </div>
                       </div>
                   </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
