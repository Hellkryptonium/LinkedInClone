import { getAboutUser, getAllUser } from '@/config/redux/action/authAction';
import { getAllPost } from '@/config/redux/action/postAction';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';


export default function Discoverpage() {

    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        if(!authState.all_profiles_fetched) {
            dispatch(getAllUser());
        }
    }, [authState.all_profiles_fetched, dispatch])


  return (
    <UserLayout>

        
          
        <DashboardLayout>
          <div>
            <h1>Discover</h1>
          </div>
        </DashboardLayout>

      </UserLayout>
  )
}

