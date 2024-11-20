'use client'

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useMemo } from "react";

import axios from "axios";
import moment from "moment";

import ShareModal from "@/components/ShareModal";

export default function HomePage() {

    const [newsData, setNewsData] = useState([]);
    const [likedItems, setLikedItems] = useState(new Array(newsData.length).fill(false));
    const [likeIds, setLikeIds] = useState([]);
    const [likes, setLikes] = useState([])
    const [adsData, setAdsata] = useState([]);
    const [selectedTab, setSelectedTab] = useState('latest');
    const [totalShare, setTotalShare] = useState([])
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareItem, setShareItem] = useState(null);
    const router = useRouter();
    const maxCards = 100;
    const maxLength = 100;
    const [delay, setDelay] = useState(5000);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(3);
    const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);
    const loaderRef = useRef(null);

    const videosRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [allFetched, setAllFetched] = useState(true);

    useEffect(() => {
        getAppData(currentPage)

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (videosRef.current) {
                    if (entry.isIntersecting) {
                        videosRef.current.play();
                    } else {
                        videosRef.current.pause();
                    }
                }
            },
            { threshold: 0.2 }
        );

        if (videosRef.current) {
            observer.observe(videosRef.current);
        }

        return () => {
            if (videosRef.current) {
                observer.unobserve(videosRef.current);
            }
        };

    }, []);

    const getAppData = async (page) => {
        setLoading(true);
        try {
            const params = {
                id: 0,
                reporterId: 0,
                perPage: perPage,
                currentPage: 1
            }
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/publicApi/getAppData`, { params });
            const news = res.data.data.Result;

            const uniqueNews = news.filter((newsItem) => {
                return !newsData.some((existingNews) => existingNews.id === newsItem.id);
            });

            if (uniqueNews.length > 0) {
                setNewsData((prevNews) => [...prevNews, ...uniqueNews]);
            }

            if (news.length < perPage) {
                setHasMore(false);
                setAllFetched(false)
                setIsInfiniteDisabled(true);
            };

            // setAdsata(res.data.data.adsData.reverse())
            setAdsata((prevAds) => [...prevAds, ...res.data.data.adsData])
            const likesPromises = news.map(item =>
                axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/publicApi/getAllLikes/${item.id}`)
            );
            const likesResponses = await Promise.all(likesPromises);
            const likesData = likesResponses.map(res => res.data.likes);
            const likeIds = likesData.map(likes => likes.map(like => like.id));
            const likeCounts = likesData.map(likes => likes.length);
            setLikes(likeCounts);
            setLikeIds(likeIds);
            const initialLikedItems = news.map(item => item.isLike === 1);

            setLikedItems((prevLikedItems) => [...prevLikedItems, ...initialLikedItems]);
            setIsLoaded(false);

        }
        catch (err) {
            console.log('error', err)
        }
    };

    const ReadMore = (id) => {
        router.push(`/readmore/${id}`)
    };

    const handleShareClick = (index, item) => {

        console.log("share-clicked")

        setShareItem(item);
        setIsShareModalOpen(true);

        setTotalShare(totalShare + 1)
        // handleTotalShares(item);
    };

    const renderNewsCards = () => {

        const AdsCard = ({ adItem }) => {

            const videoUrl = useMemo(() => {
                return adItem && adItem.video
                    ? `${process.env.NEXT_PUBLIC_API_URL}/api/publicApi/downloadDocument?name=${adItem.video}`
                    : null;
            }, [adItem.id]);


            return (
                <>
                    {adItem ?
                        <div className="bg-white flex  items-center justify-center my-3" key={adItem.id}>
                            <div class="w-full mx-auto bg-white  shadow-md overflow-hidden md:max-w-2xl">
                                <div class="">
                                    <div class="relative md:flex-shrink-0 video">
                                        {adItem.video ?
                                            <video
                                                key={adItem.id}
                                                src={videoUrl}
                                                frameborder="0"
                                                controls
                                                playsInline
                                                muted
                                                autoPlay
                                                ref={videosRef}
                                                // onClick={handleVideoPress}
                                                className='video_player w-full h-auto lg:w-full'
                                                crossOrigin='anonymous'
                                                alt="Advertisements"
                                            >
                                            </video>
                                            : adItem.adsLink ?
                                                <a href={adItem.adsLink} target='_blank'>
                                                    <img
                                                        class="h-auto w-full"
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/publicApi/downloadDocument?name=${adItem.images}`}
                                                        crossOrigin='anonymous'
                                                        alt="advertisement"
                                                    />
                                                </a>
                                                :
                                                <img
                                                    class="h-auto w-full"
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}/api/publicApi/downloadDocument?name=${adItem.images}`}
                                                    crossOrigin='anonymous'
                                                    alt="advertisement"
                                                />

                                        }
                                        <div className="absolute top-1 left-1 bg-gray-900  rounded-r-xl p-2">
                                            <div class="uppercase tracking-wide text-white text-xs  font-semibold">Advertisement</div>
                                        </div>
                                    </div>
                                    <div class="px-4 py-2.5 bg-white  ">
                                        <div className='flex justify-between mt-1 text-lg leading-tight font-medium p-2 bg-gray-300 rounded-lg w-full text-black'>
                                            <h1 class="block mt-1 text-lg leading-tight font-medium p-2 bg-gray-300 rounded-lg text-black">{adItem.heading}</h1>
                                            <a href={adItem.adsLink ? adItem.adsLink : null} target='_blank'>
                                                <span>
                                                    <svg className='mt-2' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M388.364 242.764v178.691A42.547 42.547 0 0 1 345.818 464H90.546A42.544 42.544 0 0 1 48 421.455V166.182a42.543 42.543 0 0 1 42.546-42.546h178.69M464 180.364V48H331.636M216 296L464 48" /></svg>
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="bg-gray-100 flex items center justify-center rounded-lg my-3">
                            <div class="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                <div class="md:flex">
                                    <div class="relative md:flex-shrink-0">
                                        <img
                                            class="h-full w-full object-cover"
                                            src='/home-icon/pratidi-vart-logo.png'
                                            crossOrigin='anonymous'
                                            alt="advertisement"
                                        />
                                        <div className="absolute top-1 left-1 bg-gray-900  rounded-r-xl p-2">
                                            <div class="uppercase tracking-wide text-white text-xs  font-semibold">Advertisement</div>
                                        </div>
                                    </div>
                                    <div class="px-8 py-2 bg-gray-500">
                                        <h1 class="block mt-1 text-lg leading-tight font-medium text-black">This is a default advertisement</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </>
            )
        };

        return newsData && newsData.slice(-maxCards).map((item, index) => {
            const previewText = item.details.length > maxLength ? item.details.slice(0, maxLength) + '...' : item.details;

            return (
                <React.Fragment key={item.id}>
                    {newsData ? index >= 0 && index % 2 === 0 && adsData && <AdsCard adItem={adsData[Math.floor(index / 2) % adsData.length]} /> : <AdsCard />}
                    <div className="bg-white shadow-lg my-2">
                        <div className="flex items-center p-4">
                            <div className="flex-shrink-0 mr-4">
                                {item.profileImage ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/publicAPi/downloadDocument?name=${item.profileImage}`}
                                        className="w-12 h-12 rounded-full"
                                        alt="Profile"
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-12 h-12 text-gray-400"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                        />
                                    </svg>
                                )}
                            </div>
                            <div className=''>
                                <h2 className="font-semibold text-md text-black">{item.reporterName} •  <span className="  text-blue-600 font-bold inline-block rounded-xl">{item.categoryName}</span></h2>
                                <p className="text-gray-600">{moment(item.newsDate).format('MMMM Do, YYYY')}  •  {item.cityName}</p>
                            </div>
                        </div>
                        <div className="p-4 video">
                            <h5 className="text-lg font-bold text-black">{item.heading}</h5>
                            {item.video ? (
                                <video
                                    src={
                                        `${process.env.NEXT_PUBLIC_API_URL}/api/publicAPi/downloadDocument?name=${item.video}`
                                    }
                                    className="video_player h-auto w-full object-cover mt-4"
                                    controls
                                    ref={videosRef}
                                    playsInline
                                    muted
                                    autoPlay
                                    // onClick={handleVideoPress}
                                    crossOrigin="anonymous"
                                    alt="News"
                                >
                                </video>
                            ) : (
                                <img
                                    src={
                                        item.images === ''
                                            ? '/home-icon/pratidin-logo.webp'
                                            : `${process.env.NEXT_PUBLIC_API_URL}/api/publicApi/downloadDocument?name=${item.images[0]}`
                                    }
                                    className="h-auto w-full object-cover mt-4"
                                    crossOrigin="anonymous"
                                    alt="News"
                                />
                            )}
                            <p className="mt-4 text-black">{previewText}...
                                <span>
                                    <div className="flex px-4">
                                        <button
                                            className="flex items-center text-blue-600 hover:text-blue-800"
                                            onClick={() => {
                                                ReadMore(item.id);
                                                // updateViews(item.id)
                                            }}
                                        >
                                            <span className="mr-2">READ MORE</span>
                                            <i class="fa-solid fa-arrow-right"></i>
                                        </button>
                                    </div>
                                </span>
                            </p>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <p className="text-gray-700">{item.totalViews} views • {item.totalLikes} likes</p>
                        </div>
                        <div className="flex justify-between px-4 pb-3">
                            <div className='flex justify-between'>
                                <button
                                    className=" flex text-gray-500 me-6"
                                    onClick={() => {
                                        localStorage.getItem("pratidin_auth_token")
                                            ? handleLikeClick(index, item.id)
                                            : router.push("/auth");
                                    }}
                                >
                                    {likedItems[index] ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" className='text-blue-900' viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M7.1 1.685a1.38 1.38 0 0 1 2.542.984L8.93 6h3.94a2 2 0 0 1 1.927 2.535l-.879 3.162A4 4 0 0 1 9.596 14.6L4.5 14L4 7zM2.749 7.447a.75.75 0 1 0-1.496.106l.5 7a.75.75 0 0 0 1.496-.106z" clip-rule="evenodd" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" className='text-blue-900' viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="m4 7l2.94-5.041a1.932 1.932 0 0 1 3.56 1.378L10.25 4.5L9.93 6h2.94a2 2 0 0 1 1.927 2.535l-.879 3.162A4 4 0 0 1 9.596 14.6L4.5 14zm5.771 6.11l-3.863-.455l-.379-5.3l2.708-4.64a.432.432 0 0 1 .796.308l-.571 2.663L8.073 7.5h4.796a.5.5 0 0 1 .482.634l-.879 3.162a2.5 2.5 0 0 1-2.7 1.814M2.748 7.447a.75.75 0 1 0-1.496.106l.5 7a.75.75 0 0 0 1.496-.106z" clip-rule="evenodd" /></svg>
                                    )}
                                </button>
                                <button className="flex text-gray-500 me-6 hover:text-gray-900"
                                    // onClick={() => {
                                    //     if (localStorage.getItem("pratidin_auth_token")) {
                                    //         handleShareClick(index, item);
                                    //         updateViews(item.id);
                                    //     } else {
                                    //         router.push("/auth");
                                    //     }
                                    // }}
                                    onClick={() => handleShareClick(index, item)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" className='text-blue-900' viewBox="0 0 56 56">
                                        <path fill="currentColor" d="M32.781 52.55c1.688 0 2.883-1.452 3.75-3.702L51.883 8.746c.422-1.078.68-2.039.68-2.836c0-1.523-.961-2.46-2.485-2.46c-.797 0-1.758.234-2.836.656L6.93 19.55c-1.97.75-3.493 1.945-3.493 3.656c0 2.156 1.641 2.883 3.891 3.563l12.68 3.843c1.476.47 2.32.422 3.328-.515l25.71-24.024c.305-.281.657-.234.892-.023c.234.234.257.586-.024.89l-23.93 25.805c-.89.961-.984 1.758-.515 3.328l3.703 12.375c.703 2.367 1.43 4.102 3.61 4.102" />
                                    </svg>
                                </button>
                                <button className="flex text-gray-500 me-3  hover:text-gray-400"
                                    onClick={() => { localStorage.getItem("pratidin_auth_token") ? router.push(`/readMore/${item.id}#commentsec`) : router.push("/auth") }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" className='text-blue-900' viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12a10 10 0 0 0 .951 4.262l-.93 4.537a1 1 0 0 0 1.18 1.18l4.537-.93c1.294.61 2.74.95 4.262.95c5.523 0 10-4.476 10-10c0-5.522-4.477-10-10-10" clip-rule="evenodd" /></svg>
                                </button>
                            </div>
                            <p className="text-gray-500 text-xs">{moment(item.createdAt).fromNow()}</p>
                        </div>
                    </div>
                </React.Fragment>
            )
        })
    }

    return (
        <>
            <div className="content mt-2 w-full lg:w-1/2 lg:mx-auto">
                {renderNewsCards()}
                <ShareModal
                    appName={'Pratidin Varta'}
                    logo='/new-pratidin-logo.webp'
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    url={shareItem ? `https://news-app-iota-five.vercel.app/readmore/${shareItem.id}` : ''}
                    heading={shareItem ? shareItem.heading : ''}
                    img={shareItem ? shareItem.images[0] : 'imge'}
                    video={shareItem ? shareItem.video : 'video'}
                />
            </div>
        </>
    )

}