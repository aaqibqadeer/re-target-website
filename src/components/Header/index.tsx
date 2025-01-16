import Image from 'next/image'
import { ScheduleButton } from '../ScheduleButton'
import Link from 'next/link'
import { commonProperties } from '@/lib/properties'

export const Header = () => {
  return (
    <header className='bg-[#f6f6f6] mb-8'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div className='w-100 flex-1'>
            <Link href='/' className='block'>
              <Image
                src='/logo.png'
                alt='RE-Target Logo'
                width={340}
                height={60}
                priority
              />
            </Link>
          </div>
          <div className='flex-2 text-center'>
            <h1 className={`font-semibold text-gray-800 mb-4 text-[2.6rem]`}>
              RE-Target Agent Direct
            </h1>
          </div>
          <ScheduleButton />
        </div>
      </div>
    </header>
  )
}
