import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import styles from './index.module.css';

import { getAllPost } from '@/config/redux/action/postAction';
import {
  getConnectionRequests,
  sendConnectionRequest,
} from '@/config/redux/action/authAction';

export default function ViewProfilePage({ userProfile }) {

  const router = useRouter();
  const dispatch = useDispatch();

  const postReducer = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);

  const isCurrentUserIsConnection = authState.connections.some(
    (user) => user.connectionId._id === userProfile.userId._id
  );

  const isConnectionNull =
    authState.connections.find(
      (user) =>
        user.connectionId?._id === userProfile?.userId?._id
    )?.status_accepted === null;

  /*
   * Get all posts and connection requests
   */
  useEffect(() => {
    dispatch(getAllPost());

    dispatch(
      getConnectionRequests({
        token: localStorage.getItem('token'),
      })
    );
  }, [dispatch]);



  /*
   * Get posts belonging to this user
   */
  const userPosts = postReducer.posts.filter((post) => {
    return post.userId?.username === router.query.username;
  });


  return (
    <UserLayout>

      <DashboardLayout>

        <div className={styles.container}>

          {/* ================= COVER ================= */}

          <div className={styles.backDropContainer}>

            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt="Profile"
            />

          </div>


          {/* ================= PROFILE DETAILS ================= */}

          <div className={styles.profileContainer__details}>


            {/* LEFT SIDE */}

            <div className={styles.profileInfo}>

              <div className={styles.nameRow}>

                <h2>
                  {userProfile.userId.name}
                </h2>

                <p>
                  @{userProfile.userId.username}
                </p>

              </div>


              {/* CONNECT BUTTON */}

              {isCurrentUserIsConnection ? (

                <button
                  className={styles.connectedButton}
                >
                  {isConnectionNull ? "Pending" : "Connected"}
                </button>

              ) : (

                <button
                  onClick={() => {

                    dispatch(
                      sendConnectionRequest({
                        token: localStorage.getItem('token'),

                        user_id: userProfile.userId._id,
                      })
                    );

                  }}
                  className={styles.connectBtn}
                >
                  Connect
                </button>

              )}


              {/* BIO */}

              <p className={styles.bio}>
                {userProfile.bio}
              </p>

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

        </div>

      </DashboardLayout>

    </UserLayout>
  );
}


/*
 * ================= SERVER SIDE PROPS =================
 */

export async function getServerSideProps(context) {

  console.log('from view');

  console.log(
    context.query.username
  );


  const request =
    await clientServer.get(
      '/user/get_profile_based_on_username',
      {
        params: {
          username: context.query.username,
        },
      }
    );


  console.log(
    request.data
  );


  return {
    props: {
      userProfile: request.data.profile,
    },
  };
}