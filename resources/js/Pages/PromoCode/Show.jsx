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
import Select from 'react-select';

export default function Show({ auth, id }) {
    const [getData, setData] = useState(null);
    const [getUpdateData, setUpdateData] = useState(null);
    const [getUpdateDataError, setUpdateDataError] = useState(null);
    const [formActive, setFormActive] = useState("");
    const [deleteForm, setDeleteForm] = useState(false);
    const [createForm, setCreateForm] = useState(false);
    const [getMessage, setMessage] = useState(false);
    const [getSuccess, setSuccess] = useState(false);
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

    const { url } = usePage();

    const handleOpenModal = () => {
        setCreateForm(true);
      };

    const goBack = () => {
        window.history.back();
    };

    const getOnePromoCodeFetch = async () => {
            
        try{

            
            const response = await api.getOnePromoCode(id);

            if(response?.data?.showPromoCode){
                setData(response?.data?.showPromoCode)
                setUpdateData(response?.data?.showPromoCode)
            }

            setMessage("")
        } catch(error){
            setMessage(error)
        }
    } 

    useEffect( () => {
        getOnePromoCodeFetch()
        getAllCategoriesFetch()
        
    }, []); 

    const openForm = (el) => {
        setFormActive(el)
    }

    const handleChangeData = (e) => {
        let { id, value } = e.target

            setUpdateData((prev) => ({
                ...prev,
                code: id === 'code' ? value : prev?.code,
                reduction: id === 'reduction' ? value : prev?.reduction,
            }));

       
    }

    const handleChangeDataSelect = async (value) => {
        setListCategories(value);
      
        const newCategories = value.map((obj) => obj.value);
        // console.log(newCategories);
        
        setUpdateData((prev) => ({
          ...prev,
          categories: newCategories
        }));
      };   // Create Change Data
  

    const handleSubmitData = async (e) => {
        e.preventDefault()
        
        try{
            const response = await api.updateOnePromoCode(getUpdateData, id);

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

                if(response?.data?.updatePromoCode){
                    setData(response?.data?.updatePromoCode)
                    setUpdateData(response?.data?.updatePromoCode)
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
            const response = await api.deleteOnePromoCode(id);

            console.log(response);
        

            if(response?.data?.message){
                setMessage(response?.data?.message)

                if(response?.data?.deletePromoCode){
                    router.get('/promos-codes')
                }
            }

        } catch(error){
            console.log(error);
            setMessage(error)
        }
    };

    return (
        <AuthenticatedLayout
            promoCode={auth.promoCode}
            header={<h2 className="font-semibold text-xl text-black leading-tight">PromoCodes</h2>}
        >
            <Head title="PromoCodes" />
            <div className="sm:px-6 lg:px-8">
                <div className='flex items-center page-title'>
                    <Link href="/promos-codes" className='go-back'>
                        <Icon icon="ph:arrow-circle-left-light" />
                    </Link>

                    <h1 className='title'>{getData?.code}</h1>
                    
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
                       
                        <p>Réduction : {getData?.reduction} %</p>
                        <p>Expiration : <span>{DateTime.fromISO(getData?.expiration).toFormat("dd/MM/yyyy")}</span></p>
                        <div className='flex flex-wrap'>
                        <p className='mb-2 mr-2'>Catégories :</p>
                            {getData?.categories?.map(categorie => (
                                <span className={`badge badge-categorie mr-2`}>{categorie.name}</span>
                            ))}
                            {!getData?.categories && <span className={`badge badge-red mr-2`}>Aucun</span>}
                        </div>
                        <p>Créée <span>{DateTime.fromISO(getData?.created_at).toRelative()}  ({ DateTime.fromISO(getData?.created_at).toFormat('f')})</span></p>
                    </div>
                    

                    <form className={`p-6 text-gray-900 w-full block-content ${formActive == "infos-form" ? "active" : ""}`}>
                       
                       <div className='gap-4 w-full'>
                            <h2 className="flex items-center font-semibold col-span-2 lg:mb-0 mb-2">Détails <button type="button" className='ml-4' onClick={() => openForm("infos")}><Icon icon="system-uicons:cross" /></button></h2>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-4'>
                                <label htmlFor="code" className='mb-2'>Code</label>
                                <input type="text" defaultValue={getUpdateData?.code} name="code" id="code" onChange={handleChangeData}/>
                                <p className='error mt-2'>{getUpdateDataError?.codeError}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-4'>
                                <label htmlFor="reduction" className='mb-2'>Réduction</label>
                                <input type="number" defaultValue={getUpdateData?.reduction} name="reduction" id="reduction" onChange={handleChangeData}/>
                                <p className='error mt-2'>{getUpdateDataError?.reductionError}</p>
                            </div>
                            <div className='col-span-1 flex flex-col lg:mb-0 mb-4'>
                                <label htmlFor="expiration" className='mb-2'>Expiration</label>
                                <input type="date" defaultValue={getUpdateData?.expiration} name="expiration" id="expiration" onChange={handleChangeData}/>
                                <p className='error mt-2'>{getUpdateDataError?.expirationError}</p>
                            </div>

                            <div className='col-span-1 flex flex-col lg:mb-0 mb-2'>
                                <label htmlFor="categories" className='mb-2'>Catégorie</label>
                                <Select
                                    name="categories"
                                    id="categories"
                                    defaultValue={getUpdateData?.categories}
                                    onChange={handleChangeDataSelect}
                                    options={getAllCategories?.map((categorie) => ({
                                        value: categorie?.id,
                                        label: categorie?.name
                                    }))}
                                    isMulti
                                    />

                                <p className='error mt-2'>{getUpdateDataError?.categoriesError}</p>
                            </div>
                            
                            <div className='col-span-2 flex justify-end pt-2'>
                                <button type="submit" className='btn btn-purple mb-2' id="form-promoCodes" onClick={handleSubmitData}>Valider</button>
                            </div>
                       </div>
                   </form>
                </div>

                <button className='btn btn-red-line' onClick={deleteConfirm}>Supprimer le promoCode</button>

                <Modal show={deleteForm} maxWidth="lg" onClose={() => { setDeleteForm(false) }}>
                    <h3 className='text-center font-bold mb-5'>Êtes-vous sûr de vouloir supprimer cette promoCode ?</h3>

                    <div className='flex justify-center'>
                        <button type="button" className='btn btn-red mr-4' onClick={() => { handleDelete(getData?.id) }} >Supprimer</button>
                        <button type="button" className='btn btn-light' onClick={() => { setDeleteForm(false) }}>Annuler</button>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
