import Image from 'next/image'
import { ScheduleButton } from '../ScheduleButton'
import Link from 'next/link'

export const Header = () => {
  return (
    <header className='bg-[#f6f6f6] mb-8'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div className='w-40'>
            <Link href='/' className='block'>
              <Image
                src='/logo.png'
                alt='RE-Target Logo'
                width={160}
                height={40}
                priority
              />
            </Link>
          </div>
          <div className='flex-1 text-center'>
            <h1 className='text-2xl font-semibold text-gray-800'>
              RE-Target Agent Direct
            </h1>
          </div>
          <ScheduleButton />
        </div>
      </div>
    </header>
  )
}
