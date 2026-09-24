import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import styles from './index.module.css';

import { getAllPost } from '@/config/redux/action/postAction';
import {
    getAboutUser,
  getConnectionRequests,
  getMyConnectionRequests,
  sendConnectionRequest,
} from '@/config/redux/action/authAction';


export default function ProfilePage() {

    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.postReducer);

    const dispatch = useDispatch();

    const userProfile = authState.user;
    


    useEffect(() => {
        dispatch(getAboutUser({token: localStorage.getItem("token")}));
        dispatch(getAllPost())
    }, [dispatch])

    const userPosts = authState.user
    ? postReducer.posts.filter(
        (post) =>
            post.userId?.username === authState.user.userId?.username
      )
    : [];


    const updateProfilePicture = async (file) => {

        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("token", localStorage.getItem("token"));

        const response = await clientServer.post("/upload_profile_picture", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        dispatch(getAboutUser({token: localStorage.getItem("token")}));
    }

    const updateProfileData = async () => {
        const request = await clientServer.post("/user_update", {
            token: localStorage.getItem("token"),
            name: userProfile.userId.name,
        })

        const response = await clientServer.post("/update_profile_data", {
            token: localStorage.getItem("token"),
            bio: userProfile.bio,
            currentPost: userProfile.currentPost,
            pastWork: userProfile.pastWork,
            education: userProfile.education
        });

        dispatch(getAboutUser({token: localStorage.getItem("token")}));
    }


  return (
    <UserLayout>
        <DashboardLayout>
            { authState.user && userProfile.userId &&
                <div className={styles.container}>

            {/* ================= COVER ================= */}

            <div className={styles.backDropContainer}>

                <label htmlFor='profilePictureUpload' className={styles.backDrop__overlay}> 
                    <p> 
                        Edit 
                    </p> 
                </label>
                <input onChange={(e) => {
                    updateProfilePicture(e.target.files[0])
                }} hidden type="file" id="profilePictureUpload"></input>

                <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="Profile" />
                        

            </div>


            {/* ================= PROFILE DETAILS ================= */}

            <div className={styles.profileContainer__details}>


                {/* LEFT SIDE */}

                <div className={styles.profileInfo}>

                <div className={styles.nameRow}>

                    <div style={{display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem"}}>
                        <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onchange={(e) => {
                            //setUserProfile{{...userProfile, userId: {...userProfile.userId, name: e.target.value}}}
                        }}></input> 
                        <p style={{color: "grey"}}>@{userProfile.userId.username}</p>
                    </div>

                </div>

                <div>
                    <textarea value = {userProfile.bio}
                        onChange={(e) => {
                            setUserProfile({...userProfile, bio: e.target.value})
                        }}
                        rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                        style={{width: "100%"}}
                    >

                    </textarea>
                </div>

                </div>


                {/* RIGHT SIDE - RECENT ACTIVITY */}

                <div className={styles.recentActivity}>

                <h3>
                    Recent Activity
                </h3>


                {userPosts.map((post) => {

                    return (

                    <div
                        key={post._id}
                        className={styles.postCard}
                    >

                        <div className={styles.card}>


                        {/* POST MEDIA */}

                        <div
                            className={
                            styles.card__profileContainer
                            }
                        >

                            {post.media !== '' ? (

                            <img
                                src={`${BASE_URL}/${post.media}`}
                                alt=""
                            />

                            ) : (

                            <div
                                style={{
                                width: '3.4rem',
                                height: '3.4rem',
                                }}
                            />

                            )}

                        </div>


                        {/* POST CONTENT */}

                        <p>
                            {post.body}
                        </p>

                        </div>

                    </div>

                    );

                })}

                </div>

            </div>

            <div className={styles.workHistory}>

                <h4>Work History</h4>

                <div className={styles.workHistoryContainer}>

                    {
                    userProfile.pastWork.map((work, index) => {
                        return (
                        <div key={index} className={styles.workHistoryCard}>
                            <p style={{fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem"}}>
                            {work.company} - {work.position}
                            </p>
                            <p>{work.years}</p>
                        </div>
                        )
                    })
                    }

                </div>

            </div>

            {userProfile != authState.user && 
                <div onClick={() => {
                    updateProfileData();
                }} className={styles.updateProfileButton}>
                    Update Profile
                </div>
            }

            </div>
        
            }

        </DashboardLayout>
    </UserLayout>
  )
}

