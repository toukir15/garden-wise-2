import { Button } from '@nextui-org/button'
import Link from 'next/link'
import React from 'react'

export default function SidebarButton({ href, onClick, icon: Icon, label }: any) {
  return (
    <Button
    as={href ? Link : "button"}
    href={href || undefined}
    onClick={onClick}
    className="sidebar-button text-start text-lg font-medium flex items-center justify-start gap-2 p-4"
    variant="light"
    radius="full"
  >
    <Icon className="text-[26px] mr-2" />
    {label}
  </Button>
  )
}
