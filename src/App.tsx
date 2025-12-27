import { useState } from 'react'
import './App.css'

function App() {
  const [isOpenButtonsheet, setIsopenButtonsheet] = useState<boolean>(true)

  return (
    <div className='relative w-[384px] h-dvh bg-amber-300'>
      <button onClick={() => setIsopenButtonsheet(true)} className='text-white font-bold bg-blue-700 rounded px-4 m-4 cursor-pointer'>Open button sheet</button>


      <div onClick={() => setIsopenButtonsheet(false)} className={`absolute h-full ${isOpenButtonsheet ? "bottom-0" : "-bottom-full"} left-0 right-0 flex justify-center items-end bg-[#00000080] transition-all duration-300`}>
        <div onClick={(event) => event.stopPropagation()} className='w-full py-4 px-6 bg-white'>

          <div className="w-full h-10 flex items-center justify-start gap-x-1.5 mb-4">
            <div className="w-7 h-7 bg-blue-600"></div>
            <span className='font-medium text-[18px] text-transparent bg-clip-text bg-linear-to-r from-[#F4492F] via-[#F4842F] to-[#F4B92F]'>بررسی هوشمند</span>
          </div>

          <section className='w-full h-19.25 bg-green-200'></section>

          <section className='w-full mb-4'>
            <span className='text-[#222222] text-[18px] block font-medium mb-1'>اهمیت قیام امام حسین ع</span>
            <span className='w-11.5 h-4 text-center text-[#8871FD] mb-3 rounded inline-block font-medium text-[10px] bg-[#F4F1FF]'>سخنرانی</span>
            <p className="text-[16px] font-normal text-[#222222]">قیام امام حسین (ع) برای احیای دین، مبارزه با ظلم، ترویج امر به معروف، آزادگی، بیداری امت، الهام‌بخشی به حرکت‌های حق‌طلبانه و جاودانه‌سازی فرهنگ ایثار و شهادت، چراغ هدایت تاریخ اسلام شد.</p>
          </section>

          <section className='w-full mb-4'>
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className={`w-full flex items-center justify-between py-1 border-t border-t-[#DBDBDB]`}>
                <div className="flex flex-col">
                  <span className='text-[#222222] text-[16px] font-normal mb-1'>احیای دین و ارزش‌های اسلامی</span>
                  <span className='text-[13px] font-normal text-[#A7A7A7]'>۰:۱۰</span>
                </div>

                <div className='bg-blue-600 w-6 h-6'></div>
              </div>
            ))}
          </section>

          <button className='w-full h-12 bg-linear-to-r from-[#F4492F] via-[#F4842F] to-[#F4B92F] 
                text-white px-6 py-3 rounded-lg font-medium
                hover:opacity-90 transition-all duration-300
                active:scale-95 shadow-lg'>بستن
          </button>

        </div>
      </div>
    </div>
  )
}

export default App
