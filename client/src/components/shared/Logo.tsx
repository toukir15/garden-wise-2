import Image from 'next/image'
import React from 'react'
import logo from "../../../public/plant.png"

export default function Logo() {
  return (
    <Image
    src={logo}
    width={40}
    height={40}
    alt="logo"
    className="mb-2"
  />
  )
}
