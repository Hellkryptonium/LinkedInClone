import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import styles from './index.module.css';

import {
  getAllPost
} from '@/config/redux/action/postAction';

import {
  getConnectionRequests,
  getMyConnectionRequests,
  sendConnectionRequest,
} from '@/config/redux/action/authAction';

export default function ViewProfilePage({ userProfile }) {

  const router = useRouter();
  const dispatch = useDispatch();

  const postReducer = useSelector(
    (state) => state.postReducer
  );

  const authState = useSelector(
    (state) => state.auth
  );


  /*
   * ================================
   * CURRENT USER PROFILE
   * ================================
   */

  const currentUserId =
    userProfile?.userId?._id;


  /*
   * ================================
   * FIND CONNECTION
   * ================================
   */

  const currentConnection =
    authState.connections.find((connection) => {

      const userId =
        typeof connection.userId === 'object'
          ? connection.userId?._id
          : connection.userId;

      const connectionId =
        typeof connection.connectionId === 'object'
          ? connection.connectionId?._id
          : connection.connectionId;

      return (
        userId === currentUserId ||
        connectionId === currentUserId
      );

    }) ||

    authState.connectionRequest.find(
      (connection) => {

        const userId =
          typeof connection.userId === 'object'
            ? connection.userId?._id
            : connection.userId;

        const connectionId =
          typeof connection.connectionId === 'object'
            ? connection.connectionId?._id
            : connection.connectionId;

        return (
          userId === currentUserId ||
          connectionId === currentUserId
        );

      }
    );


  /*
   * ================================
   * FETCH DATA
   * ================================
   */

  useEffect(() => {

    const token =
      localStorage.getItem('token');

    dispatch(getAllPost());

    if (token) {

      dispatch(
        getConnectionRequests({
          token,
        })
      );

      dispatch(
        getMyConnectionRequests({
          token,
        })
      );

    }

  }, [dispatch]);


  /*
   * ================================
   * USER POSTS
   * ================================
   */

  const userPosts =
    postReducer.posts.filter(
      (post) =>
        post.userId?.username ===
        router.query.username
    );


  /*
   * ================================
   * EDUCATION
   * ================================
   */

  const education =
    userProfile?.education || [];


  /*
   * ================================
   * WORK HISTORY
   * ================================
   */

  const pastWork =
    userProfile?.pastWork || [];


  return (
    <UserLayout>

      <DashboardLayout>

        <div
          className={styles.container}
        >

          {/* ================================= */}
          {/* COVER */}
          {/* ================================= */}

          <div
            className={styles.backDropContainer}
            style={{
                backgroundImage: `url(${
                    BASE_URL
                }/${
                    userProfile.userId.banner ||
                    'default-banner.jpg'
                })`
            }}
        >

            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt="Profile"
            />

          </div>


          {/* ================================= */}
          {/* PROFILE DETAILS */}
          {/* ================================= */}

          <div
            className={
              styles.profileContainer__details
            }
          >

            {/* ================================= */}
            {/* LEFT SIDE */}
            {/* ================================= */}

            <div
              className={
                styles.profileInfo
              }
            >

              <div
                className={
                  styles.nameRow
                }
              >

                <h2>
                  {userProfile.userId.name}
                </h2>

                <p>
                  @
                  {userProfile.userId.username}
                </p>

              </div>


              {/* ================================= */}
              {/* CONNECTION + RESUME */}
              {/* ================================= */}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                }}
              >

                {!currentConnection ? (

                  <button
                    onClick={() => {

                      dispatch(
                        sendConnectionRequest({
                          token:
                            localStorage.getItem(
                              'token'
                            ),

                          user_id:
                            userProfile.userId._id,
                        })
                      );

                    }}
                    className={
                      styles.connectBtn
                    }
                  >
                    Connect
                  </button>

                ) : (

                  <button
                    className={
                      styles.connectedButton
                    }
                  >

                    {
                      currentConnection
                        .status_accepted ===
                      null
                        ? 'Pending'
                        : currentConnection
                            .status_accepted ===
                          true
                        ? 'Connected'
                        : 'Rejected'
                    }

                  </button>

                )}


                {/* ================================= */}
                {/* DOWNLOAD RESUME */}
                {/* ================================= */}

                <div
                  onClick={async () => {

                    try {

                      const response =
                        await clientServer.get(
                          `/user/download_resume?id=${userProfile.userId._id}`
                        );

                      window.open(
                        `${BASE_URL}/${response.data.message}`,
                        '_blank'
                      );

                    } catch (error) {

                      console.error(
                        'Resume download failed:',
                        error
                      );

                    }

                  }}
                  style={{
                    cursor: 'pointer',
                  }}
                >

                  <svg
                    style={{
                      width: '1.2em',
                      paddingTop: '9px',
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />

                  </svg>

                </div>

              </div>


              {/* ================================= */}
              {/* BIO */}
              {/* ================================= */}

              <p
                className={styles.bio}
              >
                {userProfile.bio}
              </p>

            </div>


            {/* ================================= */}
            {/* RECENT ACTIVITY */}
            {/* ================================= */}

            <div
              className={
                styles.recentActivity
              }
            >

              <h3>
                Recent Activity
              </h3>


              {userPosts.map((post) => {

                return (

                  <div
                    key={post._id}
                    className={
                      styles.postCard
                    }
                  >

                    <div
                      className={
                        styles.card
                      }
                    >

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


          {/* ================================= */}
          {/* WORK HISTORY */}
          {/* ================================= */}

          <div
            className={
              styles.workHistory
            }
          >

            <h4>
              Work History
            </h4>

            <div
              className={
                styles.workHistoryContainer
              }
            >

              {pastWork.length === 0 ? (

                <p>
                  No work experience added.
                </p>

              ) : (

                pastWork.map(
                  (work, index) => {

                    return (

                      <div
                        key={index}
                        className={
                          styles.workHistoryCard
                        }
                      >

                        <p
                          style={{
                            fontWeight:
                              'bold',
                            display:
                              'flex',
                            alignItems:
                              'center',
                            gap:
                              '0.8rem',
                          }}
                        >
                          {work.company}
                          {' - '}
                          {work.position}
                        </p>

                        <p>
                          {work.years}
                        </p>

                      </div>

                    );

                  }
                )

              )}

            </div>

          </div>


          {/* ================================= */}
          {/* EDUCATION */}
          {/* ================================= */}

          <div
            className={
              styles.workHistory
            }
          >

            <h4>
              Education
            </h4>

            <div
              className={
                styles.workHistoryContainer
              }
            >

              {education.length === 0 ? (

                <p>
                  No education added.
                </p>

              ) : (

                education.map(
                  (educationItem, index) => {

                    return (

                      <div
                        key={index}
                        className={
                          styles.workHistoryCard
                        }
                      >

                        {/* SCHOOL */}

                        <p
                          style={{
                            fontWeight:
                              'bold',
                            display:
                              'flex',
                            alignItems:
                              'center',
                            gap:
                              '0.8rem',
                          }}
                        >
                          {
                            educationItem.school
                          }
                        </p>


                        {/* DEGREE */}

                        <p>
                          {
                            educationItem.degree
                          }

                          {' - '}

                          {
                            educationItem.fieldOfStudy
                          }
                        </p>

                      </div>

                    );

                  }
                )

              )}

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

export async function getServerSideProps(
  context
) {

  try {

    const request =
      await clientServer.get(
        '/user/get_profile_based_on_username',
        {
          params: {
            username:
              context.query.username,
          },
        }
      );

    return {
      props: {
        userProfile:
          request.data.profile,
      },
    };

  } catch (error) {

    console.error(
      'Failed to fetch profile:',
      error
    );

    return {
      notFound: true,
    };

  }
}
