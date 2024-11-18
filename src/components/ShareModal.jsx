import React from 'react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton, FacebookIcon, TwitterIcon, WhatsappIcon, EmailIcon } from 'react-share';
import { NextSeo } from 'next-seo';


const ShareModal = ({ isOpen, onClose, url, heading, appName, logo, img }) => {

    if (!isOpen) return null;

    const shareUrl = url;
    const shareTitle = `${heading} - ${appName}`;
    const shareDescription = `${heading} \nCheck out latest news on Pratidin Varta`;
    const shareImg = `https://pratidin-varta-api.softthenext.com/api/publicApi/downloadDocument?name=e2a1fc516.webp`

    return (
        <>
            {/* <NextSeo
                title={shareTitle}
                description={shareDescription}
                openGraph={{
                    title: shareTitle,
                    description: shareDescription,
                    url,
                    images: [
                        {
                            url: shareImg,
                            width: 1200,
                            height: 630,
                            alt: heading,
                        },
                    ],
                }}
                twitter={{
                    cardType: 'summary_large_image',
                    site: '@yourapp',
                    title: shareTitle,
                    description: shareDescription,
                }}
            /> */}

            <div className="fixed inset-0  px-2 flex items-end justify-center  bg-black bg-opacity-50">
                <div className="bg-white  w-full lg:w-1/2 p-4 rounded-t-xl shadow-lg mb-16">
                    {logo && (
                        <div className="flex justify-center mb-4">
                            <img src={logo} alt={`${appName} logo`} className="h-16 w-auto" />
                        </div>
                    )}

                    <h2 className="text-lg font-bold mb-3 text-black text-center">Share this news</h2>
                    <h3 className="text-xl font-bold text-center text-black">Pratidin <span className="text-red-600 font-bold">Varta</span></h3>

                    <p className="text-center text-blue-600 underline mb-4">
                        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                    </p>
                    <p className=" py-3 text-center text-black">{heading}</p>


                    <div className="flex  justify-around mb-4">
                        <FacebookShareButton url={url} quote={heading}>
                            <FacebookIcon size={50} round />
                        </FacebookShareButton>
                        <TwitterShareButton url={url} title={heading}>
                            <TwitterIcon size={50} round />
                        </TwitterShareButton>
                        <WhatsappShareButton
                            url={`\n${shareUrl}`}
                            title={heading}
                        >
                            <WhatsappIcon size={50} round />
                        </WhatsappShareButton>
                        <EmailShareButton url={url} subject={heading} body={heading}>
                            <EmailIcon size={50} round />
                        </EmailShareButton>
                    </div>
                    <div className="flex justify-center">
                        <button className="mt-4 w-2/3 bg-blue-800 font-bold text-white py-2 px-4 rounded-full" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    )

};

export default ShareModal;