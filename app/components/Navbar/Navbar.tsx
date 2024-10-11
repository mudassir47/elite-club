import { Disclosure } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Drawer from "./Drawer";
import Drawerdata from "./Drawerdata";
import Signdialog from "./Signdialog";
import Registerdialog from "./Registerdialog";
import Image from 'next/image';
import { auth } from "../../../lib/firebaseConfig"; 
import { onAuthStateChanged, signOut, User } from "firebase/auth"; 

interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
}

const navigation: NavigationItem[] = [
    { name: 'Home', href: '/', current: true },
    { name: 'About', href: '/about', current: false },
    { name: 'Team', href: '/team', current: false },
    { name: 'Certificate', href: '/verifyCertificate', current: false },
    { name: 'Gallery', href: '/gallery', current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null); 

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("Logged out successfully!");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <Disclosure as="nav" className="navbar">
            <div className="mx-auto max-w-7xl px-6 lg:py-4 lg:px-8">
                <div className="relative flex h-20 items-center justify-between">
                    <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">
                        {/* LOGO */}
                        <div className="flex flex-shrink-0 items-center">
                            <div className="block lg:hidden">
                                <Image
                                    src="/assets/logo/logo.png"
                                    alt="Elit"
                                    width={130}
                                    height={38}
                                />
                            </div>
                            <div className="hidden lg:block">
                                <Image
                                    src="/assets/logo/logo.png"
                                    alt="Elit"
                                    width={120}
                                    height={41}
                                />
                            </div>
                        </div>

                        {/* LINKS */}
                        <div className="hidden lg:block m-auto">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={classNames(
                                            item.current ? 'text-black hover:opacity-100' : 'hover:text-black hover:opacity-100',
                                            'px-3 py-4 text-lg font-normal opacity-75 space-links'
                                        )}
                                        aria-current={item.href ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* USER ACTIONS */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="px-3 py-4 text-lg font-normal opacity-75 hover:text-black"
                                >
                                    Profile
                                </Link>
                                <button
                                    className="px-3 py-4 text-lg font-normal opacity-75 hover:text-black"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Signdialog />
                                <Registerdialog />
                            </>
                        )}
                    </div>

                    {/* DRAWER FOR MOBILE VIEW */}
                    <div className='block lg:hidden'>
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" onClick={() => setIsOpen(true)} />
                    </div>

                    {/* DRAWER LINKS DATA */}
                    <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
                        <Drawerdata />
                    </Drawer>
                </div>
            </div>
        </Disclosure>
    );
};

export default Navbar;
