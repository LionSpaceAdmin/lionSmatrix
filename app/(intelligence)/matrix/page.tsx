 'use client'

 import { useEffect } from 'react'
 import { useRouter } from 'next/navigation'

 // Simple client redirect: `/matrix` → `/` to keep the landing page authoritative.
 export default function MatrixRedirect() {
   const router = useRouter()
   useEffect(() => {
     router.replace('/')
   }, [router])
   return null
 }