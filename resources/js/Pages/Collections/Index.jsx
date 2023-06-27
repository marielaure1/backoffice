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
export default function Collections({ auth }) {
    const [allCollections, setAllCollections] = useState(null);
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

    // Récupérer tous mles collections
    const getAllCollectionsFetch = async () => {
            
        try{
            const response = await api.getCollections();

            // setAllCollections(response);
            console.log(response);

            if(response?.data?.allCollection){
                setAllCollections(response?.data?.allCollection)
            }
        } catch(error){
            console.log(error);
        }
    } 

    // Init
    useEffect( () => {
        
        getAllCollectionsFetch()

        setCreateData((prev) => ({
            ...prev,
            interval: "month",
            published: true
        }));
        
    }, []);

    useEffect( () => {
        
        console.log(getCreateData);
        
    }, [getCreateData]);

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

        if(id === 'limite'){
            const limiteDateTime = DateTime.fromISO(value, { zone: 'Europe/Paris' });
            limiteDateTime.toJSDate()

            setCreateData((prev) => ({
                ...prev,
                limite: limiteDateTime,
            }));
        } else {

            setCreateData((prev) => ({
                ...prev,
                title: id === 'title' ? value : prev?.title,
                published: id === 'published' ? e.target?.checked : prev?.published,
            }));
        }

        
    }

    // Create submit
    const handleCreate = async () => {

        setIsLoading(true); 

        try{
            const response = await api.createOneCollection(getCreateData);

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
                getAllCollectionsFetch()
                
                setMessage(response?.data?.message)

                setTimeout(() => {
                    setMessage(false)
                }, 5000);

                if(response?.data?.createCollection){
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
            const response = await api.deleteOneCollection(id);

            console.log(response);
            setDeleteForm(false)

            

            if(response?.data?.message){
                setMessage(response?.data?.message)

                setTimeout(() => {
                    setMessage(false)
                }, 5000);

                if(response?.data?.deleteCollection){
                    getAllCollectionsFetch()
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

    // Create choose image
    const handleChooseImage = (url) => {
        setCreateData((prev) => ({
            ...prev,
            image: url
        }));

        setOpenModal(false)
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-black leading-tight">Collections</h2>}
        >
            <Head title="Collections" />
            <Loading show={isLoading} />
            <div className="sm:px-6 lg:px-8">

                <div className='flex justify-between page-title'>

                    <h1 className='title'>Collections </h1>

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
                                    <th>Titre</th>
                                    <th>Limite</th>
                                    <th>Publier</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {allCollections?.map((collection) => (
                                <tr key={collection.id}>
                                    <td>{collection.id}</td>
                                    <td>{collection.title}</td>
                                    <td>{collection.limite}</td>
                                    <td>
                                        <span className={`badge ${collection.published == true ? "badge-green" : "badge-red"}`}>{collection.published == true ? "OUI" : "NON"}</span>
                                    </td>
                                    <td className='actions flex'>
                                        <Link href={"/collections/" + collection.id} className="btn"><Icon icon="ph:eye" /></Link>
                                        {/* <Link href="/collections/create" className="btn"><Icon icon="ph:pencil-light" /></Link> */}
                                        <button type="button"  onClick={() => { deleteConfirm(collection.id) }} ><Icon icon="solar:trash-bin-2-outline" /></button>
                                    </td>
                                </tr>
                            ))}
                            
                            </tbody>
                        </table>
                        {!allCollections || allCollections.length <= 0 &&  <p className='text-center p-3 text-gray-400'>Vous n'avez pas encore de collections.</p> }
                    </div>
                </div>

                <Modal show={createForm} maxWidth={openModal ? "6xl" : "2xl"} onClose={() => { setCreateForm(false) }}>
                    <h3 className='text-center font-bold mb-5'>Créer un nouveau collection</h3>

                    <form className={`p-6 text-gray-900 w-full form-without-media ${openModal ? "" : "show"}`}>
                       
                       <div className='block gap-4 w-full'  style={{ maxHeight: "calc(100vh - 320px)", overflowY: "auto" }}>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-4'>
                                <div className="form-img">
                                    <div className="card-img">
                                        <img src={getCreateData?.image || Blank} alt="" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className='col-span-1 flex flex-col items-center lg:mb-0 mb-4'>
                                <button type="button" onClick={handleOpenModal} className='btn btn-purple mt-3 mb-2'>
                                    {!getCreateData?.image ? "Ajouter une image" : "Modifier l'image"}
                                </button>
                                <p className='error'>{getCreateDataError?.imageError}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-4'>
                                <label htmlFor="title" className='mb-2'>Titre</label>
                                <input type="text" defaultValue={getCreateData?.title} name="title" id="title" onChange={handleChangeData}/>
                                <p className='error mt-2'>{getCreateDataError?.titleError}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="limite" className='mb-2'>Date limite</label>
                                <input type="date" defaultValue={getCreateData?.limite} name="limite" id="limite" onChange={handleChangeData} />
                                <p className='error mt-2'>{getCreateDataError?.limiteError}</p>
                            </div>


                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="published" className='mb-2'>Publier</label>
                                <Switch checked={getCreateData?.published} onChange={handleChangeData} id="published" color="secondary" />
                                <p className='error mt-2'>{getCreateDataError?.publishedError}</p>
                            </div>
                       </div>
                   </form>

                   <Medias newClassName={`${openModal ? "show" : ""}`} chooseImage={handleChooseImage} />

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
