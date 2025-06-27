import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation , Pagination, Autoplay, EffectCoverflow} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { HiSpeakerphone } from "react-icons/hi";
import { IoDocumentText } from "react-icons/io5";
import { FaCircleChevronRight,FaGears,FaHandshake } from "react-icons/fa6";
import { FaCamera,FaRegCalendarAlt,FaServer,FaUsers,FaTruck
  ,FaBriefcase,FaNotesMedical ,FaClipboardList,FaPeopleCarry,
   FaMedal, FaImage, FaNewspaper,FaBullhorn, FaPeopleArrows,
    FaLightbulb, FaHeartbeat,} from 'react-icons/fa';
// FaGears, FaServer, FaHandshake, FaUsers, FaImage, FaNewspaper, FaNotesMedical, FaBullhorn, FaPeopleArrows, FaLightbulb, FaHeartbeat
const Home = () => {
  const categories = [
    { icon: <FaGears />, title: "จัดซื้อจัดจ้าง" ,link: "https://www.ccit.go.th/purchase/" },
    { icon: <FaServer />, title: "จัดซื้อจัดจ้าง e-GP" ,link: "https://www.ccit.go.th/egp/" },
    { icon: <FaHandshake />, title: "ร่วมงานกับเรา",link: "https://www.ccit.go.th/career/" },
    { icon: <FaUsers />, title: "โครงการอบรม",link: "https://www.ccit.go.th/research/training.php" },
    { icon: <FaMedal />, title: "ทำดี มีคนชม",link: "https://www.ccit.go.th/news/good.php" },
    { icon: <FaImage />, title: "ภาพกิจกรรม",link: "https://www.ccit.go.th/news/activity.php" },
    { icon: <FaNewspaper />, title: "จดหมายข่าว",link: "https://www.ccit.go.th/news/letternews.php" },
    { icon: <FaNotesMedical />, title: "ข่าวสารสุขภาพ",link: "https://www.ccit.go.th/news/health.php" },
    { icon: <FaBullhorn />, title: "ศูนย์ข่าวอิเล็กทรอนิกส์",link: "https://www.oic.go.th/INFOCENTER92/9267/" },
    { icon: <FaPeopleArrows />, title: "ศูนย์ประสานราชการฯ",link: "https://www.ccit.go.th/ccitclean/" },
    { icon: <FaLightbulb />, title: "สาระน่ารู้ไอที",link: "https://www.ccit.go.th/it/knowledge.php" },
    { icon: <FaHeartbeat />, title: "วิกฤตโรคหัวใจ",link: "https://www.ccit.go.th/saveheart/" },
  ];
  const activities = [
    {
      title: "การประชุมเชิงปฏิบัติการ",
      image: "https://www.ccit.go.th/document_upload/activity/default/activity_435_1.jpg",
      date: "20 กันยายน 2566",
      link: "https://www.ccit.go.th/news/preview.php?post_id=435",
    },
    {
      title: "การประชุมเชิงปฏิบัติการ",
      image: "https://www.ccit.go.th/document_upload/activity/default/activity_432_1.jpg",
      date: "20 กันยายน 2566",
      link: "https://www.ccit.go.th/news/preview.php?post_id=432",
    },
    {
      title: "การประชุมเชิงปฏิบัติการ",
      image: "	https://www.ccit.go.th/document_upload/activity/default/activity_426_1.jpg",
      date: "20 กันยายน 2566",
      link: "https://www.ccit.go.th/news/preview.php?post_id=426",
    },
    {
      title: "การประชุมเชิงปฏิบัติการ",
      image: "https://www.ccit.go.th/document_upload/activity/default/activity_423_1.jpg",
      date: "20 กันยายน 2566",
      link: "https://www.ccit.go.th/news/preview.php?post_id=423",
    },{
      title: "การประชุมเชิงปฏิบัติการ",
      image: "	https://www.ccit.go.th/document_upload/activity/default/activity_421_1.jpg",
      date: "20 กันยายน 2566",
      link: "https://www.ccit.go.th/news/preview.php?post_id=421",
    },
    {
      title: "การประชุมเชิงปฏิบัติการ",
      image: "https://www.ccit.go.th/document_upload/activity/default/activity_418_1.jpg",
      date: "20 กันยายน 2566",
      link: "https://www.ccit.go.th/news/preview.php?post_id=418",
    }
  ];  
  return (
    <>
    
      {/* สไลด์โชว์ */}
      <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: false }}
      className=" mySwiper "
    >
        <SwiperSlide>
        <img
          src="https://www.ccit.go.th/images/banner/banner-m1-2000.jpg"
          alt="แบนเนอร์กิจกรรม 1"
          className="w-screen h-[10rem] xs:h-[15rem] sm:h-[18rem] md:h-[22rem] lg:h-[35rem] "
        />
        </SwiperSlide>

        <SwiperSlide>
          <img
            src="https://www.ccit.go.th/images/banner/ccit_connect.jpg"
            alt="แบนเนอร์ CCIT Connect"
            className="w-screen  h-[10rem] xs:h-[15rem]  sm:h-[18rem] md:h-[22rem] lg:h-[30rem] xl:h-[35rem]"
          />
        </SwiperSlide>

        <SwiperSlide>
          <img
            src="https://www.ccit.go.th/images/banner/banner-m2-2000.jpg"
            alt="แบนเนอร์กิจกรรม 2"
            className="w-screen  h-[10rem] xs:h-[15rem]  sm:h-[18rem] md:h-[22rem] lg:h-[30rem] xl:h-[35rem]"
          />
        </SwiperSlide>

    </Swiper>
      {/* แอพพลิเคชั่น  */}
      <div className='bg-[#F5F5F5] w-full py-5 px-4 shadow-2xl flex flex-col items-center   '>
        {/* <h1 className='flex text-2xl font-bold justify-items-center gap-2 '> <IoApps className='text-green-700  '/> แอพพลิเคชั่น </h1> */}
        <div className='grid justify-items-center grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 
        text-[#424242] gap-4 font-bold p-5'>
          <div className='flex flex-col items-center gap-2 '> 
            <a href="https://www.ccit.go.th/" target="_blank" className='flex flex-col items-center gap-2 '>
              <FaTruck  className='transform hover:scale-105 transition-transform duration-300 text-[#2E7D32] xl:size-24 lg:size-20 md:size-18 sm:size-15 size-12 '/> 
              <h1 className='flex text-[10.5px] xl:text-lg lg:text-md md:text-[12.5px] sm:[8.5px] 
              font-medium text-center transform hover:scale-105 
              transition-transform duration-300 hover:text-md-scale-105 '>ระบบลงทะเบียนรับยา<br/>ทางไปรษณีย์สำหรับผู้ป่วยนัด</h1>
            </a>
          </div>
          <div className='flex flex-col items-center gap-2'> 
            <a href="https://www.ccit.go.th/" target="_blank" className='flex flex-col items-center gap-2 '>
              <FaBriefcase alt='app-icon-2' className='transform hover:scale-105 transition-transform duration-300 xl:size-24 lg:size-20 md:size-18 sm:size-15 size-12 text-[#2e557d]'/>
              <h1 className='flex text-[10.5px] xl:text-lg lg:text-md md:text-[12.5px] sm:[8.5px]
              font-medium text-center transform hover:scale-105 transition-transform duration-300 hover:text-md-scale-105'>โปรแกรมผู้ป่วยจาก<br/>การประกอบอาชีพ</h1>
            </a>
          </div>
          <div className='flex flex-col items-center gap-2'> 
          <a href="https://www.ccit.go.th/" target="_blank" className='flex flex-col items-center gap-2 '> 
            <FaNotesMedical alt='app-icon-3' className='transform hover:scale-105 transition-transform duration-300 xl:size-24 lg:size-20 md:size-18 sm:size-15 size-12 text-[#7d2e2e]'/>
            <h1 className='flex text-[10.5px] xl:text-lg lg:text-md md:text-[12.5px] sm:[8.5px]
             font-medium text-center transform hover:scale-105 transition-transform duration-300 hover:text-md-scale-105'>ระบบบันทึกคลินิก <br/> โรคปอดอุดกั้นเรื้อรัง</h1>
          </a>
            </div>
          <div className='flex flex-col items-center gap-2'> 
            <a href="https://www.ccit.go.th/" target="_blank" className='flex flex-col items-center gap-2 '>
              <FaClipboardList alt='app-icon-4' className='transform hover:scale-105 transition-transform duration-300 xl:size-24 lg:size-20 md:size-18 sm:size-15 size-12 text-[#7d2e76]'/>
              <h1 className='flex text-[10.5px] xl:text-lg lg:text-md md:text-[12.5px] sm:[8.5px]
               font-medium text-center transform hover:scale-105 transition-transform duration-300 hover:text-md-scale-105'>THAI ACS REGISTRY</h1>
            </a>
            </div>
          <div className='flex flex-col items-center gap-2'> 
            <a href="https://www.ccit.go.th/" target="_blank" className='flex flex-col items-center gap-2 '>
              <FaPeopleCarry alt='app-icon-5' className='transform hover:scale-105 transition-transform duration-300 xl:size-24 lg:size-20 md:size-18 sm:size-15 size-12 text-[#7d7d2e]'/>
              <h1 className='flex text-[10.5px] xl:text-lg lg:text-md md:text-[12.5px] sm:[8.5px]
               font-medium text-center transform hover:scale-105 transition-transform duration-300 hover:text-md-scale-105'>ระบบจองห้องประชุม</h1>
            </a>
            </div>
          <div className='flex flex-col items-center gap-2'> 
            <a href="https://www.ccit.go.th/" target="_blank" className='flex flex-col items-center gap-2 '>
              <img src="https://www.ccit.go.th/images/icon-app6.png" alt='app-icon-6' className='transform hover:scale-105 transition-transform duration-300 xl:size-24 lg:size-20 md:size-18 sm:size-15 size-12'/>
              <h1 className='flex text-[10.5px] xl:text-lg lg:text-md md:text-[12.5px] sm:[8.5px]
               font-medium text-center transform hover:scale-105 transition-transform duration-300 hover:text-md-scale-105'>THAI ACS REGISTRY</h1>
            </a>
          </div>
          <div className='flex flex-col items-center gap-2'> 
            <a href="https://www.ccit.go.th/" target="_blank" className='flex flex-col items-center gap-2 '>
              <img src="https://www.ccit.go.th/images/icon-app7.png" alt='app-icon-7' className='transform hover:scale-105 transition-transform duration-300 xl:size-24 lg:size-20 md:size-18 sm:size-15 size-12'/>
              <h1 className='flex text-[10.5px] xl:text-lg lg:text-md md:text-[12.5px] sm:[8.5px]
               font-medium text-center transform hover:scale-105 transition-transform duration-300 hover:text-md-scale-105'>นิทรารมณ์</h1>
            </a>
            </div>
          <div className='flex flex-col items-center gap-2'> 
            <a href="https://www.ccit.go.th/" target="_blank" className='flex flex-col items-center gap-2 '>
              <img src="https://www.ccit.go.th/images/icon-app8.png" alt='app-icon-8' className='transform hover:scale-105 transition-transform duration-300 xl:size-24 lg:size-20 md:size-18 sm:size-15 size-12'/>
              <h1 className='flex text-[10.5px] xl:text-lg lg:text-md md:text-[12.5px] sm:[8.5px]
               font-medium text-center transform hover:scale-105 transition-transform duration-300 hover:text-md-scale-105'>CCIT Connect</h1>
            </a>
            </div>
        </div>
      </div>
      {/* กิจกรรมภายใน */}
      <div className="bg-white">
        <div className="flex flex-col items-center justify-center p-10">
          <h1 className="flex items-center font-extrabold text-3xl gap-2 pb-5 text-[#2E7D32]  m-10">
            <FaCamera className="text-[#2E7D32]" />
            กิจกรรมภายใน
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2 w-full max-w-8xl">
            {activities.map((act, i) => (
              <div
                key={i}
                className="bg-[#F5F5F5] rounded-xl shadow-xl p-6 font-bold text-lg transform transition duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
              >
                <h2 className="flex items-center gap-2 text-[#424242] text-xl">
                  <IoDocumentText />
                  {act.title}
                </h2>
                <img
                  src={act.image}
                  alt={act.title}
                  className="rounded-xl mt-4 transform transition duration-300 hover:scale-110 hover:shadow-xl"
                />

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-2 text-[#757575] text-base">
                    <FaRegCalendarAlt className="text-xl" />
                    <span>{act.date}</span>
                  </div>

                  <a
                    href={act.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#2E7D32] text-white rounded-2xl px-4 py-1 text-base font-medium hover:bg-green-800 transition"
                  >
                    อ่านต่อ
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end w-full  p-5 mt-4">
            <a
              href="https://www.ccit.go.th/news/activity.php"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-[#2E7D32] rounded-2xl px-4 py-2 text-lg font-medium border border-[#2E7D32] hover:bg-[#f0f0f0] transition"
            >
              <FaCircleChevronRight className="text-2xl" />
              ดูทั้งหมด
            </a>
          </div>
        </div>
      </div>
      {/* หมวดข่าวสาร */}
      <div>
        {/* Row 1 */}
        <section className="py-10 px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-green-700 p-5">
            <HiSpeakerphone className="inline-block text-3xl mr-2" />
            หมวดข่าวสาร
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {categories.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 hover:scale-105 duration-300 p-6 flex flex-col items-center text-center"
              >
            <div className="text-green-600 text-4xl mb-4">{item.icon}</div>
            <h3 className="text-sm font-semibold text-gray-700">{item.title}</h3>
          </a>
    ))}
  </div>
</section>

      </div>
      
      
    </>
  )
}

export default Home
