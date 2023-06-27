import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from "react"
import { Icon } from '@iconify/react';
import api from '@/Services/Api.js';
import Modal from '@/Components/Modal';
import { usePage } from '@inertiajs/react'
import { CloudinaryContext, Image } from 'cloudinary-react';
import Loading from '@/Components/Loading';
import Medias from '@/Components/Medias';
import { Blank } from "../../../medias"
import Switch from '@mui/material/Switch';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DateTime } from 'luxon';

// partial reloads
export default function Categories({ auth }) {
    const [allCategories, setAllCategories] = useState(null);
     const [deleteForm, setDeleteForm] = useState(false);
     const [deleteId, setDeleteId] = useState(false);
     const [createForm, setCreateForm] = useState(false);
     const [getData, setData] = useState(null);
     const [getCreateData, setCreateData] = useState(null);
     const [getCreateDataError, setCreateDataError] = useState(null);
     const [getMessage, setMessage] = useState(false);
     const [openModal, setOpenModal] = useState(false)
     const [isLoading, setIsLoading] = useState(false)
      

     const handleOpenModal = () => {
        setOpenModal(true);
      };

    // Récupérer tous les categories
    const getAllCategoriesFetch = async () => {
            
        try{
            const response = await api.getCategories();

            // setAllCategories(response);
            console.log(response);

            if(response?.data?.allCategorie){
                setAllCategories(response?.data?.allCategorie)
            }
        } catch(error){
            console.log(error);
        }
    } 

    // Init
    useEffect( () => {
        
        getAllCategoriesFetch()
        
    }, []);

    // Create Modal
    const createModal = (id) => {

        if(createForm){
            setCreateForm(false)
            setOpenModal(false)
        } else{
            setCreateForm(true)
        }
    }

    // Create Change Data
    const handleChangeData = async (e) => {
        e.preventDefault()

        let { id, value } = e.target

        setCreateData((prev) => ({
            ...prev,
            name: id === 'name' ? value : prev?.name,
        }));
        
    }

    // Create submit
    const handleCreate = async () => {

        setIsLoading(true); 

        try{
            const response = await api.createOneCategorie(getCreateData);

            console.log(response);
            

            if(response?.data?.errors){
                setCreateDataError(response?.data?.errors)
                
            }

            if(response?.data?.error){
                setMessage(response?.data?.error)
                
                setTimeout(() => {
                    setMessage(false)
                }, 5000);
            }

            if(response?.data?.message){
                getAllCategoriesFetch()
                
                setMessage(response?.data?.message)

                setTimeout(() => {
                    setMessage(false)
                }, 5000);

                if(response?.data?.createCategorie){
                    setCreateForm(false)
                    setOpenModal(false)
                }
            }

        } catch(error){
            console.log(error);
            setMessage(error)
        }

        setIsLoading(false); 
    };

    // Suppression - Modal
    const deleteConfirm = (id) => {

        if(deleteForm){
            setDeleteForm(false)
            setDeleteId(false)
        } else{
            setDeleteForm(true)
            setDeleteId(id)
        }
    }

    // Suppresion 
    const handleDelete = async (id) => {
        try{
            const response = await api.deleteOneCategorie(id);

            setDeleteForm(false)

            if(response?.data?.message){
                setMessage(response?.data?.message)

                setTimeout(() => {
                    setMessage(false)
                }, 5000);

                if(response?.data?.deleteCategorie){
                    getAllCategoriesFetch()
                }
            }

            if(response?.data?.error){
                setMessage(response?.data?.error)

                setTimeout(() => {
                    setMessage(false)
                }, 5000);

            }

        } catch(error){
            console.log(error);
            setMessage(error)
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-black leading-tight">Categories</h2>}
        >
            <Head title="Categories" />
            <Loading show={isLoading} />
            <div className="sm:px-6 lg:px-8">

                <div className='flex justify-between page-title'>

                    <h1 className='title'>Categories </h1>

                    <button type="button"  onClick={createModal} className='btn btn-white' >Ajouter +</button>
                </div>

                {getMessage && (
                    <div className="success-message">{getMessage}</div>
                )}
              

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 overflow-x-auto">
                        <table className='w-full'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Nombre de produit</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {allCategories?.map((categorie) => (
                                <tr key={categorie.id}>
                                    <td>{categorie.id}</td>
                                    <td>{categorie.name}</td>
                                    <td>{categorie.products?.length}</td>
                                    <td className='actions flex'>
                                        <Link href={"/categories/" + categorie.id} className="btn"><Icon icon="ph:eye" /></Link>
                                        {/* <Link href="/categories/create" className="btn"><Icon icon="ph:pencil-light" /></Link> */}
                                        <button type="button"  onClick={() => { deleteConfirm(categorie.id) }} ><Icon icon="solar:trash-bin-2-outline" /></button>
                                    </td>
                                </tr>
                            ))}
                            
                            </tbody>
                        </table>
                        {!allCategories || allCategories.length <= 0 &&  <p className='text-center p-3 text-gray-400'>Vous n'avez pas encore de categories.</p> }
                    </div>
                </div>

                <Modal show={createForm} maxWidth={openModal ? "6xl" : "2xl"} onClose={() => { setCreateForm(false) }}>
                    <h3 className='text-center font-bold mb-5'>Créer un nouveau categorie</h3>

                    <form className={`p-6 text-gray-900 w-full form-without-media ${openModal ? "" : "show"}`}>
                       
                       <div className='block gap-4 w-full'  style={{ maxHeight: "calc(100vh - 320px)", overflowY: "auto" }}>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-4'>
                                <label htmlFor="name" className='mb-2'>Nom de la catégorie</label>
                                <input type="text" defaultValue={getCreateData?.name} name="name" id="name" onChange={handleChangeData}/>
                                <p className='error mt-2'>{getCreateDataError?.nameError}</p>
                            </div>
                       </div>
                   </form>

                    <div className='flex justify-center'>
                        <button type="button" className={`btn btn-red mr-4 btn-show ${openModal ? "" : "show"}`} onClick={() => { handleCreate() }} >Ajouter</button>
                        <button type="button" className='btn btn-light' onClick={() => { setCreateForm(false); setOpenModal(false); }}>Annuler</button>
                    </div>
                </Modal>

                <Modal show={deleteForm} maxWidth="lg" onClose={() => { setDeleteForm(false) }}>
                    <h3 className='text-center font-bold mb-5'>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</h3>

                    <div className='flex justify-center'>
                        <button type="button" className='btn btn-red mr-4' onClick={() => { handleDelete(deleteId) }} >Supprimer</button>
                        <button type="button" className='btn btn-light' onClick={() => { setDeleteForm(false)}}>Annuler</button>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
