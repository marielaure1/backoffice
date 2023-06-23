import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { Icon } from '@iconify/react';
import api from '@/Services/Api.js';
import Modal from '@/Components/Modal';
import Loading from '@/Components/Loading';
import { Blank } from "../../medias"

export default function Medias({ newClassName, chooseImage  }) {
     const [allMedias, setAllMedias] = useState(null);
     const [createForm, setCreateForm] = useState(false);
     const [getCreateData, setCreateData] = useState(null);
     const [getCreateDataError, setCreateDataError] = useState(null);
     const [getMessage, setMessage] = useState(false);
     const [isLoading, setIsLoading] = useState(false)

    const getAllMediasFetch = async () => {

        try{
            const response = await api.getMedias();

            // setAllMedias(response);
            console.log(response);

            if(response?.data?.allData){
                setAllMedias(response?.data?.allData)
            }
            
        } catch(error){
            console.log(error);
        }

    } 

    useEffect( () => {
        
        getAllMediasFetch()
        
    }, []);

    useEffect( () => {
        
        console.log(allMedias);
        
    }, [allMedias]);

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

        if (id === 'image') {
            const file = e.target.files[0];

            setCreateData((prev) => ({
                ...prev,
                image: file,
              }));
        } else{
            setCreateData((prev) => ({
                ...prev,
                title: id === 'title' ? value : prev?.title,
                alt: id === 'alt' ? value : prev?.alt
            }));
        }
        
    }

    const handleCreate = async () => {

        setIsLoading(true); 

        try{

            const formData = new FormData();
            formData.append('title', getCreateData.title);
            formData.append('alt', getCreateData.alt);
            formData.append('image', getCreateData.image);

            const response = await api.createOneMedia(formData);

            if(response?.data?.mediaData){
                getAllMediasFetch()
                setCreateForm(false)
            }

            if(response?.data?.error){
                setMessage(response?.data?.error)
            }

        } catch(error){
            console.log(error);
            setMessage(error)
        }

        setIsLoading(false); 
    };

    const chooseConfirm = (url) => {
        chooseImage(url)
    }


    return (
            <div className={`sm:px-6 lg:px-8 medias-modal ${newClassName}`} id="medias-list">

                <div className='flex justify-between page-title'>

                    <h1 className='title'>Medias</h1>

                    <button type="button"  onClick={createModal} className='btn btn-light' >Ajouter +</button>
                </div>
                <div className="bg-white sm:rounded-lg">

                    <div className="p-6 text-gray-900 grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                    {allMedias?.map((media) => (
                        <div className='card  ' key={media.id }  onClick={() => { chooseConfirm(media.url) }}>
                            <div className="card-img">
                                <img src={media.url} alt={media.alt} />
                            </div>

                        </div>
                    ))}
                    </div>
                    
                    {!allMedias &&  <p className='text-center p-3 text-gray-400'>Vous n'avez pas encore de medias.</p> }


                </div>

                <Modal show={createForm} maxWidth="xl" onClose={() => { setCreateForm(false) }}>
                    <h3 className='text-center font-bold mb-5'>Créer un nouveau media</h3>

                    <form className={`p-6 text-gray-900 w-full`}>
                       
                       <div className='block gap-4 w-full'  style={{ maxHeight: "calc(100vh - 320px)", overflowY: "auto" }}>
                          
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="title" className='mb-2'>Titre</label>
                                <input type="text" defaultValue={getCreateData?.title} name="title" id="title" onChange={handleChangeData}/>
                                <p className='error'>{getCreateDataError?.title}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="alt" className='mb-2'>Alt</label>
                                <input type="text" defaultValue={getCreateData?.alt} name="alt" id="alt" onChange={handleChangeData} />
                                <p className='error'>{getCreateDataError?.alt}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="image" className='mb-2'>Image</label>

                                <div className='drag-drop'>
                                    <div>
                                        <img src={Blank} alt="" />
                                        <h4 className='text-red-400'>{getCreateData?.image?.name}</h4>
                                        <h2><span className='underline text-sky-400'>Choisissez </span> ou glisser/déposer un media </h2>
                                    </div>
                                    <input type="file" accept="image/*" name="image" id="image" onChange={handleChangeData} />
                                </div>
                                
                                <p className='error'>{getCreateDataError?.image}</p>
                            </div>
                       </div>
                   </form>

                    <div className='flex justify-center'>
                        <button type="button" className='btn btn-red mr-4' onClick={() => { handleCreate() }} >Ajouter</button>
                        <button type="button" className='btn btn-light' onClick={() => { setCreateForm(false) }}>Annuler</button>
                    </div>
                </Modal>
            </div>
    );
}
