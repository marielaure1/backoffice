import { Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { logoBlack } from "../../medias"
import { useState, useEffect } from 'react';

export default function SideBar({ className = "", activeLink = "" }) {

    const [getActiveLink, setActiveLink] = useState("users")

    useEffect(() => {
        if (activeLink) {
            setActiveLink(activeLink)
        }
    })
    // bg-blue-950

    return (
        <div className={ 'w-[200px] h-full bg-white min-h-screen fixed p-4  z-[10] ' + className } id="side-bar">
            <div className='flex justify-center align-middle p-6'>
                <img src={logoBlack} alt="" className='w-24'/>
            </div>
            <div className='w-full'>
                <Link href="/" className={ `widget ${getActiveLink == "dashboard" ? "active" : ""}` }>
                    {/* <Icon icon="la:home-solid" /> */}
                    <p>Dashboard</p>
                </Link>
                <Link href="/users" className={ `widget ${getActiveLink == "users" ? "active" : ""}` }>
                    {/* <Icon icon="la:user-solid" /> */}
                    <p>Utilisateurs</p>
                </Link>
                <Link href="/products" className={ `widget ${getActiveLink == "products" ? "active" : ""}`}>
                    {/* <Icon icon="la:user-solid" /> */}
                    <p>Produits</p>
                </Link>
                <Link href="/articles" className={ `widget ${getActiveLink == "posts" ? "active" : ""}`}>
                    {/* <Icon icon="la:user-solid" /> */}
                    <p>Articles</p>
                </Link>
                <Link href="/plans" className={ `widget ${getActiveLink == "plans" ? "active" : ""}`}>
                    {/* <Icon icon="la:user-solid" /> */}
                    <p>Plans</p>
                </Link>
                <Link href="/medias" className={ `widget ${getActiveLink == "medias" ? "active" : ""}`}>
                    {/* <Icon icon="la:user-solid" /> */}
                    <p>Medias</p>
                </Link>
                <Link href="/abonnements" className={ `widget ${getActiveLink == "subscriptions" ? "active" : ""}`}>
                    {/* <Icon icon="la:user-solid" /> */}
                    <p>Abonnées</p>
                </Link>
                <Link href="/collections" className={ `widget ${getActiveLink == "collections" ? "active" : ""}`}>
                    {/* <Icon icon="la:user-solid" /> */}
                    <p>Collections</p>
                </Link>
                <Link href="/categories" className={ `widget ${getActiveLink == "collections" ? "active" : ""}`}>
                    {/* <Icon icon="la:user-solid" /> */}
                    <p>Catégories</p>
                </Link>
                <Link href="/promos-codes" className={ `widget ${getActiveLink == "promos-code" ? "active" : ""}`}>
                    {/* <Icon icon="la:user-solid" /> */}
                    <p>Codes promos</p>
                </Link>
                <Link href="/commandes" className={ `widget ${getActiveLink == "orders" ? "active" : ""}`}>
                    {/* <Icon icon="la:user-solid" /> */}
                    <p>Commandes</p>
                </Link>
                <Link href="/orders" className={ `widget ${getActiveLink == "orders" ? "active" : ""}`}>
                    {/* <Icon icon="la:user-solid" /> */}
                    <p>Ventes</p>
                </Link>
            </div>
        </div>
    );
}
