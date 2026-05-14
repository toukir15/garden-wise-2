import { Button } from '@nextui-org/button'
import Link from 'next/link'
import React from 'react'

export default function SidebarButton({ href, onClick, icon: Icon, label }: any) {
  return (
    <Button
      as={href ? Link : "button"}
      href={href || undefined}
      onClick={onClick}
      className="sidebar-button w-full text-start text-lg my-1 font-medium flex items-center justify-start gap-2 py-7 px-8"
      variant="light"
      radius="full"
    >
      <span className="flex items-center justify-center w-6 h-6 shrink-0 mr-2">
        <Icon size={22} />
      </span>
      {label}
    </Button>
  )
}
