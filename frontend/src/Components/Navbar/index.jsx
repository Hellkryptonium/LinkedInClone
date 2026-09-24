import React from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux';
import { reset } from "@/config/redux/reducer/authReducer";

function NavBarComponent() {

    const router = useRouter();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth)

  return (


    <div className = {styles.container}>
        <nav className={styles.navBar}>

            <h1 style={{cursor: "pointer"}} onClick={ () => {
                router.push("/")
            }}>Pro Connect</h1>
                
            <div className={styles.navBarOptionContainer}>

                
                {authState.profileFetched && <div>
                    
                    <div onClick={() => {
                        router.push("/profile");
                    }} style={{display: "flex", gap: "1.2rem", cursor: "pointer"}}>
                        <p>Hey , {authState.user.userId.name}</p>
                        <p style={{fontWeight: "bold", cursor: "pointer"}}>Profile</p>

                        <p onClick={() => {
                            localStorage.removeItem("token");
                            dispatch(reset());
                            router.push("/login");
                        }} style={{fontWeight: "bold", cursor: "pointer"}}>Logout</p>

                    </div>

                </div>}


                {!authState.profileFetched && <div onClick={ () => {
                        router.push("/login")
                    }} className={styles.buttonJoin}>

                    <p>Be a part</p>
                </div>}
                

                
            </div>
            
        </nav>
    </div>
  )
}

export default NavBarComponent