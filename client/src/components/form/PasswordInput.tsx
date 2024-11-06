import { Input } from '@nextui-org/input'
import React from 'react'

export default function PasswordInput({ label, register, errors, ...props }: any) {
  return (
    <>
    <Input
      className="mt-4"
      type="password"
      variant="underlined"
      label={label}
      {...register}
      {...props}
    />
    {errors && <p className="text-red-500">{errors.message}</p>}
  </>
  )
}
