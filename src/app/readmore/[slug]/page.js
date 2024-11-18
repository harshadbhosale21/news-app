
import axios from "axios";
import React from "react";
import News from "@/components/NewsDetails";

//Meta-data logic
export async function generateMetadata({ params }) {
    const { slug } = params;

    const newsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/publicApi/getSingleNews?viewerId=${null}&reporterId=${null}&id=${slug}`)

    const heading = newsRes.data.obj.heading || "News";
    const img = newsRes.data.obj.img?.[0] || "sign.png";
    const imgUrl = `https://pratidin-varta-api.softthenext.com/api/publicApi/downloadDocument?name=${img}`

    return {
        title: `${heading} - Pratidin Varta`,
        description: `Check out this news on Pratidin Varta: ${heading}`,
        openGraph: {
            title: `${heading} - Pratidin Varta`,
            description: `Check out this news on Pratidin Varta: ${heading}`,
            url: `https://news-app-iota-five.vercel.app/readmore/${newsRes.data.obj.id}`,
            images: [
                {
                    url: imgUrl,
                    width: 1200,
                    height: 630,
                    alt: heading,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${heading} - Pratidin Varta`,
            description: `Check out this news on Pratidin Varta: ${heading}`,
            images: [imgUrl],
        },
    };

}

export default function Page({ params }) {

    const { slug } = params;

    return (
        <>
            <News slug={slug} />
        </>
    )

}
