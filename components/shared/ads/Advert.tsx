import React, { useEffect } from 'react'

type Props = {
    type: "square" | "banner"
}

function Advert({ type }: Props)
{
    useEffect(() =>
    {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    }, []);

    return (
        type === "square" ?
            <ins className="adsbygoogle"
                style={{ display: "inline-block", width: "300px", height: "300px" }}
                data-ad-client="ca-pub-2974631546161756"
                data-ad-slot="8040749966"></ins>
            :
            <ins className="adsbygoogle"
                style={{display:"inline-block", height:"200px"}}
                data-ad-client="ca-pub-2974631546161756"
                data-ad-slot="1287639353"
                data-full-width-responsive="true"></ins>
    )
}

export default Advert