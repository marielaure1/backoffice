import axios from 'axios';

// const token = store.getState().token
const token = localStorage.getItem("token")

const URL = import.meta.env.VITE_API_URL

const users = axios.create({ baseURL: `${URL}/users` });
const plans = axios.create({ baseURL: `${URL}/plans` });
const medias = axios.create({ baseURL: `${URL}/medias` });
const abonnements = axios.create({ baseURL: `${URL}/abonnements` });
const articles = axios.create({ baseURL: `${URL}/posts` });
const collections = axios.create({ baseURL: `${URL}/collections` });
const categories = axios.create({ baseURL: `${URL}/categories` });
const products = axios.create({ baseURL: `${URL}/products` });
const promocodes = axios.create({ baseURL: `${URL}/promo-code` });
const auth = axios.create({ baseURL: `${URL}/auth` });

export default {
  // Users
  getAllUsers : async () => users.get(``, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
  getOneUser : async (id) => users.get(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
  createOneUser : async (data) => users.post(``, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
  updateOneUser : async (data, id) => users.put(`/${id}`, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
  updateOneUserPassword : async (data, id) => users.put(`/${id}/password`, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
  deleteOneUser : async (id) => users.delete(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,

  // Auth
  resetPassword : async (data) => auth.post(`/reset-password`, data).then((r) => r ).catch((error) => error.response) ,
  resetPasswordToken : async (token) => auth.get(`/reset-password/${token}`).then((r) => r ).catch((error) => error.response) ,
  resetPasswordTokenPost : async (data, token) => auth.post(`/reset-password/${token}`, data).then((r) => r ).catch((error) => error.response) ,
  
   // Plans
   getPlans : async () => plans.get(``, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   getOnePlan : async (id) => plans.get(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   createOnePlan : async (data) => plans.post(``, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   updateOnePlan : async (data, id) => plans.put(`/${id}`, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   deleteOnePlan : async (id) => plans.delete(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,

   // Medias
   getMedias : async () => medias.get(``, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   createOneMedia : async (data) => medias.post(``, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   deleteOneMedia : async (id) => medias.delete(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,

   // Abonnements
   getAbonnements : async () => abonnements.get(``, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   getOneAbonnement : async (id) => abonnements.get(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   createOneAbonnement : async (data) => abonnements.post(``, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   updateOneAbonnement : async (data, id) => abonnements.put(`/${id}`, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   deleteOneAbonnement : async (id) => abonnements.delete(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,

   // Articles
   getArticles : async () => articles.get(``, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   getOneArticle : async (id) => articles.get(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   createOneArticle : async (data) => articles.post(``, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   updateOneArticle : async (data, id) => articles.put(`/${id}`, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   deleteOneArticle : async (id) => articles.delete(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   
   // Collections
   getCollections : async () => collections.get(``, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   getOneCollection : async (id) => collections.get(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   createOneCollection : async (data) => collections.post(``, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   updateOneCollection : async (data, id) => collections.put(`/${id}`, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   deleteOneCollection : async (id) => collections.delete(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   
   // Categories
   getCategories : async () => categories.get(``, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   getOneCategorie : async (id) => categories.get(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   createOneCategorie : async (data) => categories.post(``, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   updateOneCategorie : async (data, id) => categories.put(`/${id}`, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   deleteOneCategorie : async (id) => categories.delete(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   
   // Produits
   getProducts : async () => products.get(``, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   getOneProduct : async (id) => products.get(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   createOneProduct : async (data) => products.post(``, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   updateOneProduct : async (data, id) => products.put(`/${id}`, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   deleteOneProduct : async (id) => products.delete(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   
   // Codes promos
   getPromoCodes : async () => promocodes.get(``, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   getOnePromoCode : async (id) => promocodes.get(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   createOnePromoCode : async (data) => promocodes.post(``, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   updateOnePromoCode : async (data, id) => promocodes.put(`/${id}`, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   deleteOnePromoCode : async (id) => promocodes.delete(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,

   
}