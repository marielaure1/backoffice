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
import Select from 'react-select';

// partial reloads
export default function PromoCodes({ auth }) {
    const [allPromoCodes, setAllPromoCodes] = useState(null);
     const [deleteForm, setDeleteForm] = useState(false);
     const [deleteId, setDeleteId] = useState(false);
     const [createForm, setCreateForm] = useState(false);
     const [getData, setData] = useState(null);
     const [getCreateData, setCreateData] = useState(null);
     const [getCreateDataError, setCreateDataError] = useState(null);
     const [getMessage, setMessage] = useState(false);
     const [isLoading, setIsLoading] = useState(false)
     const [getAllCategories, setAllCategories] = useState(null)
     const [listCategories, setListCategories] = useState([]);
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

    // Récupérer tous les promoCodes
    const getAllPromoCodesFetch = async () => {
            
        try{
            const response = await api.getPromoCodes();

            // setAllPromoCodes(response);
            console.log(response);

            if(response?.data?.promoCodes){
                setAllPromoCodes(response?.data?.promoCodes)
            }
        } catch(error){
            console.log(error);
        }
    } 

    const handleChangeDataSelect = async (value) => {
        setListCategories(value);
      
        const newCategories = value.map((obj) => obj.value);
        // console.log(newCategories);
        
        setCreateData((prev) => ({
          ...prev,
          categories: newCategories
        }));
      };   // Create Change Data
  

    // Init
    useEffect( () => {
        
        getAllPromoCodesFetch()
        getAllCategoriesFetch()
        
    }, []);

    // Create Modal
    const createModal = (id) => {

        if(createForm){
            setCreateForm(false)
        } else{
            setCreateForm(true)
        }
    }

    // Create Change Data
    const handleChangeData = async (e) => {
        e.preventDefault()

        let { id, value } = e.target

        if(id === 'expiration'){
            const limiteDateTime = DateTime.fromISO(value, { zone: 'Europe/Paris' });
            limiteDateTime.toJSDate()

            setCreateData((prev) => ({
                ...prev,
                expiration: limiteDateTime,
            }));
        } else{
            setCreateData((prev) => ({
                ...prev,
                code: id === 'code' ? value : prev?.code,
                reduction: id === 'reduction' ? value : prev?.reduction,
            }));
        }
    }

    // Create submit
    const handleCreate = async () => {

        setIsLoading(true); 

        try{
            const response = await api.createOnePromoCode(getCreateData);

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
                getAllPromoCodesFetch()
                
                setMessage(response?.data?.message)

                setTimeout(() => {
                    setMessage(false)
                }, 5000);

                if(response?.data?.createPromoCode){
                    setCreateForm(false)
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
            const response = await api.deleteOnePromoCode(id);

            setDeleteForm(false)

            if(response?.data?.message){
                setMessage(response?.data?.message)

                setTimeout(() => {
                    setMessage(false)
                }, 5000);

                if(response?.data?.deletePromoCode){
                    getAllPromoCodesFetch()
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
            header={<h2 className="font-semibold text-xl text-black leading-tight">PromoCodes</h2>}
        >
            <Head title="PromoCodes" />
            <Loading show={isLoading} />
            <div className="sm:px-6 lg:px-8">

                <div className='flex justify-between page-title'>

                    <h1 className='title'>Codes promos </h1>

                    <button type="button"  onClick={createModal} className='btn btn-white' >Ajouter +</button>
                </div>

                {getMessage && (
                    <div className="success-message">{getMessage}</div>
                )}
              

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg grid md:grid-cols-2 gap-3 p-4">
                    {allPromoCodes?.map((promoCode) => (
                        <div class="border border-[#888888] border-dashed p-3" key={promoCode.id}>
                            <p className='text-xl mb-2'>{promoCode.code}</p>

                            <p>ID : {promoCode.id}</p>
                            <p>Réduction : {promoCode.reduction} %</p>
                            <p>Expiration : <span>{DateTime.fromISO(promoCode.expiration).toFormat("dd/MM/yyyy")}</span></p>
                            <p className='flex justify-start'>
                                <Link href={"/promos-codes/" + promoCode.id} className="btn"><Icon icon="ph:eye" /></Link>
                                <button type="button"  onClick={() => { deleteConfirm(promoCode.id) }} ><Icon icon="solar:trash-bin-2-outline" /></button>
                            </p>
                        </div>
                    ))}
                {!allPromoCodes || allPromoCodes.length <= 0 &&  
                <div className="border border-[#888888] border-dashed p-5">
                   <p className="text-grey">Vous n'avez pas encore de promoCodes.</p>
                </div>
               }
                  
                </div>

                <Modal show={createForm} maxWidth={"2xl"} onClose={() => { setCreateForm(false) }}>
                    <h3 className='text-center font-bold mb-5'>Créer un nouveau code promo</h3>

                    <form className="p-6 text-gray-900 w-full form-without-media show">
                       
                       <div className='block gap-4 w-full'  style={{ maxHeight: "calc(100vh - 320px)", overflowY: "auto" }}>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-4'>
                                <label htmlFor="code" className='mb-2'>Code</label>
                                <input type="text" defaultValue={getCreateData?.code} name="code" id="code" onChange={handleChangeData}/>
                                <p className='error mt-2'>{getCreateDataError?.codeError}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-4'>
                                <label htmlFor="reduction" className='mb-2'>Réduction</label>
                                <input type="number" defaultValue={getCreateData?.reduction} name="reduction" id="reduction" onChange={handleChangeData}/>
                                <p className='error mt-2'>{getCreateDataError?.reductionError}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-4'>
                                <label htmlFor="expiration" className='mb-2'>Expiration</label>
                                <input type="date" defaultValue={getCreateData?.expiration} name="expiration" id="expiration" onChange={handleChangeData}/>
                                <p className='error mt-2'>{getCreateDataError?.expirationError}</p>
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
                       </div>
                   </form>

                    <div className='flex justify-center'>
                        <button type="button" className={`btn btn-red mr-4 btn-show show`} onClick={() => { handleCreate() }} >Ajouter</button>
                        <button type="button" className='btn btn-light' onClick={() => { setCreateForm(false); }}>Annuler</button>
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
