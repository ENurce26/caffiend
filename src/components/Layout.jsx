import { useState } from "react"
import Authentication from "./Authentication"
import Modal from "./Modal"
import { useAuth } from "../Context/authContext"

export default function Layout(props) {
    const {children} = props
    const [showModal, setShowModal] = useState(false)
    const {globalUser, logOut} = useAuth()

    const header = 
    (<header>
        <div>
            <h1 className="text-gradient">
                CAFFIEND
            </h1>
            <p>for Coffee Instatiates</p>
        </div>
        {globalUser ? (<button onClick={()=>{
            logOut()
        }}>
            <p>Log Out</p>
            <i className="fa-solid fa-mug-hot"></i>
        </button>) : (<button onClick={()=>{
            setShowModal(true)
        }}>
            <p>Sign up free</p>
            <i className="fa-solid fa-mug-hot"></i>
        </button>)}
    </header>)

    const footer = 
    (<footer>
        <p>
            <span className="text-gradient">Caffiend</span> was made by <a href=''>Eriberto</a> <br></br> using the FantaCSS design library. <br></br>Check out the project on <a href="https://github.com/ENurce26/caffiend" target='_blank'>Github</a>!
        </p>
    </footer>)

    function handleCloseModal() {
        setShowModal(false)
    }


    return (
        <>
            {showModal && (<Modal handleCloseModal={handleCloseModal}>
                <Authentication handleCloseModal={handleCloseModal} />
            </Modal>)}
            {header}
            <main>
                {children}
            </main>
            {footer}
        </>
    )
}