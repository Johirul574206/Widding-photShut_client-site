import React from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { AuthContext } from '../../Contexts/UseContext';
import useTitle from '../../hook/useTitle';

const MyReviws = () => {
    useTitle('My-Reviews')
    const { user, userLogOut } = useContext(AuthContext);

    const [myReview, setReview] = useState([]);
    useEffect(() => {
        fetch(`https://assignment-server-site-10.vercel.app/all-reviews?email=${user?.email}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('Accesstoken')}`
            }

        })
            .then(res => {

                if (res.status === 401 || res.status === 403) {
                    userLogOut()
                }

                return res.json()
            })
            .then(data => {

                setReview(data)
            })
            .catch(err => console.log(err))
    }, [user?.email, myReview])



    // console.log(myReview)


    const [displayUsers, setDisplayUser] = useState(myReview)
    // ///delete user number one parson
    const deleteBtn = (users) => {
        // console.log(users);
        const agree = window.confirm(`are you sure is parson delete ${users._id}`)
        if (agree) {
            fetch(`https://assignment-server-site-10.vercel.app/all-reviews/${users._id}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.deletedCount > 0) {

                        toast.success('Delete Successfully !')

                        // kintu tumar page ke relode marle delete dekabe tar jonne useState
                        const remainingUser = displayUsers.filter(use => use._id !== users._id);
                        console.log(remainingUser)
                        setDisplayUser(remainingUser);
                    }
                })
        } else {

        }
    }
    // -----------delete btn end------------

    return (
        <>
            <section className="p-6 dark:bg-gray-800 dark:text-gray-100 mt-16">

                {
                    myReview.length > 0 ?
                        <>
                            <div className="grid gap-6 my-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:mx-20">
                                {
                                    myReview.map(review =>

                                        <div key={review._id} className="flex flex-col p-8 space-y-4 rounded-md dark:bg-gray-900">
                                            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full dark:bg-violet-400 dark:text-gray-900"><img src={review?.img} alt="" /></div>
                                            <p className="lg:text-2xl text-sm  font-semibold">
                                                <b>Service : {review?.serviceName}</b>
                                            </p>
                                            <p className="lg:text-1xl text-sm font-semibold">Email : {review?.email}</p>
                                            <p className="lg:text-1xl text-sm  font-semibold">Reating : {review?.reting}.3</p>
                                            <p className="lg:text-1xl text-sm  font-semibold">Message : {review?.message.slice(0, 50)} .</p>

                                            <div className="flex justify-between">
                                                <button onClick={() => deleteBtn(review)} className='lg:w-40 px-5 mx-auto bg-red-800 py-2 hover:bg-red-600 '>Delete</button>
                                                <Link key={review?._id} to={`/update/${review._id}`}><button className='lg:w-40 px-5  mx-auto bg-slate-500 py-2 hover:bg-slate-600 '>Update</button></Link>
                                            </div>
                                        </div>

                                    )
                                }
                            </div>

                        </>
                        :
                        <>
                            <div className="h-[100vh]">
                                <h1 className='text-center text-2xl mt-10 lg:mt-52'>Not Founded Reviews</h1>
                            </div>
                        </>
                }


            </section>
        </>
    );
};

export default MyReviws;