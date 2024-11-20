'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function News({ slug }) {

    const router = useRouter();
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [likedItems, setLikedItems] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastColor, setToastColor] = useState('');
    const [newsData, setNewsData] = useState([]);
    const [headImg, setHeadImg] = useState()
    const [img2, setImg2] = useState();
    const [text1, setText1] = useState()
    const [text2, setText2] = useState();
    const [commentData, setCommentData] = useState([]);
    const [addComment, setAddComment] = useState({
        comment: '',
    });

    const [isPopUp, setIsPopUp] = useState(false)

    useEffect(() => {
        fetchNewsData()

        updateTotalViews()
    }, []);

    const fetchNewsData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/publicApi/getSingleNews?viewerId=${null}&reporterId=${null}&id=${slug}`);
            setNewsData(response.data.obj);
            setLikedItems(response.data.isLike)
            const image1 = response.data.obj.images[0]
            setHeadImg(image1);
            const image2 = response.data.obj.images.length > 0 ? response.data.obj.images[1] : 0;
            setImg2(image2);

            const previewText = response.data.obj.details.length > 100 ? response.data.obj.details.slice(0, 100) + '' : response.data.obj.details;
            setText1(previewText);
            const postviewText = response.data.obj.details.length > 100 ? response.data.obj.details.slice(100) + '' : null;
            setText2(postviewText)
        }
        catch (err) {
            console.error('Error getting data', err);
        }
    }

    const updateTotalViews = async() => {
        const id = slug;
        try{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/publicApi/updateTotalViews/${id}`)
        }
        catch(err){
            alert("Internal Server Error");
        }
    }

    const handleLikeClick = async(newsId) => {
        if(likedItems === 1){
            try{
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/publicApi/addLike`, {
                    newsId:newsId,
                })
    
                setLikedItems(1)
                fetchNewsData()
            }
            catch(err){
                alert("Internal Server Error");
            }
        }
        else {
            try{
                // await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/publicApi/deleteLikes`, {
                //     newsId:newsId,
                // })

                setLikedItems(0)
                fetchNewsData()
            }
            catch(err){
                alert("Internal server Error")
            }
        }
    }

    const showPopUp = () => {

    }

    return (
        <>
            <div className="bg-gray-100  min-h-screen flex flex-col lg:w-1/2 md:-1/2 lg:mx-auto md:mx-auto">
                <header className="bg-white shadow-md p-4 items-center flex">
                    <img src="/new-pratidin-logo.webp" alt="pratidin varta logo" className="w-20 me-10" />
                    <h1 className="text-2xl text-black font-bold text-center">{newsData.heading}</h1>
                </header>
                <main className="flex-1 p-4">
                    {
                        newsData ? (
                            <>
                                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                    {newsData.video ?
                                        <video
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/api/publicAPi/downloadDocument?name=${newsData.video}`}
                                            alt={newsData.heading}
                                            className="w-full h-full shadow-md"
                                            crossOrigin='anonymous'
                                            controls
                                        />
                                        :
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/api/publicAPi/downloadDocument?name=${headImg}`}
                                            alt={newsData.heading}
                                            className="w-full h-full object-cover shadow-md"
                                            crossOrigin='anonymous'
                                        />
                                    }
                                    <div className="p-4">
                                        <h4 className=" font-bold mb-2 text-black">Reporter Name : {newsData.reporterName}</h4>
                                        <h4 className=" font-bold mb-2 text-black">City : {newsData.cityName}</h4>
                                        <h4 className=" font-bold mb-2 text-black">Date : {newsData.newsDate}</h4>
                                        <p className='p-1 my-1 mb-4 bg-blue-900 text-white font-bold inline-block rounded-xl'>{newsData.categoryName}</p>
                                        <div className="w-full p-2 flex justify-end">
                                            <button
                                                data-modal-target="popup-modal" data-modal-toggle="popup-modal"
                                                className="text-gray-500 mr-5"
                                                type="button"
                                                // onClick={()=>handleLikeClick(slug)}
                                            >
                                                <div className="flex">
                                                    {likedItems === 1 ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className='text-blue-900' viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M7.1 1.685a1.38 1.38 0 0 1 2.542.984L8.93 6h3.94a2 2 0 0 1 1.927 2.535l-.879 3.162A4 4 0 0 1 9.596 14.6L4.5 14L4 7zM2.749 7.447a.75.75 0 1 0-1.496.106l.5 7a.75.75 0 0 0 1.496-.106z" clip-rule="evenodd" /></svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className='text-blue-900' viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="m4 7l2.94-5.041a1.932 1.932 0 0 1 3.56 1.378L10.25 4.5L9.93 6h2.94a2 2 0 0 1 1.927 2.535l-.879 3.162A4 4 0 0 1 9.596 14.6L4.5 14zm5.771 6.11l-3.863-.455l-.379-5.3l2.708-4.64a.432.432 0 0 1 .796.308l-.571 2.663L8.073 7.5h4.796a.5.5 0 0 1 .482.634l-.879 3.162a2.5 2.5 0 0 1-2.7 1.814M2.748 7.447a.75.75 0 1 0-1.496.106l.5 7a.75.75 0 0 0 1.496-.106z" clip-rule="evenodd" /></svg>
                                                    )}
                                                    <p className="ms-2 font-bold text-lg text-blue-900">{newsData.totalLikes}</p>
                                                </div>

                                            </button>
                                            <p className="ms-2 flex text-lg text-blue-900 "><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" className='text-blue-900 font-bold pt-0.5 me-1' viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 17.8c4.034 0 7.686-2.25 9.648-5.8C19.686 8.45 16.034 6.2 12 6.2S4.314 8.45 2.352 12c1.962 3.55 5.614 5.8 9.648 5.8M12 5c4.808 0 8.972 2.848 11 7c-2.028 4.152-6.192 7-11 7s-8.972-2.848-11-7c2.028-4.152 6.192-7 11-7m0 9.8a2.8 2.8 0 1 0 0-5.6a2.8 2.8 0 0 0 0 5.6m0 1.2a4 4 0 1 1 0-8a4 4 0 0 1 0 8" /></svg><span className="">{newsData.totalViews}</span></p>
                                        </div>
                                        <p className="text-gray-700 mb-1.5">{text1}</p>
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/api/publicAPi/downloadDocument?name=${img2}`}
                                            alt={newsData.heading}
                                            className="w-full h-auto object-cover"
                                            crossOrigin='anonymous'
                                        />
                                        <p className="text-gray-700 pt-3 mb-1.5">{text2}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-gray-500">Loading...</p>
                        )
                    }
                </main>
            <div id="popup-modal" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div class="relative p-4 w-full max-w-md max-h-full">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                        <div class="p-4 md:p-5 text-center">
                            <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
                            <button data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                Yes, I'm sure
                            </button>
                            <button data-modal-hide="popup-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            </div>

        </>
    )
}