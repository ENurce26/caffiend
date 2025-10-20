import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider(props) {
    const { children } = props
    const [globalUser,setGlobalUser] = useState(null)
    const [globalData, setGlobalData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)



    const value = { globalUser, globalData, setGlobalData, isLoading, signUp, logIn, logOut,  }

    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logOut() {
        setGlobalUser(null)
        setGlobalData(null)
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("current user: ", user)
            setGlobalUser(user)
            //if theres no user, empty the user state and return from this listener
            if (!user) { return }

            //if there is a user, check if the user has data in the db , 
            // if they do then fetch said data and update the global state
            try {
                setIsLoading(true)
                //first we create a reference for the document (labelled json object)
                //then we get the doc and snapshot it to see if anythings there
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)

                let firebaseData = {}
                if (docSnap.exists()) {
                    
                    firebaseData = docSnap.data()
                    console.log("found user data", firebaseData)

                }
                setGlobalData(firebaseData)
            } catch(err) {
                console.log(err.message)
            } finally {
                setIsLoading(false)
            }


            
        })
        return unsubscribe
    }, [])

    function resetPassword() {
        return sendPasswordResetEmail(auth, email)
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}