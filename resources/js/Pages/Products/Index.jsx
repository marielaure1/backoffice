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
import Select from 'react-select';
import { toArray } from 'lodash';

// partial reloads
export default function Products({ auth }) {
    const [allProducts, setAllProducts] = useState(null);
     const [deleteForm, setDeleteForm] = useState(false);
     const [deleteId, setDeleteId] = useState(false);
     const [createForm, setCreateForm] = useState(false);
     const [getData, setData] = useState(null);
     const [getCreateData, setCreateData] = useState(null);
     const [getCreateDataError, setCreateDataError] = useState(null);
     const [getMessage, setMessage] = useState(false);
     const [openModal, setOpenModal] = useState(false)
     const [isLoading, setIsLoading] = useState(false)
     const [getAllPlans, setAllPlans] = useState(null)
     const [getAllCollections, setAllCollections] = useState(null)
     const [getAllCategories, setAllCategories] = useState(null)
     const [listImages, setListImages] = useState([]);
     const [listCategories, setListCategories] = useState([]);

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

    // Récupérer tous les products
    const getAllProductsFetch = async () => {
            
        try{
            const response = await api.getProducts();

            // setAllProducts(response);
            console.log(response);

            if(response?.data?.allProducts){
                setAllProducts(response?.data?.allProducts)
            }
        } catch(error){
            console.log(error);
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

    // Récuperer toutes les catégories
    const getAllCategoriesFetch = async () => {
        
        try{
            const response = await api.getCategories();

            // setAllProducts(response);
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
        
        getAllProductsFetch()
        getAllPlansFetch()
        getAllCollectionsFetch()
        getAllCategoriesFetch()

        setCreateData((prev) => ({
            ...prev,
            categories: [],
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
            price: id === 'price' ? value : prev?.price,
            short_description: id === 'short_description' ? value : prev?.short_description,
            stock: id === 'stock' ? value : prev?.stock,
            plan_id: id === 'plan_id' ? value : prev?.plan_id,
            collection_id: id === 'collection_id' ? value : prev?.user_id,
            published: id === 'published' ? e.target?.checked : prev?.published,       
        }));
    }

   const handleChangeDataSelect = async (value) => {
        setListCategories(value);
      
        const newCategories = toArray(value.map((obj) => obj.value));
        // console.log(newCategories);
        
        setCreateData((prev) => ({
          ...prev,
          categories: newCategories
        }));
      };   // Create Change Data
  
      

    const handleChangeWYSIWYGDescription = async (value) => {

        setCreateData((prev) => ({
            ...prev,
            description: value
        }));
    }

    const handleChangeWYSIWYGComposition = async (value) => {

        setCreateData((prev) => ({
            ...prev,
            composition: value
        }));
    }

    // Create submit
    const handleCreate = async () => {

        setIsLoading(true); 

        try{
            const response = await api.createOneProduct(getCreateData);

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
                getAllProductsFetch()
                
                setMessage(response?.data?.message)

                setTimeout(() => {
                    setMessage(false)
                }, 5000);

                if(response?.data?.createProducts){
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
            const response = await api.deleteOneProduct(id);

            console.log(response);
            setDeleteForm(false)

            

            if(response?.data?.message){
                setMessage(response?.data?.message)

                setTimeout(() => {
                    setMessage(false)
                }, 5000);

                if(response?.data?.deleteProduct){
                    getAllProductsFetch()
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
        
        const newImages = [...listImages, url];
      
        setListImages(newImages);
        
        setCreateData((prev) => ({
          ...prev,
          images: newImages
        }));
      
        setOpenModal(false);
    };


      

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-black leading-tight">Products</h2>}
        >
            <Head title="Products" />
            <Loading show={isLoading} />
            <div className="sm:px-6 lg:px-8">

                <div className='flex justify-between page-title'>

                    <h1 className='title'>Products </h1>

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
                                    <th>Prix</th>
                                    <th>Publier</th>
                                    <th>Stock</th>
                                    <th>Plan</th>
                                    <th>Collection</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {allProducts?.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.title}</td>
                                    <td>{product.price} €</td>
                                    <td>
                                        <span className={`badge ${product.published == true ? "badge-green" : "badge-red"}`}>{product.published == true ? "OUI" : "NON"}</span>
                                    </td>
                                    <td>{product.stock}</td>
                                    <td>{product.plan.title}</td>
                                    <td>{product.collection.title}</td>
                                    <td className='actions flex'>
                                        <Link href={"/products/" + product.id} className="btn"><Icon icon="ph:eye" /></Link>
                                        <button type="button"  onClick={() => { deleteConfirm(product.id) }} ><Icon icon="solar:trash-bin-2-outline" /></button>
                                    </td>
                                </tr>
                            ))}
                            
                            </tbody>
                        </table>
                        {!allProducts || allProducts.length <= 0 &&  <p className='text-center p-3 text-gray-400'>Vous n'avez pas encore de products.</p> }
                    </div>
                </div>

                <Modal show={createForm} maxWidth={openModal ? "6xl" : "2xl"} onClose={() => { setCreateForm(false) }}>
                    <h3 className='text-center font-bold mb-5'>Créer un nouveau produit</h3>

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
                                <label htmlFor="price" className='mb-2' min="0.01" max="1000">Prix</label>
                                <input type="number" defaultValue={getCreateData?.price} name="price" id="price" onChange={handleChangeData} />
                                <p className='error mt-2'>{getCreateDataError?.priceError}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-4'>
                                <label htmlFor="short_description" className='mb-2'>Description courte</label>
                                <input type="text" defaultValue={getCreateData?.short_description} name="short_description" id="short_description" onChange={handleChangeData}/>
                                <p className='error mt-2'>{getCreateDataError?.short_descriptionError}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="stock" className='mb-2' min="1">Stock</label>
                                <input type="number" defaultValue={getCreateData?.stock} name="stock" id="stock" onChange={handleChangeData} />
                                <p className='error mt-2'>{getCreateDataError?.stockError}</p>
                            </div>
                            
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="categories" className='mb-2'>Catégorie</label>
                                <Select
                                    name="categories"
                                    id="categories"
                                    defaultValue={getCreateData?.categories}
                                    onChange={handleChangeDataSelect}
                                    options={getAllCategories?.map((categorie) => ({
                                        value: categorie?.id,
                                        label: categorie?.name
                                    }))}
                                    isMulti
                                    />

                                <p className='error mt-2'>{getCreateDataError?.categoriesError}</p>
                            </div>

                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="plan_id" className='mb-2'>Plan</label>
                                <select name="plan_id" id="plan_id" defaultValue={getCreateData?.plan_id} onChange={handleChangeData}>
                                   <option value="" disabled selected>Choisissez un plan</option>  
                                    {getAllPlans?.map((plan) => (
                                        <option  key={plan?.id} value={plan?.id}>{plan?.title}</option>
                                    ))}
                                </select>
                                <p className='error mt-2'>{getCreateDataError?.plan_idError}</p>
                            </div>

                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="collection_id" className='mb-2'>Collection</label>
                                <select name="collection_id" id="collection_id" defaultValue={getCreateData?.collection_id} onChange={handleChangeData}>
                                <option value="" disabled selected>Choisissez une collection</option>
                                    {getAllCollections?.map((collection) => (
                                        <option  key={collection?.id}  value={collection?.id}>{collection?.title}</option>
                                    ))}
                                </select>
                                <p className='error mt-2'>{getCreateDataError?.collection_idError}</p>
                            </div>

                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="published" className='mb-2'>Publier</label>
                                <Switch checked={getCreateData?.published} onChange={handleChangeData} id="published" color="secondary" />
                                <p className='error mt-2'>{getCreateDataError?.publishedError}</p>
                            </div>

                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="description" className='mb-2'>Description</label>
                                <ReactQuill value={getCreateData?.description}  name="description" id="description" onChange={handleChangeWYSIWYGDescription} modules={editorOptions.modules} formats={editorOptions.formats} style={{ minHeight: "140px" }}/>
                                <p className='error mt-2'>{getCreateDataError?.descriptionError}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="composition" className='mb-2'>Composition</label>
                                <ReactQuill value={getCreateData?.composition}  name="composition" id="composition" onChange={handleChangeWYSIWYGComposition} modules={editorOptions.modules} formats={editorOptions.formats} style={{ minHeight: "140px" }}/>
                                <p className='error mt-2'>{getCreateDataError?.compositionError}</p>
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
