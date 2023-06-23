import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { LoadingGIF } from "../../medias"

export default function Loading({ children, show = false}) {

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <div
                id="loading"
                className="fixed bg-grey-200 flex justify-center items-center"
            >
                
                <img src={LoadingGIF} alt="Youvence" />
            </div>
        </Transition>
    );
}
