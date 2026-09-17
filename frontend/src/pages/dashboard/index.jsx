import { getAboutUser } from '@/config/redux/action/authAction';
import { getAllPost } from '@/config/redux/action/postAction';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

export default function Dashboard() {
    const router = useRouter();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
            return;
        }

        dispatch(getAllPost());
        dispatch(getAboutUser({token: localStorage.getItem('token')}));
    }, [router, dispatch]);

    return (
      <UserLayout>
          
        <DashboardLayout>
          <div>
            <h1>Dashboard</h1>
          </div>
        </DashboardLayout>

      </UserLayout>
    );
}