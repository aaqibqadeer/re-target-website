import Image from 'next/image'
import { ScheduleButton } from '../ScheduleButton'
import Link from 'next/link'

export const Header = () => {
  return (
    <header className='bg-[#f6f6f6] mb-8'>
      <div className='container mx-auto px-4 py-4 lg:py-0'>
        <div className='flex flex-col lg:flex-row items-center justify-between'>
          <div className='flex-1 grow-[2] my-4'>
            <Link href='/' className='block'>
              <Image
                src='/logo.png'
                alt='RE-Target Logo'
                width={340}
                height={97}
                priority
              />
            </Link>
          </div>
          <div className='text-center flex-1 grow-[3] py-4 lg:py-0'>
            <h1 className={`font-semibold text-gray-800 mb-4 text-[2.6rem]`}>
              RE-Target Agent Direct
            </h1>
          </div>
          <div className='flex justify-end flex-1 grow-[2] py-4 lg:py-0'>
            <ScheduleButton />
          </div>
        </div>
      </div>
    </header>
  )
}
