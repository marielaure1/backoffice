import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { Icon } from '@iconify/react';
import { DateTime } from "luxon";
import { usePage, router } from '@inertiajs/react';
// import { useHistory } from "react-router-dom";
import { Inertia } from '@inertiajs/inertia';
import api from '@/Services/Api.js';
import { Blank } from "../../../medias"
import Switch from '@mui/material/Switch';
import Loading from '@/Components/Loading';
import Medias from '@/Components/Medias';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Show({ auth, id }) {
    const [getData, setData] = useState(null);
    const [getUpdateData, setUpdateData] = useState(null);
    const [getUpdateDataError, setUpdateDataError] = useState(null);
    const [formActive, setFormActive] = useState("");
    const [deleteForm, setDeleteForm] = useState(false);
    const [createForm, setCreateForm] = useState(false);
    const [getMessage, setMessage] = useState(false);
    const [getSuccess, setSuccess] = useState(false);

    const [openModal, setOpenModal] = useState(false)
    // const history = useHistory();

    const { url } = usePage();

    const handleOpenModal = () => {
        setCreateForm(true);
      };

    const goBack = () => {
        window.history.back();
    };

    const getOneCategorieFetch = async () => {
            
        try{

            
            const response = await api.getOneCategorie(id);

            if(response?.data?.showCategorie){
                setData(response?.data?.showCategorie)
                setUpdateData(response?.data?.showCategorie)
            }

            setMessage("")
        } catch(error){
            setMessage(error)
        }
    } 

    useEffect( () => {
        getOneCategorieFetch()
        
    }, []); 

    const openForm = (el) => {
        setFormActive(el)
    }

    const handleChangeData = (e) => {
        let { id, value } = e.target

            setUpdateData((prev) => ({
                ...prev,
                name: id === 'name' ? value : prev?.name,
              
            }));

       
    }

    const handleSubmitData = async (e) => {
        e.preventDefault()
        
        try{
            const response = await api.updateOneCategorie(getUpdateData, id);

            if(response?.data?.errors){
                setUpdateDataError(response?.data?.errors)
            }

            if(response?.data?.error){
                setMessage(response?.data?.error)

                setTimeout(() => {
                    setMessage(false)
                }, 5000);
            }

            if(response?.data?.message){
                setMessage(response?.data?.message)

                setTimeout(() => {
                    setMessage(false)
                }, 5000);

                if(response?.data?.updateCategorie){
                    setData(response?.data?.updateCategorie)
                    setUpdateData(response?.data?.updateCategorie)
                    setSuccess(false);
                }
            }
        } catch(error){
            setMessage(error)
        }

    };

    const deleteConfirm = () => {
        deleteForm ? setDeleteForm(false) : setDeleteForm(true)
    }

    const handleDelete = async (id) => {
        try{
            const response = await api.deleteOneCategorie(id);

            console.log(response);
        

            if(response?.data?.message){
                setMessage(response?.data?.message)

                if(response?.data?.deleteCategorie){
                    router.get('/categories')
                }
            }

        } catch(error){
            console.log(error);
            setMessage(error)
        }
    };

    return (
        <AuthenticatedLayout
            categorie={auth.categorie}
            header={<h2 className="font-semibold text-xl text-black leading-tight">Categories</h2>}
        >
            <Head title="Categories" />
            <div className="sm:px-6 lg:px-8">
                <div className='flex items-center page-title'>
                    <Link href="/categories" className='go-back'>
                        <Icon icon="ph:arrow-circle-left-light" />
                    </Link>

                    <h1 className='title'>{getData?.name}</h1>
                    
                </div>
                {getMessage && (
                    <div className="success-message ">{getMessage}</div>
                )}

                <div className={`bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4 block-data`}>
                    <div className={`p-6 text-gray-900 block-content ${formActive == "infos-form" ? "" : "active"}`}>
                       
                        <h2 className="flex items-center justify-between mb-3">
                            <div className="flex items-center font-semibold">
                                Détails
                                <button type="button" className='ml-4' onClick={() => openForm("infos-form")}><Icon icon="ph:pencil-light" /></button>
                            </div>
                        </h2>
                       
                        <p>Nom de la catégorie : {getData?.name}</p>
                        <p>Créée <span>{DateTime.fromISO(getData?.created_at).toRelative()}  ({ DateTime.fromISO(getData?.created_at).toFormat('f')})</span></p>
                    </div>
                    

                    <form className={`p-6 text-gray-900 w-full block-content ${formActive == "infos-form" ? "active" : ""}`}>
                       
                       <div className='gap-4 w-full'>
                            <h2 className="flex items-center font-semibold col-span-2 lg:mb-0 mb-2">Détails <button type="button" className='ml-4' onClick={() => openForm("infos")}><Icon icon="system-uicons:cross" /></button></h2>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="name" className='mb-2'>Nom de la catégorie</label>
                                <input type="text" defaultValue={getUpdateData?.name} name="name" id="name" onChange={handleChangeData}/>
                                <p className='error'>{getUpdateDataError?.name}</p>
                            </div>
                            
                            <div className='col-span-2 flex justify-end pt-2'>
                                <button type="submit" className='btn btn-purple mb-2' id="form-categories" onClick={handleSubmitData}>Valider</button>
                            </div>
                       </div>
                   </form>
                </div>

                <button className='btn btn-red-line' onClick={deleteConfirm}>Supprimer le categorie</button>



                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-10">
                    <div className="p-6 text-gray-900 overflow-x-auto">
                        <table className='w-full'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Titre</th>
                                    <th>Prix</th>
                                    <th>Publier</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {getData?.products?.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.title}</td>
                                    <td>{product.price} €</td>
                                    <td>
                                        <span className={`badge ${product.published == true ? "badge-green" : "badge-red"}`}>{product.published == true ? "OUI" : "NON"}</span>
                                    </td>
                                    <td>{product.stock}</td>
                                    <td className='actions flex'>
                                        <Link href={"/products/" + product.id} className="btn"><Icon icon="ph:eye" /></Link>
                                        
                                    </td>
                                </tr>
                            ))}
                            
                            </tbody>
                        </table>
                        {/* {!getData?.products || getData?.products?.length <= 0 &&  <p className='text-center p-3 text-gray-400'>Vous n'avez pas encore de produits.</p> } */}
                    </div>
                </div>


                <Modal show={deleteForm} maxWidth="lg" onClose={() => { setDeleteForm(false) }}>
                    <h3 className='text-center font-bold mb-5'>Êtes-vous sûr de vouloir supprimer cette categorie ?</h3>

                    <div className='flex justify-center'>
                        <button type="button" className='btn btn-red mr-4' onClick={() => { handleDelete(getData?.id) }} >Supprimer</button>
                        <button type="button" className='btn btn-light' onClick={() => { setDeleteForm(false) }}>Annuler</button>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
