import { getAboutUser } from '@/config/redux/action/authAction';
import { getAllPost } from '@/config/redux/action/postAction';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

export default function Dashboard() {
    const router = useRouter();
    const dispatch = useDispatch();

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
        <div>Dashboard</div>
    );
}