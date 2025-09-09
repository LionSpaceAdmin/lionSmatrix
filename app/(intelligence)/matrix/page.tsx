 'use client'

 import { useRouter } from 'next/navigation'
 import { useEffect } from 'react'

 // Simple client redirect: `/matrix` → `/` to keep the landing page authoritative.
 export default function MatrixRedirect() {
   const router = useRouter()
   useEffect(() => {
     router.replace('/')
   }, [router])
   return null
 }