import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react';

export default function Home()
{

  let router = useRouter();

  useEffect(() =>
  {
    router.replace("/waterfall", undefined, {
      shallow: true
    })
  })

  return (
    <>
    </>
  )
}
