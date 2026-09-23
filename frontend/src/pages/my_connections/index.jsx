import React, { useEffect } from 'react'
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useDispatch, useSelector } from 'react-redux';
import { acceptConnection, getMyConnectionRequests, getConnectionRequests } from '@/config/redux/action/authAction';
import styles from "./index.module.css";
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

export default function MyConnectionPage() {

  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);

 useEffect(() => {
  const token = localStorage.getItem("token");

  dispatch(getMyConnectionRequests({ token }));
  dispatch(getConnectionRequests({ token }));
}, [dispatch]);

  useEffect(() => {

    if(authState.connectionRequest.length != 0) {
      console.log(authState.connectionRequest);
    }

  }, [authState.connectionRequest])


  return (
    <UserLayout>
          
        <DashboardLayout>
          <div style={{display: "flex", flexDirection: "column", gap: "1.7rem"}}>
            <h4>My Connections</h4>

            {authState.connectionRequest.length === 0 && <h1>No Connection Request Pending</h1>}

            {authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection) => connection.status_accepted === null).map((user, index) => {
              return (
                <div onClick={() => {
                  router.push(`/view_profile/${user.userId.username}`)
                }}
                 className={styles.userCard} key={index}>
                  <div style={{display: "flex", alignItems: "center", gap: "1.2rem", justifyContent: "space-between"}}>
                    <div className={styles.profilePicture}>
                      <img src={`${BASE_URL}/${user.userId.profilePicture}`}></img>
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>{user.userId.username}</p>
                    </div>
                    <button onClick={(e) => {
                      e.stopPropagation();

                      dispatch(acceptConnection({
                        connectionId: user._id,
                        token: localStorage.getItem("token"),
                        action: "accept"
                      }))
                    }} className={styles.connectedButton}>Accept</button>
                  </div>
                </div>
              )
            })}

            <h4>My Network</h4>

              {[
                ...authState.connectionRequest,
                ...authState.connections
              ]
                .filter((connection) => connection.status_accepted === true)
                .map((connection, index) => {

                  const otherUser =
                    connection.userId?._id === authState.user?._id
                      ? connection.connectionId
                      : connection.userId;

                  return (
                    <div
                      onClick={() => {
                        router.push(
                          `/view_profile/${otherUser.username}`
                        );
                      }}
                      className={styles.userCard}
                      key={connection._id}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1.2rem",
                          justifyContent: "space-between"
                        }}
                      >
                        <div className={styles.profilePicture}>
                          <img
                            src={`${BASE_URL}/${otherUser.profilePicture}`}
                            alt=""
                          />
                        </div>

                        <div className={styles.userInfo}>
                          <h3>{otherUser.name}</h3>
                          <p>{otherUser.username}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}




          </div>
        </DashboardLayout>

      </UserLayout>
  )
}

