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

// partial reloads
export default function Articles({ auth }) {
    const [allArticles, setAllArticles] = useState(null);
     const [deleteForm, setDeleteForm] = useState(false);
     const [deleteId, setDeleteId] = useState(false);
     const [createForm, setCreateForm] = useState(false);
     const [getData, setData] = useState(null);
     const [getCreateData, setCreateData] = useState(null);
     const [getCreateDataError, setCreateDataError] = useState(null);
     const [getMessage, setMessage] = useState(false);
     const [openModal, setOpenModal] = useState(false)
     const [isLoading, setIsLoading] = useState(false)

     const editorOptions = {
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        },
        formats: [
          'header',
          'bold', 'italic', 'underline', 'strike', 'blockquote',
          'list', 'bullet',
          'link', 'image',
        ],
      };
      

     const handleOpenModal = () => {
        setOpenModal(true);
      };

    // Récupérer tous mles Articles
    const getAllArticlesFetch = async () => {
            
        try{
            const response = await api.getArticles();

            // setAllArticles(response);
            console.log(response);

            if(response?.data?.allPost){
                setAllArticles(response?.data?.allPost)
            }
        } catch(error){
            console.log(error);
        }
    } 

    // Init
    useEffect( () => {
        
        getAllArticlesFetch()

        setCreateData((prev) => ({
            ...prev,
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
        
        setCreateData((prev) => ({
            ...prev,
            title: id === 'title' ? value : prev?.title,
            image: id === 'image' ? value : prev?.image,
            published_at: id === 'published_at' ? value : prev?.published_at,
            published: id === 'published' ? e.target?.checked : prev?.published
        }));
    }

    const handleChangeWYSIWYG = async (value) => {

        setCreateData((prev) => ({
            ...prev,
            body: value
        }));
    }

    // Create submit
    const handleCreate = async () => {

        setIsLoading(true); 

        try{
            const response = await api.createOneArticle(getCreateData);

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
                setMessage(response?.data?.message)

                setTimeout(() => {
                    setMessage(false)
                }, 5000);

                if(response?.data?.createArticles){
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
            const response = await api.deleteOneArticle(id);

            console.log(response);
            setDeleteForm(false)

            

            if(response?.data?.message){
                setMessage(response?.data?.message)

                setTimeout(() => {
                    setMessage(false)
                }, 5000);

                if(response?.data?.deletePost){
                    getAllArticlesFetch()
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
            header={<h2 className="font-semibold text-xl text-black leading-tight">Articles</h2>}
        >
            <Head title="Articles" />
            <Loading show={isLoading} />
            <div className="sm:px-6 lg:px-8">

                <div className='flex justify-between page-title'>

                    <h1 className='title'>Articles </h1>

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
                                    <th>Publier</th>
                                    <th>Publier le</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {allArticles?.map((articles) => (
                                <tr key={articles.id}>
                                    <td>{articles.id}</td>
                                    <td>{articles.title}</td>
                                    <td>
                                        <span className={`badge ${articles.published == true ? "badge-green" : "badge-red"}`}>{articles.published == true ? "OUI" : "NON"}</span>
                                    </td>
                                    <td>{articles.published_at}</td>
                                    <td className='actions flex'>
                                        <Link href={"/articles/" + articles.id} className="btn"><Icon icon="ph:eye" /></Link>
                                        <button type="button"  onClick={() => { deleteConfirm(articles.id) }} ><Icon icon="solar:trash-bin-2-outline" /></button>
                                    </td>
                                </tr>
                            ))}
                            
                            </tbody>
                        </table>
                        {!allArticles &&  <p className='text-center p-3 text-gray-400'>Vous n'avez pas encore d'articles.</p> }
                    </div>
                </div>

                <Modal show={createForm} maxWidth="6xl" onClose={() => { setCreateForm(false) }}>
                    <h3 className='text-center font-bold mb-5'>Créer un nouvel articles</h3>

                    <form className={`p-6 text-gray-900 w-full form-without-media ${openModal ? "" : "show"}`}>
                       
                       <div className='block gap-4 w-full'  style={{ maxHeight: "calc(100vh - 320px)", overflowY: "auto" }}>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-4'>
                                <div className="form-img">
                                    <div className="card-img">
                                        <img src={getCreateData?.image || Blank} alt="" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className='col-span-1 flex justify-center lg:mb-0 mb-4'>
                                <button type="button" onClick={handleOpenModal} className='btn btn-purple mt-3'>
                                    {!getCreateData?.image ? "Ajouter une image" : "Modifier l'image"}
                                </button>
                                <p className='error'>{getCreateDataError?.imageError}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-4'>
                                <label htmlFor="title" className='mb-2'>Titre</label>
                                <input type="text" defaultValue={getCreateData?.title} name="title" id="title" onChange={handleChangeData}/>
                                <p className='error'>{getCreateDataError?.titleError}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-4'>
                                <label htmlFor="published_at" className='mb-2'>Publier le</label>
                                <input type="datetime-local" defaultValue={getCreateData?.published_at} name="published_at" id="published_at" onChange={handleChangeData}/>
                                <p className='error'>{getCreateDataError?.published_atError}</p>
                            </div>

                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="published" className='mb-2'>Publier</label>
                                <Switch checked={getCreateData?.published} onChange={handleChangeData} id="published" color="secondary" />
                                <p className='error'>{getCreateDataError?.publishedError}</p>
                            </div>

                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="body" className='mb-2'>Contenu</label>
                                <ReactQuill value={getCreateData?.body}  name="body" id="body" onChange={handleChangeWYSIWYG} modules={editorOptions.modules} formats={editorOptions.formats} />
                                <p className='error'>{getCreateDataError?.bodyError}</p>
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
