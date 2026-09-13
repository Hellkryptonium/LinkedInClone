import UserLayout from '@/layout/UserLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from "./style.module.css"

function LoginComponent() {

  const authState = useSelector((state) => state.auth);

  const router = useRouter();

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  useEffect(() => {
      if(authState.loggedIn) {
        router.push("/dashboard");
      }
  })

  const handleRegister = () => {
    
  }

  return (
    <UserLayout>
     
      <div className={styles.container}>

        <div className={styles.cardContainer}>

            <div className={styles.cardContainer__left}>

              <p className={styles.cardleft_heading}> {userLoginMethod ? "Sign In" : "Sign Up"}</p>

                <div className={styles.inputContainers}>

                  <div className={styles.inputRow}>

                    <input className={styles.inputField} type="text" placeholder='Username'/>
                    <input className={styles.inputField} type="text" placeholder='Name'/>

                  </div>

                    <input className={styles.inputField} type="text" placeholder='Email'/>

                    <input className={styles.inputField} type="text" placeholder='Password'/>

                    <div className={styles.buttonWithOutline}>
                      {userLoginMethod ? "Sign In" : "Sign Up"}
                    </div>

                </div>


            </div>

            <div className={styles.cardContainer__right}>

            </div>

        </div>

      </div>


    </UserLayout>
  )
}

export default LoginComponent