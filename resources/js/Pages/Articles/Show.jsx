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

    const [openModal, setOpenModal] = useState(false)
    // const history = useHistory();

    const { url } = usePage();

    const handleOpenModal = () => {
        setCreateForm(true);
      };

    const goBack = () => {
        window.history.back();
    };

    const getOneArticleFetch = async () => {
            
        try{
            const response = await api.getOneArticle(id);

            console.log(response);
            
            if(response?.data?.showPost){
                setData(response?.data?.showPost)
                setUpdateData(response?.data?.showPost)
            }

            setMessage("")
        } catch(error){
            setMessage(error)
        }
    } 

    useEffect( () => {
        getOneArticleFetch()
        
    }, []); 

    const openForm = (el) => {
        setFormActive(el)
    }

    const handleChangeData = (e) => {
        let { id, value } = e.target

        setUpdateData((prev) => ({
            ...prev,
            image: id === 'image' ? value : prev?.image,
            published: id === 'published' ? e.target?.checked : prev?.published,
            title: id === 'title' ? value : prev?.title,
        }));
    }

    const handleChangeWYSIWYG = async (value) => {

        setUpdateData((prev) => ({
            ...prev,
            body: value
        }));
    }

    const handleSubmitData = async (e) => {
        e.preventDefault()
        
        try{
            const response = await api.updateOneArticle(getUpdateData, id);

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

                if(response?.data?.updatePost){
                    setData(response?.data?.updatePost)
                    setUpdateData(response?.data?.updatePost)
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
            const response = await api.deleteOneArticle(id);

            console.log(response);
        

            if(response?.data?.message){
                setMessage(response?.data?.message)

                if(response?.data?.deletePost){
                    router.get('/articles')
                }
            }

        } catch(error){
            console.log(error);
            setMessage(error)
        }
    };

    const handleChooseImage = (url) => {

        setUpdateData((prev) => ({
            ...prev,
            image: url
        }));

        setCreateForm(false)
        setSuccess(true);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-black leading-tight">Articles</h2>}
        >
            <Head title="Articles" />
            <div className="sm:px-6 lg:px-8">
                <div className='flex items-center page-title'>
                    <Link href="/articles" className='go-back'>
                        <Icon icon="ph:arrow-circle-left-light" />
                    </Link>

                    <h1 className='title'>{getData?.title}</h1>
                    
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
                            <span className={`badge ${getData?.published == true ? "badge-green" : "badge-red"}`}>{getData?.published == true ? "OUI" : "NON"}</span>
                        </h2>
                       
                        <p>Auteur : <Link className='underline' href={"/users/" + getData?.user?.id}>{getData?.user.first_name} <strong>{getData?.user.last_name}</strong></Link></p>
                        <p>Slug : {getData?.slug}</p>
                        <p>Contenu :</p>
                        <div className="content" dangerouslySetInnerHTML={{ __html: getData?.body }}></div>

                        <p>Créée <span>{DateTime.fromISO(getData?.created_at).toRelative()}  ({ DateTime.fromISO(getData?.created_at).toFormat('f')})</span></p>
                    </div>
                    

                    <form className={`p-6 text-gray-900 w-full block-content ${formActive == "infos-form" ? "active" : ""}`}>
                       
                       <div className='lg:grid grid-cols-2 gap-4 w-full'>
                            <h2 className="flex items-center font-semibold col-span-2 lg:mb-0 mb-2">Détails <button type="button" className='ml-4' onClick={() => openForm("infos")}><Icon icon="system-uicons:cross" /></button></h2>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="title" className='mb-2'>Titre</label>
                                <input type="text" defaultValue={getUpdateData?.title} name="title" id="title" onChange={handleChangeData}/>
                                <p className='error'>{getUpdateDataError?.title}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="body" className='mb-2'>Body</label>
                                <ReactQuill value={getUpdateData?.body}  name="body" id="body" onChange={handleChangeWYSIWYG} modules={editorOptions.modules} formats={editorOptions.formats} />
                                <p className='error'>{getUpdateDataError?.body}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="published" className='mb-2'>Publier</label>
                                <Switch checked={getUpdateData?.published} onChange={handleChangeData} id="published" color="secondary" />
                                <p className='error'>{getUpdateDataError?.published}</p>
                            </div>
                            
                            <div className='col-span-2 flex justify-end pt-2'>
                                <button type="submit" className='btn btn-purple mb-2' id="form-plans" onClick={handleSubmitData}>Valider</button>
                            </div>
                       </div>
                   </form>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4 block-data">
                    <div className={`p-6 text-gray-900 w-full block-content  ${formActive == "mdp-form" ? "" : "active"}`}  style={{maxWidth: "400px"}}>
                       
                        <h2 className="flex items-center font-semibold mb-3">Image <button type="button" className='ml-4' onClick={() => openForm("mdp-form")}><Icon icon="ph:pencil-light" /></button></h2>
                         <div className='col-span-1 flex flex-col lg:mb-0 mb-4'>
                                <div className="form-img">
                                    <div className="card-img">
                                        <img src={getUpdateData?.image || Blank} alt="" />
                                    </div>
                                </div>
                            </div>
                          
                            <div className='col-span-1 lg:mb-0 mb-4'>
                                <button type="button" onClick={handleOpenModal} className='btn btn-purple mt-3 me-4'>
                                    Modifier l'image
                                </button>
                                <button type="button" onClick={(e) => { handleSubmitData(e); setSuccess(false); }} className={`btn btn-light btn-show mt-3 ${getSuccess ? "show" : ""} `}>
                                    Valider
                                </button>
                            </div>
                    </div>
                   
                </div>

                <button className='btn btn-red-line' onClick={deleteConfirm}>Supprimer l'article</button>

                <Modal show={createForm} maxWidth="6xl" onClose={() => { setCreateForm(false) }}>
                     <Medias newClassName="show" chooseImage={handleChooseImage} />
                </Modal>
                <Modal show={deleteForm} maxWidth="lg" onClose={() => { setDeleteForm(false) }}>
                    <h3 className='text-center font-bold mb-5'>Êtes-vous sûr de vouloir supprimer cet article ?</h3>

                    <div className='flex justify-center'>
                        <button type="button" className='btn btn-red mr-4' onClick={() => { handleDelete(getData?.id) }} >Supprimer</button>
                        <button type="button" className='btn btn-light' onClick={() => { setDeleteForm(false) }}>Annuler</button>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
