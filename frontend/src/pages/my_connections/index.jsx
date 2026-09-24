import React, { useEffect } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';

import {
    useDispatch,
    useSelector
} from 'react-redux';

import {
    acceptConnection,
    getMyConnectionRequests,
    getConnectionRequests
} from '@/config/redux/action/authAction';

import styles from './index.module.css';

import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

export default function MyConnectionPage() {

    const dispatch = useDispatch();
    const router = useRouter();

    const authState = useSelector(
        (state) => state.auth
    );

    /*
     * Fetch both sides of the connection data
     */
    useEffect(() => {

        const token =
            localStorage.getItem('token');

        if (!token) return;

        dispatch(
            getMyConnectionRequests({
                token
            })
        );

        dispatch(
            getConnectionRequests({
                token
            })
        );

    }, [dispatch]);


    /*
     * Only requests that are actually pending
     */
    const pendingRequests =
        authState.connectionRequest.filter(
            (connection) =>
                connection.status_accepted === null
        );


    /*
     * Accepted connections from both sides
     */
    const acceptedConnections = [
        ...authState.connectionRequest,
        ...authState.connections
    ].filter(
        (connection) =>
            connection.status_accepted === true
    );


    return (
        <UserLayout>

            <DashboardLayout>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.7rem'
                    }}
                >

                    {/* ================= PENDING REQUESTS ================= */}

                    <h4>
                        My Connections
                    </h4>


                    {pendingRequests.length === 0 && (

                        <h1>
                            No Connection Request Pending
                        </h1>

                    )}


                    {pendingRequests.map(
                        (connection, index) => {

                            const user =
                                connection.userId;

                            return (

                                <div
                                    onClick={() => {
                                        router.push(
                                            `/view_profile/${user.username}`
                                        );
                                    }}
                                    className={
                                        styles.userCard
                                    }
                                    key={
                                        connection._id ||
                                        index
                                    }
                                >

                                    <div
                                        style={{
                                            display:
                                                'flex',
                                            alignItems:
                                                'center',
                                            gap:
                                                '1.2rem',
                                            justifyContent:
                                                'space-between'
                                        }}
                                    >

                                        {/* PROFILE PICTURE */}

                                        <div
                                            className={
                                                styles.profilePicture
                                            }
                                        >
                                            <img
                                                src={`${BASE_URL}/${user.profilePicture}`}
                                                alt=""
                                            />
                                        </div>


                                        {/* USER INFO */}

                                        <div
                                            className={
                                                styles.userInfo
                                            }
                                        >
                                            <h3>
                                                {
                                                    user.name
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    user.username
                                                }
                                            </p>
                                        </div>


                                        {/* ACCEPT */}

                                        <button
                                            onClick={(e) => {

                                                e.stopPropagation();

                                                dispatch(
                                                    acceptConnection(
                                                        {
                                                            connectionId:
                                                                connection._id,

                                                            token:
                                                                localStorage.getItem(
                                                                    'token'
                                                                ),

                                                            action:
                                                                'accept'
                                                        }
                                                    )
                                                );

                                            }}
                                            className={
                                                styles.connectedButton
                                            }
                                        >
                                            Accept
                                        </button>

                                    </div>

                                </div>

                            );
                        }
                    )}


                    {/* ================= MY NETWORK ================= */}

                    <h4>
                        My Network
                    </h4>


                    {acceptedConnections.length === 0 && (

                        <h1>
                            No Connections Yet
                        </h1>

                    )}


                    {acceptedConnections.map(
                        (connection, index) => {

                            /*
                             * Determine which side of the
                             * connection is the other user.
                             */

                            const otherUser =
                                connection.userId?._id ===
                                authState.user?._id
                                    ? connection.connectionId
                                    : connection.userId;


                            /*
                             * Safety check in case the
                             * populated user doesn't exist.
                             */

                            if (!otherUser) {
                                return null;
                            }


                            return (

                                <div
                                    onClick={() => {
                                        router.push(
                                            `/view_profile/${otherUser.username}`
                                        );
                                    }}
                                    className={
                                        styles.userCard
                                    }
                                    key={
                                        connection._id ||
                                        index
                                    }
                                >

                                    <div
                                        style={{
                                            display:
                                                'flex',
                                            alignItems:
                                                'center',
                                            gap:
                                                '1.2rem',
                                            justifyContent:
                                                'space-between'
                                        }}
                                    >

                                        {/* PROFILE PICTURE */}

                                        <div
                                            className={
                                                styles.profilePicture
                                            }
                                        >
                                            <img
                                                src={`${BASE_URL}/${otherUser.profilePicture}`}
                                                alt=""
                                            />
                                        </div>


                                        {/* USER INFO */}

                                        <div
                                            className={
                                                styles.userInfo
                                            }
                                        >

                                            <h3>
                                                {
                                                    otherUser.name
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    otherUser.username
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            </DashboardLayout>

        </UserLayout>
    );
}
