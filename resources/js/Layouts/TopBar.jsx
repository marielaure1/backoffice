import { Link, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { logoWhite } from "../../medias"
import { useState, useEffect } from 'react';

export default function TopBar({ className = "",  me }) {

    return (
        <div className={ 'w-full h-[70px] bg-white fixed p-4 top-0 right-0 shadow-sm z-[9] pl-[250px] ' + className }  id="top-bar">
            {me.auth_first_name}
            
            <Link href={route('profile.edit')}>Profile</Link>
            <Link href="/logout" method="post" as="button">
                Log Out
            </Link>
        </div>
    );
}
