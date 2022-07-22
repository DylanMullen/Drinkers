import { useRouter } from 'next/router'
import React, { useEffect } from 'react'


function Custom404()
{

    const router = useRouter();

    useEffect(() =>
    {
        router.push("/waterfall")
    }, [])

    return (
        <></>
    )
}

export default Custom404