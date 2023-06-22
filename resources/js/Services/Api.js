import axios from 'axios';
import store from '../Stores/store';

// const token = store.getState().token
const token = localStorage.getItem("token")

console.log(token);
const URL = "http://localhost:3001/api"

const users = axios.create({
  baseURL: `${URL}/users`
});

console.log(users);

export default {
  // Users
  getAllUsers : async () => users.get(``, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
  getOneUser : async (id) => users.get(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
  createOneUser : async (data) => users.post(``, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
  updateOneUser : async (data, id) => users.put(`/${id}`, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
  updateOneUserPassword : async (data, id) => users.put(`/${id}/password`, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
  deleteOneUser : async (id) => users.delete(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
  
   // Plans
   getPlansUsers : async () => plans.get(``, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   getOnePlan : async (id) => plans.get(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   createOnePlan : async (data) => plans.post(``, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   updateOnePlan : async (data, id) => plans.put(`/${id}`, data, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,
   deleteOnePlan : async (id) => plans.delete(`/${id}`, { headers: { Authorization: `Bearer ${token}`}}).then((r) => r ).catch((error) => error.response) ,



   
}