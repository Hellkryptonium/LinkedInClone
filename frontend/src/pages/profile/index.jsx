import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './index.module.css';

import { getAllPost } from '@/config/redux/action/postAction';
import { getAboutUser } from '@/config/redux/action/authAction';

export default function ProfilePage() {
    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.postReducer);

    const dispatch = useDispatch();

    // Redux = server state
    const userProfile = authState.user;

    // Local edits
    const [editedName, setEditedName] = useState(null);
    const [editedBio, setEditedBio] = useState(null);
    const [editedPastWork, setEditedPastWork] = useState(null);
    const [editedEducation, setEditedEducation] = useState(null);

    // Which modal is open?
    const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
    const [isEducationModalOpen, setIsEducationModalOpen] =
        useState(false);

    // Work form
    const [workInputData, setWorkInputData] = useState({
        company: '',
        position: '',
        years: '',
    });

    // Education form
    const [educationInputData, setEducationInputData] =
        useState({
            school: '',
            degree: '',
            fieldOfStudy: '',
        });

    /*
     * Fetch profile and posts
     */
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            dispatch(getAboutUser({ token }));
        }

        dispatch(getAllPost());
    }, [dispatch]);

    /*
     * Values displayed by the UI.
     *
     * Redux value is used until the user edits that section.
     */
    const name =
        editedName ??
        userProfile?.userId?.name ??
        '';

    const bio =
        editedBio ??
        userProfile?.bio ??
        '';

    const pastWork =
        editedPastWork ??
        userProfile?.pastWork ??
        [];

    const education =
        editedEducation ??
        userProfile?.education ??
        [];

    /*
     * Posts belonging to current user
     */
    const userPosts = userProfile
        ? postReducer.posts.filter(
              (post) =>
                  post.userId?.username ===
                  userProfile.userId?.username
          )
        : [];

    /*
     * ============================
     * WORK INPUT
     * ============================
     */

    const handleWorkInputChange = (e) => {
        const { name, value } = e.target;

        setWorkInputData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /*
     * ============================
     * EDUCATION INPUT
     * ============================
     */

    const handleEducationInputChange = (e) => {
        const { name, value } = e.target;

        setEducationInputData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /*
     * ============================
     * ADD WORK
     * ============================
     */

    const addWork = () => {
        if (
            !workInputData.company ||
            !workInputData.position ||
            !workInputData.years
        ) {
            return;
        }

        setEditedPastWork([
            ...pastWork,
            workInputData,
        ]);

        setWorkInputData({
            company: '',
            position: '',
            years: '',
        });

        setIsWorkModalOpen(false);
    };

    /*
     * ============================
     * ADD EDUCATION
     * ============================
     */

    const addEducation = () => {
        if (
            !educationInputData.school ||
            !educationInputData.degree ||
            !educationInputData.fieldOfStudy
        ) {
            return;
        }

        setEditedEducation([
            ...education,
            educationInputData,
        ]);

        setEducationInputData({
            school: '',
            degree: '',
            fieldOfStudy: '',
        });

        setIsEducationModalOpen(false);
    };

    /*
     * ============================
     * PROFILE PICTURE
     * ============================
     */

    const updateProfilePicture = async (file) => {
        if (!file) return;

        try {
            const formData = new FormData();

            formData.append(
                'profile_picture',
                file
            );

            formData.append(
                'token',
                localStorage.getItem('token')
            );

            await clientServer.post(
                '/upload_profile_picture',
                formData,
                {
                    headers: {
                        'Content-Type':
                            'multipart/form-data',
                    },
                }
            );

            await dispatch(
                getAboutUser({
                    token: localStorage.getItem('token'),
                })
            );
        } catch (error) {
            console.error(
                'Profile picture update failed:',
                error
            );
        }
    };

    const updateBanner = async (file) => {
    if (!file) return;

    try {
        const formData = new FormData();

        formData.append('banner', file);

        formData.append(
            'token',
            localStorage.getItem('token')
        );

        await clientServer.post(
            '/upload_banner',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        await dispatch(
            getAboutUser({
                token: localStorage.getItem('token'),
            })
        );

    } catch (error) {
        console.error(
            'Banner update failed:',
            error
        );
    }
};

    /*
     * ============================
     * UPDATE PROFILE
     * ============================
     */

    const updateProfileData = async () => {
        if (!userProfile) return;

        try {
            const token =
                localStorage.getItem('token');

            /*
             * Update User document
             */
            await clientServer.post(
                '/user_update',
                {
                    token,
                    name,
                }
            );

            /*
             * Update Profile document
             */
            await clientServer.post(
                '/update_profile_data',
                {
                    token,

                    bio,

                    currentPost:
                        userProfile.currentPost,

                    pastWork,

                    education,

                    /*
                     * Keep existing education/work
                     * data synchronized.
                     */
                    // education is included above
                }
            );

            /*
             * Fetch fresh data
             */
            await dispatch(
                getAboutUser({ token })
            );

            /*
             * Clear local edits.
             *
             * Redux now contains the saved data.
             */
            setEditedName(null);
            setEditedBio(null);
            setEditedPastWork(null);
            setEditedEducation(null);

        } catch (error) {
            console.error(
                'Profile update failed:',
                error
            );
        }
    };

    /*
     * ============================
     * LOADING
     * ============================
     */

    if (
        !userProfile ||
        !userProfile.userId
    ) {
        return (
            <UserLayout>
                <DashboardLayout>
                    <div className={styles.container}>
                        <p>
                            Loading profile...
                        </p>
                    </div>
                </DashboardLayout>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <DashboardLayout>

                <div
                    className={
                        styles.container
                    }
                >

                    {/* ================= COVER ================= */}


                        <div
                            className={styles.backDropContainer}
                            style={{
                                backgroundImage: `url(${BASE_URL}/${userProfile.userId.banner || 'default-banner.jpg'})`,
                            }}
                        >

                            {/* Banner edit */}

                            <label
                                htmlFor="bannerUpload"
                                className={styles.bannerEdit}
                            >
                                <p>Edit Banner</p>
                            </label>

                            <input
                                onChange={(e) => {
                                    updateBanner(
                                        e.target.files?.[0]
                                    );
                                }}
                                hidden
                                type="file"
                                id="bannerUpload"
                                accept="image/*"
                            />


                            {/* Profile picture edit */}

                            <label
                                htmlFor="profilePictureUpload"
                                className={styles.backDrop__overlay}
                            >
                                <p>Edit</p>
                            </label>

                            <input
                                onChange={(e) => {
                                    updateProfilePicture(
                                        e.target.files?.[0]
                                    );
                                }}
                                hidden
                                type="file"
                                id="profilePictureUpload"
                                accept="image/*"
                            />

                            <img
                                className={styles.backDrop}
                                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                                alt="Profile"
                            />

                        </div>

                    {/* ================= PROFILE DETAILS ================= */}

                    <div
                        className={
                            styles.profileContainer__details
                        }
                    >

                        {/* ================= LEFT ================= */}

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

                                <div
                                    style={{
                                        display:
                                            'flex',
                                        width:
                                            'fit-content',
                                        alignItems:
                                            'center',
                                        gap:
                                            '1.2rem',
                                    }}
                                >

                                    <input
                                        className={
                                            styles.nameEdit
                                        }
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            setEditedName(
                                                e.target.value
                                            );
                                        }}
                                    />

                                    <p
                                        style={{
                                            color:
                                                'grey',
                                        }}
                                    >
                                        @
                                        {
                                            userProfile
                                                .userId
                                                .username
                                        }
                                    </p>

                                </div>

                            </div>


                            {/* BIO */}

                            <div>

                                <textarea
                                    value={bio}
                                    onChange={(e) => {
                                        setEditedBio(
                                            e.target.value
                                        );
                                    }}
                                    rows={Math.max(
                                        3,
                                        Math.ceil(
                                            bio.length /
                                                80
                                        )
                                    )}
                                    style={{
                                        width:
                                            '100%',
                                    }}
                                />

                            </div>

                        </div>


                        {/* ================= RECENT ACTIVITY ================= */}

                        <div
                            className={
                                styles.recentActivity
                            }
                        >

                            <h3>
                                Recent Activity
                            </h3>

                            {userPosts.map(
                                (post) => (

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

                                            <div
                                                className={
                                                    styles.card__profileContainer
                                                }
                                            >

                                                {post.media ? (
                                                    <img
                                                        src={`${BASE_URL}/${post.media}`}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width:
                                                                '3.4rem',
                                                            height:
                                                                '3.4rem',
                                                        }}
                                                    />
                                                )}

                                            </div>

                                            <p>
                                                {
                                                    post.body
                                                }
                                            </p>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* WORK HISTORY */}
                    {/* ================================================= */}

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

                            {pastWork.map(
                                (work, index) => (

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
                                            {
                                                work.company
                                            }
                                            {' - '}
                                            {
                                                work.position
                                            }
                                        </p>

                                        <p>
                                            {
                                                work.years
                                            }
                                        </p>

                                    </div>
                                )
                            )}

                            <button
                                className={
                                    styles.addWorkButton
                                }
                                onClick={() => {
                                    setIsWorkModalOpen(
                                        true
                                    );
                                }}
                            >
                                Add Work
                            </button>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* EDUCATION */}
                    {/* ================================================= */}

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

                            {education.map(
                                (
                                    educationItem,
                                    index
                                ) => (

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
                                            {
                                                educationItem
                                                    .school
                                            }
                                        </p>

                                        <p>
                                            {
                                                educationItem
                                                    .degree
                                            }
                                            {' - '}
                                            {
                                                educationItem
                                                    .fieldOfStudy
                                            }
                                        </p>

                                    </div>
                                )
                            )}

                            <button
                                className={
                                    styles.addWorkButton
                                }
                                onClick={() => {
                                    setIsEducationModalOpen(
                                        true
                                    );
                                }}
                            >
                                Add Education
                            </button>

                        </div>

                    </div>


                    {/* ================= UPDATE PROFILE ================= */}

                    <div
                        onClick={
                            updateProfileData
                        }
                        className={
                            styles.updateProfileButton
                        }
                    >
                        Update Profile
                    </div>

                </div>


                {/* ================================================= */}
                {/* ADD WORK MODAL */}
                {/* ================================================= */}

                {isWorkModalOpen && (

                    <div
                        onClick={() => {
                            setIsWorkModalOpen(
                                false
                            );
                        }}
                        className={
                            styles.commentsContainer
                        }
                    >

                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className={
                                styles.allCommentsContainer
                            }
                        >

                            <input
                                onChange={
                                    handleWorkInputChange
                                }
                                value={
                                    workInputData.company
                                }
                                name="company"
                                className={
                                    styles.inputField
                                }
                                type="text"
                                placeholder="Enter Company"
                            />

                            <input
                                onChange={
                                    handleWorkInputChange
                                }
                                value={
                                    workInputData.position
                                }
                                name="position"
                                className={
                                    styles.inputField
                                }
                                type="text"
                                placeholder="Enter Position"
                            />

                            <input
                                onChange={
                                    handleWorkInputChange
                                }
                                value={
                                    workInputData.years
                                }
                                name="years"
                                className={
                                    styles.inputField
                                }
                                type="number"
                                placeholder="Years"
                            />

                            <div
                                onClick={addWork}
                                className={
                                    styles.updateProfileButton
                                }
                            >
                                Add Work
                            </div>

                        </div>

                    </div>
                )}


                {/* ================================================= */}
                {/* ADD EDUCATION MODAL */}
                {/* ================================================= */}

                {isEducationModalOpen && (

                    <div
                        onClick={() => {
                            setIsEducationModalOpen(
                                false
                            );
                        }}
                        className={
                            styles.commentsContainer
                        }
                    >

                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className={
                                styles.allCommentsContainer
                            }
                        >

                            <input
                                onChange={
                                    handleEducationInputChange
                                }
                                value={
                                    educationInputData.school
                                }
                                name="school"
                                className={
                                    styles.inputField
                                }
                                type="text"
                                placeholder="School / University"
                            />

                            <input
                                onChange={
                                    handleEducationInputChange
                                }
                                value={
                                    educationInputData.degree
                                }
                                name="degree"
                                className={
                                    styles.inputField
                                }
                                type="text"
                                placeholder="Degree"
                            />

                            <input
                                onChange={
                                    handleEducationInputChange
                                }
                                value={
                                    educationInputData.fieldOfStudy
                                }
                                name="fieldOfStudy"
                                className={
                                    styles.inputField
                                }
                                type="text"
                                placeholder="Field of Study"
                            />

                            <div
                                onClick={
                                    addEducation
                                }
                                className={
                                    styles.updateProfileButton
                                }
                            >
                                Add Education
                            </div>

                        </div>

                    </div>
                )}

            </DashboardLayout>
        </UserLayout>
    );
}
