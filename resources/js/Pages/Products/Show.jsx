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
    const [listImages, setListImages] = useState([]);
    const [getAllPlans, setAllPlans] = useState(null)
     const [getAllCollections, setAllCollections] = useState(null)

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

    const handleOpenModal = () => {
        setCreateForm(true);
      };

    const goBack = () => {
        window.history.back();
    };

    const getOneProductFetch = async () => {
            
        try{
            const response = await api.getOneProduct(id);

            console.log(response);

            if(response?.data?.showProduct){
                setData(response?.data?.showProduct)
                setUpdateData(response?.data?.showProduct)
                setListImages(response?.data?.showProduct?.images)
            }

            setMessage("")
        } catch(error){
            setMessage(error)
        }
    } 

      // Récuperer tous les plans
      const getAllPlansFetch = async () => {
            
        try{
            const response = await api.getPlans();

            // setAllProducts(response);
            console.log(response);

            if(response?.data?.allPlans){
                setAllPlans(response?.data?.allPlans)
            }
        } catch(error){
            console.log(error);
        }
    } 

    // Récuperer tous les plans
    const getAllCollectionsFetch = async () => {
        
        try{
            const response = await api.getCollections();

            // setAllProducts(response);
            console.log(response);

            if(response?.data?.allCollection){
                setAllCollections(response?.data?.allCollection)
            }
        } catch(error){
            console.log(error);
        }
    } 

    useEffect( () => {
        getOneProductFetch()
        getAllPlansFetch()
        getAllCollectionsFetch()
        
    }, []); 

    const openForm = (el) => {
        setFormActive(el)
    }

    const handleChangeData = (e) => {
        let { id, value } = e.target

        setUpdateData((prev) => ({
            ...prev,
            title: id === 'title' ? value : prev?.title,
            price: id === 'price' ? value : prev?.price,
            images: id === 'images' ? value : prev?.images,
            short_description: id === 'short_description' ? value : prev?.short_description,
            stock: id === 'stock' ? value : prev?.stock,
            plan_id: id === 'plan_id' ? value : prev?.plan_id,
            collection_id: id === 'collection_id' ? value : prev?.user_id,
            published: id === 'published' ? e.target?.checked : prev?.published,       
        }));
    }

    const handleChangeWYSIWYGDescription = async (value) => {

        setUpdateData((prev) => ({
            ...prev,
            description: value
        }));
    }

    const handleChangeWYSIWYGComposition = async (value) => {

        setUpdateData((prev) => ({
            ...prev,
            composition: value
        }));
    }

    const handleSubmitData = async (e) => {
        e.preventDefault()
        
        try{
            const response = await api.updateOneProduct(getUpdateData, id);

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

                if(response?.data?.updateProduct){
                    setData(response?.data?.updateProduct)
                    setUpdateData(response?.data?.updateProduct)
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
            const response = await api.deleteOneProduct(id);

            console.log(response);
        

            if(response?.data?.message){
                setMessage(response?.data?.message)

                if(response?.data?.deleteProduct){
                    router.get('/products')
                }
            }

        } catch(error){
            console.log(error);
            setMessage(error)
        }
    };

    const handleRemoveImage = (url) => {
        const updatedImages = listImages.filter((image) => image !== url);
      
        setListImages(updatedImages);
      
        setCreateData((prev) => ({
          ...prev,
          images: updatedImages
        }));

        setSuccess(false);
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
            product={auth.product}
            header={<h2 className="font-semibold text-xl text-black leading-tight">Products</h2>}
        >
            <Head title="Products" />
            <div className="sm:px-6 lg:px-8">
                <div className='flex items-center page-title'>
                    <Link href="/products" className='go-back'>
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
                       
                        <p>Prix : {getData?.price} €</p>
                        <p>Slug : {getData?.slug} </p>
                        <p>Stock : <span>{getData?.stock}</span></p>
                        <p>Plan : <Link className='underline' href={"/plans/" + getData?.plan.id}>{getData?.plan.title}</Link></p>
                        <p>Collection : <Link className='underline' href={"/collections/" + getData?.collection.id}>{getData?.collection.title}</Link></p>
                        <div className='flex flex-wrap'>
                        <p className='mb-2 mr-2'>Catégories :</p>
                            {getData?.categories.map(categorie => (
                                <span className={`badge badge-categorie mr-2`}>{categorie.name}</span>
                            ))}
                        </div>
                        <p>Stripe ID : <span>{getData?.stripe_id}</span></p>
                        <p>Stripe Price ID : <span>{getData?.stripe_price_id}</span></p>
                        <p>Description courte : <span>{getData?.short_description}</span></p>
                        <p>Stripe_id : {getData?.stripe_id != " N/A" ? getData?.stripe_id : <span className="text-red-600">N/A</span> }</p>
                        <p>Description :</p>
                        <div className="content" dangerouslySetInnerHTML={{ __html: getData?.description }}></div>
                        <p>Composition :</p>
                        <div className="content" dangerouslySetInnerHTML={{ __html: getData?.composition }}></div>

                        <p>Créée <span>{DateTime.fromISO(getData?.created_at).toRelative()}  ({ DateTime.fromISO(getData?.created_at).toFormat('f')})</span></p>
                    </div>
                    

                    <form className={`p-6 text-gray-900 w-full block-content ${formActive == "infos-form" ? "active" : ""}`}>
                       
                       <div className='gap-4 w-full'>
                            <h2 className="flex items-center font-semibold col-span-2 lg:mb-0 mb-2">Détails <button type="button" className='ml-4' onClick={() => openForm("infos")}><Icon icon="system-uicons:cross" /></button></h2>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="title" className='mb-2'>Titre</label>
                                <input type="text" defaultValue={getUpdateData?.title} name="title" id="title" onChange={handleChangeData}/>
                                <p className='error'>{getUpdateDataError?.title}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="price" className='mb-2'>Prix</label>
                                <input type="number" defaultValue={getUpdateData?.price} name="price" id="price" min="0" onChange={handleChangeData}/>
                                <p className='error'>{getUpdateDataError?.price}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="stock" className='mb-2'>Stock</label>
                                <input type="number" defaultValue={getUpdateData?.stock} name="stock" id="stock" onChange={handleChangeData}/>
                                <p className='error'>{getUpdateDataError?.stock}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="short_description" className='mb-2'>Description courte</label>
                                <input type="text" defaultValue={getUpdateData?.short_description} name="short_description" id="short_description" onChange={handleChangeData}/>
                                <p className='error'>{getUpdateDataError?.short_description}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="plan_id" className='mb-2'>Plan</label>
                                <select name="plan_id" id="plan_id" defaultValue={getUpdateData?.plan_id} onChange={handleChangeData}>
                                   <option value="" disabled>Choisissez un plan</option>  
                                    {getAllPlans?.map((plan) => (
                                        <option  key={plan?.id} value={plan?.id}>{plan?.title}</option>
                                    ))}
                                </select>
                                <p className='error mt-2'>{getUpdateDataError?.plan_idError}</p>
                            </div>

                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="collection_id" className='mb-2'>Collection</label>
                                <select name="collection_id" id="collection_id" defaultValue={getUpdateData?.collection_id} onChange={handleChangeData}>
                                <option value="" disabled>Choisissez une collection</option>
                                    {getAllCollections?.map((collection) => (
                                        <option  key={collection?.id}  value={collection?.id}>{collection?.title}</option>
                                    ))}
                                </select>
                                <p className='error mt-2'>{getUpdateDataError?.collection_idError}</p>
                            </div>
                            
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="description" className='mb-2'>Description</label>
                                <ReactQuill value={getUpdateData?.description}  name="description" id="description" onChange={handleChangeWYSIWYGDescription} modules={editorOptions.modules} formats={editorOptions.formats} />
                                <p className='error'>{getUpdateDataError?.description}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="composition" className='mb-2'>Composition</label>
                                <ReactQuill value={getUpdateData?.composition}  name="composition" id="composition" onChange={handleChangeWYSIWYGComposition} modules={editorOptions.modules} formats={editorOptions.formats} />
                                <p className='error'>{getUpdateDataError?.composition}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="published" className='mb-2'>Publier</label>
                                <Switch checked={getUpdateData?.published} onChange={handleChangeData} id="published" color="secondary" />
                                <p className='error'>{getUpdateDataError?.published}</p>
                            </div>
                            
                            <div className='col-span-2 flex justify-end pt-2'>
                                <button type="submit" className='btn btn-purple mb-2' id="form-products" onClick={handleSubmitData}>Valider</button>
                            </div>
                       </div>
                   </form>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4 block-data">
                    <div className={`p-6 text-gray-900 w-full block-content  ${formActive == "mdp-form" ? "" : "active"}`}  style={{maxWidth: "400px"}}>
                       
                        <h2 className="flex items-center font-semibold mb-3">Image <button type="button" className='ml-4' onClick={() => openForm("mdp-form")}><Icon icon="ph:pencil-light" /></button></h2>
                           
                          
                            <div className='col-span-1 lg:mb-0 mb-4'>
                                <button type="button" onClick={handleOpenModal} className='btn btn-purple mt-3 me-4'>
                                    Modifier l'image
                                </button>
                                <button type="button" onClick={(e) => { handleSubmitData(e); setSuccess(false); }} className={`btn btn-light btn-show mt-3 ${getSuccess ? "show" : ""} `}>
                                    Valider
                                </button>
                            </div>

                            <div className='grid grid-col-2 gap-4 lg:mb-0 mb-4'>
                                {getUpdateData?.images?.map(image => (
                                    <div className='card ' key={image}>
                                        <div className="card-img">
                                            <img src={image} alt="youvence" />
                                        </div>
                                        <div className="card-infos">
                                            <button type="button"  onClick={() => { handleRemoveImage(image) }} className='btn btn-red'><Icon icon="solar:trash-bin-2-outline" /></button>
                                        </div>

                                    </div>
                                ))}
                                
                            </div>
                    </div>
                   
                </div>

                <button className='btn btn-red-line' onClick={deleteConfirm}>Supprimer le product</button>

                <Modal show={createForm} maxWidth="6xl" onClose={() => { setCreateForm(false) }}>
                     <Medias newClassName="show" chooseImage={handleChooseImage} />
                </Modal>
                <Modal show={deleteForm} maxWidth="lg" onClose={() => { setDeleteForm(false) }}>
                    <h3 className='text-center font-bold mb-5'>Êtes-vous sûr de vouloir supprimer ce product ?</h3>

                    <div className='flex justify-center'>
                        <button type="button" className='btn btn-red mr-4' onClick={() => { handleDelete(getData?.id) }} >Supprimer</button>
                        <button type="button" className='btn btn-light' onClick={() => { setDeleteForm(false) }}>Annuler</button>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
