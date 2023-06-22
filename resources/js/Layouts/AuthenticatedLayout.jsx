import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import SideBar from '@/Layouts/SideBar';
import TopBar from '@/Layouts/TopBar';
import { Link, usePage  } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { logoWhite } from "../../medias"
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { loginSuccess } from '../Stores/store';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { me } = usePage().props
    const { token } = usePage().props
    const { url } = usePage().props;
    const [getActiveLink, setActiveLink] = useState("users")
    const dispatch = useDispatch()

    useEffect(() => {

        console.log(token);
        dispatch(loginSuccess(token))
    }, [])
    

    return (
        <div className="min-h-screen bg-gray-100 flex two-column">

           <SideBar />
            <div className='ml-[250px] py-[70px] relative w-full bg-gray-100' id="main-content">
                <TopBar me={me} />
              
                <TransitionGroup className="transition-group">
                <CSSTransition
                    key={url}
                    timeout={{ enter: 300, exit: 300 }}
                    classNames="slide-right"
                    mountOnEnter={false}
                    unmountOnExit={true}
                >
                    <main className="p-[40px] w-full">{children}</main>
                </CSSTransition>
                </TransitionGroup>

                <footer className='w-full h-[70px] bg-white p-[20px] absolute bottom-0 box-border '>
                    <p>© Copyright 2023 - Youvence by Marie-Laure Edjour</p>
                </footer>
            </div>
      
            
        </div>
    );
}
