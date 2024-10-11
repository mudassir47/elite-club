import React, { useEffect, useState } from "react";
import Link from "next/link";
import { auth, provider } from "../../../lib/firebaseConfig"; // Adjust the import path as necessary
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database"; // Import Realtime Database functions

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

const navigation: NavigationItem[] = [
  { name: 'Home', href: '/', current: true },
  { name: 'About', href: '/about', current: false },
  { name: 'Teams', href: '/team', current: false },
  { name: 'Certificate', href: '/verifyCertificate', current: false },
  { name: 'Gallery', href: '/gallery', current: false }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Data = () => {
  const db = getDatabase(); // Initialize Realtime Database
  const [user, setUser] = useState<any>(null); // Track user state

  // Monitor user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // User is signed in
      } else {
        setUser(null); // No user is signed in
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Function to handle sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Reference to the Firebase Realtime Database
      const userRef = ref(db, 'users/' + user.uid);

      // Check if user already exists in Realtime Database
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        // User does not exist, create and save user data
        await set(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          profilePicture: user.photoURL,
        });
        console.log('User data saved to Realtime Database.');
      } else {
        console.log('User already exists in Realtime Database:', user);
      }
    } catch (error) {
      console.error('Error during sign in/sign up:', error);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="rounded-md max-w-sm w-full mx-auto">
      <div className="flex-1 space-y-4 py-1">
        <div className="sm:block">
          <div className="space-y-1 px-5 pt-2 pb-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current ? 'text-black hover:opacity-100' : 'hover:text-black hover:opacity-100',
                  'px-2 py-1 text-lg font-normal opacity-75 block'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4"></div>

            {/* Conditionally render Sign In/Sign Up or Log Out/Profile buttons */}
            {user ? (
              <>
  
              <div className="flex flex-col space-y-2">
              <Link 
    href="/profile" 
    className="bg-lightblue w-full text-center hover:bg-blue hover:text-white text-blue font-medium py-2 px-4 rounded transition duration-300 ease-in-out"
  >
    Profile
  </Link>
  <button
    onClick={handleLogout}
    className="bg-red-600 w-full text-bg-blue border border-red-700 font-medium py-2 px-4 rounded hover:bg-red-700 transition duration-300 ease-in-out"
  >
    Log Out
  </button>
  
</div>

              </>
            ) : (
              <>
                <button
                  onClick={handleGoogleSignIn}
                  className="bg-white w-full text-blue border border-lightblue font-medium py-2 px-4 rounded"
                >
                  Sign In
                </button>
                <button
                  onClick={handleGoogleSignIn}
                  className="bg-lightblue w-full hover:bg-blue hover:text-white text-blue font-medium my-2 py-2 px-4 rounded"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data;
