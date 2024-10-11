import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import { auth, provider } from "../../../lib/firebaseConfig"; // Adjust this path to your Firebase config
import { signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database"; // Firebase Realtime Database

const Signin = () => {
    let [isOpen, setIsOpen] = useState(false);

    const closeModal = () => {
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const handleGoogleSignIn = async () => {
        try {
            // Sign in with Google
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Reference to the Firebase Realtime Database
            const db = getDatabase();
            const userRef = ref(db, 'users/' + user.uid);

            // Check if user exists in the database
            const snapshot = await get(userRef);
            if (!snapshot.exists()) {
                // Save user data only if it doesn't exist
                await set(userRef, {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    profilePicture: user.photoURL,
                });
                console.log("New user data saved to Realtime Database:", user);
            } else {
                console.log("User already exists in Realtime Database:", user);
            }

            closeModal();
        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    };

    // Optional: Automatically open the modal if user is already logged in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, close the modal
                closeModal();
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:pr-0">
                <div className='hidden lg:block'>
                    <button type="button" className='text-lg text-blue font-medium' onClick={openModal}>
                        Sign In
                    </button>
                </div>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="w-full max-w-md space-y-8">
                                        <div>
                                            <img
                                                className="mx-auto h-12 w-auto"
                                                src="/assets/logo/logo.png"
                                                alt="Company"
                                            />
                                            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                                                Sign in with Google
                                            </h2>
                                        </div>
                                        <div>
                                            <button
                                                onClick={handleGoogleSignIn}
                                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                                                </span>
                                                Sign in with Google
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default Signin;
