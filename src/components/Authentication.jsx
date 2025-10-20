import { useState } from "react"
import { useAuth } from "../Context/authContext"
export default function Authentication(props) {
    const {handleCloseModal} = props
    const [isRegistration, setIsRegistration] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [error, setError] = useState(null)

    const {signUp, logIn} = useAuth()


    async function handleAuthenticate() {
        if (!email || !email.includes('@') || !password || password.length < 6 || isAuthenticating) 
            { return }
        try {
            setIsAuthenticating(true)
            setError(null)
            if (isRegistration) {
            //register a user
                await signUp(email,password)
            } else {
            // login a user
                await logIn(email, password)
            }
            handleCloseModal()
        } catch (err) {
            console.log(err.message)
            setError(err.message)
        } finally {
            setIsAuthenticating(false)
        }
        

    }
    return (
        <>
            <h2 className="sign-up-text">{isRegistration ? "Sign Up" : "Login"}</h2>
            <p>
                {isRegistration ? "Create an account" : "Sign into your account!"}
            </p>
            {error && (
                <p> ERROR: {error}</p>
            )}
            <input value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder="Email"/>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password"/>
            <button onClick={handleAuthenticate}><p>{isAuthenticating ? "Authenticating..." : "Submit"}</p></button>
            <hr />
            <div className="register-content">
                <p>{isRegistration ? "Already have an account?" : "Don\'t have an account?" }</p>
                <button onClick={()=>{setIsRegistration(!isRegistration)}}><p>{isRegistration ? "Sign In" : "Sign Up"}</p></button>
            </div>

        </>
    )
}