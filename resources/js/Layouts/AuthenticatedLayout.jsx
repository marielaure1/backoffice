import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { logoWhite } from "../../medias"


export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    user = {
        email: "edjour.marie@gmail.com",
        name: "Marie"
    }

    return (
        <div className="min-h-screen bg-gray-100 flex two-column">

            <div className='w-[250px] h-full bg-blue-950 min-h-screen fixed p-4' id="side-bar">
                <div className='flex justify-center align-middle p-6'>
                    <img src={logoWhite} alt="" className='w-24'/>
                </div>
                <div className='grid grid-cols-2 gap-3 w-full flex-wrap'>
                    <Link href="/users" class="widget">
                        <Icon icon="la:user-solid" />
                        <p>Utilisateurs</p>
                    </Link>
                    <Link href="/users" class="widget">
                        <Icon icon="la:user-solid" />
                        <p>Produits</p>
                    </Link>
                    <Link href="/users" class="widget">
                        <Icon icon="la:user-solid" />
                        <p>Articles</p>
                    </Link>
                    <Link href="/users" class="widget">
                        <Icon icon="la:user-solid" />
                        <p>Abonnées</p>
                    </Link>
                    <Link href="/users" class="widget">
                        <Icon icon="la:user-solid" />
                        <p>Collections</p>
                    </Link>
                    <Link href="/users" class="widget">
                        <Icon icon="la:user-solid" />
                        <p>Codes promos</p>
                    </Link>
                    <Link href="/users" class="widget">
                        <Icon icon="la:user-solid" />
                        <p>Ventes</p>
                    </Link>
                </div>
            </div>
            <div className='ml-[250px]'>
                <div id="top-bar" className='h-90'>
                    
                </div>
                <main className='bg-red-200'>{children}</main>
                <footer>
                    <p>Copyright</p>
                </footer>
            </div>
      
            
        </div>
    );
}
