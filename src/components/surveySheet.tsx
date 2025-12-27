import { data_servey } from "../data/ai-data";
import AudioPlayer from "./audio";

const SurveySheet = () => {

    return (
        <>
            <div className='w-full h-full flex flex-col justify-between py-4 px-6 bg-white'>
                <div>
                    <div className="w-full h-10 flex items-center justify-start gap-x-1.5 mb-4">
                        <div className="w-7 h-7 bg-blue-600"></div>
                        <span className='font-medium text-[18px] text-transparent bg-clip-text bg-linear-to-r from-[#F4492F] via-[#F4842F] to-[#F4B92F]'>بررسی هوشمند</span>
                    </div>

                    <section dir="ltr" className='w-full h-19.25'>
                        <AudioPlayer src="/audio/BeTahaBeYasin.mp3" />
                    </section>

                    <section className='w-full mb-4'>
                        <span className='text-[#222222] text-[18px] block font-medium mb-1'>اهمیت قیام امام حسین ع</span>
                        <span className='w-11.5 h-4 text-center text-[#8871FD] mb-3 rounded inline-block font-medium text-[10px] bg-[#F4F1FF]'>سخنرانی</span>
                        <p className="text-[16px] font-normal text-[#222222]">قیام امام حسین (ع) برای احیای دین، مبارزه با ظلم، ترویج امر به معروف، آزادگی، بیداری امت، الهام‌بخشی به حرکت‌های حق‌طلبانه و جاودانه‌سازی فرهنگ ایثار و شهادت، چراغ هدایت تاریخ اسلام شد.</p>
                    </section>

                    <section className='w-full h-58.5 mb-4 overflow-y-scroll'>
                        {data_servey?.map((item) => (
                            <div key={item.id} className={`w-full flex items-center justify-between py-1 border-t border-t-[#DBDBDB]`}>
                                <div className="flex flex-col">
                                    <span className='text-[#222222] text-[16px] font-normal mb-1'>{item.title}</span>
                                    <span className='text-[13px] font-normal text-[#A7A7A7]'>{item.time}</span>
                                </div>

                                <div className='bg-blue-600 w-6 h-6'></div>
                            </div>
                        ))}
                    </section>
                </div>

                <button className='w-full  h-12 bg-linear-to-r from-[#F4492F] via-[#F4842F] to-[#F4B92F] 
                text-white px-6 py-3 rounded-lg font-medium
                hover:opacity-90 transition-all duration-300
                active:scale-95 shadow-lg'>بستن
                </button>

            </div>
        </>
    )
}

export default SurveySheet;