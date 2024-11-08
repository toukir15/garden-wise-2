"use client"
import { PostContext } from '@/src/context/post.provider'
import Link from 'next/link'
import React, { useContext } from 'react'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { FaRegUser } from 'react-icons/fa'
import { GoHomeFill, GoSearch } from 'react-icons/go'
import { RiNotification4Line } from 'react-icons/ri'

export default function MobileMenu() {
  const {setIsSearchbarOpen, isSearchbarOpen} = useContext(PostContext)
  return (
    <div className="visible xl:invisible flex justify-between px-4 xl:px-16 sticky bottom-0 py-3 border-b-[0.5px] z-[50] border-gray-600 bg-[#19191C] backdrop-blur-md shadow-lg rounded-lg">
    <Link href={"/"} passHref>
        <GoHomeFill className="text-[30px]" />
    </Link>
      <GoSearch onClick={()=> setIsSearchbarOpen(!isSearchbarOpen)} className="text-[30px]" />
      <BiMessageSquareDetail className="text-[30px]" />
      <RiNotification4Line className="text-[30px]" />
    <Link href={"/profile"}>
        <FaRegUser className="text-[27px]" />
    </Link>
  </div>
  )
}
