import React from 'react';
import { FaFacebook, FaFax, FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { BiSolidReport } from "react-icons/bi";

const Contact = () => {
  return (
    <><div className='bg-white'>
      {/* map */}
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6213.876146681148!2d100.51774506405884!3d13.862977231423525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29b5084ece23f%3A0xe837bdfa3dc9267f!2z4Liq4LiW4Liy4Lia4Lix4LiZ4LmC4Lij4LiE4LiX4Lij4Lin4LiH4Lit4LiB!5e0!3m2!1sth!2sth!4v1747110959038!5m2!1sth!2sth"
            width= ""
            height=""
            className="w-screen  h-[250px] md:h-[250px] lg:h-[350px] xl:h-[450px]"
            style={{ border: 3, borderRadius: 20 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="แผนที่โรงพยาบาล"
          ></iframe>
      
      
          {/* หัวติดต่อเรา */}
          
            
          
          <div className='mt-10 mb-10 flex justify-around flex-col items-center space-y-3 '>
            <h1 className='text-center xl:text-5xl lg:text-5xl md:text-4xl sm:text-3xl text-2xl
            font-bold text-green-700 '>ติดต่อ
              <span className='text-green-600'>เรา</span>
            </h1>
            <p className='text-center font-medium  mb-2 mt-2
            xl:text-2xl lg:text-xl md:text-lg sm:text-md text-md
            xl:ml-[10rem] xl:mr-[10rem] lg:ml-[10rem] lg:mr-[10rem] md:ml-[10rem] md:mr-[10rem] 
            sm:ml-[5rem] sm:mr-[5rem] ml-[2rem] mr-[2rem] text-gray-700'> 
              เป็น<span className='xl:text-3xl lg:text-2xl md:text-xl sm:text-lg text-lg
               text-green-600 font-bold'> ผู้นำการพัฒนาบริการ </span>
              ทางการแพทย์และวิชาการด้าน 
              <span className='xl:text-3xl lg:text-2xl md:text-xl sm:text-lg  text-lg
               text-red-500 font-bold'> โรคหัวใจและปอด  </span>
              ด้วยเทคโนโลยีที่ทันสมัยและสมคุณค่า</p>
          </div>

          {/* รายละเอียดติดต่อ */}
          <div className="flex items-center justify-center pb-[8rem] ">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[8rem] 
              
              ">
                {/* Card 1 */}
                <div className="bg-white w-80 h-100 text-center rounded-3xl flex-col  
                shadow-xl flex items-center justify-center gap-10 
                hover:scale-105 transition duration-300 ease-in-out ">
                
                  {/* squire + icon */}
                  <div className='mt-[12rem]'>
                    <div className="size-30 bg-amber-100 rounded-full flex items-center justify-center shadow-lg 
                    ">
                      <h1 className="text-2xl font-bold ">
                        <a href="https://maps.app.goo.gl/ePKVXGMgAbyWeZtP7" target="_blank" rel="noopener noreferrer">
                        <FaMapMarkerAlt className="text-5xl text-amber-500 "/>
                        </a>
                      </h1>
                    </div>
                  </div>
                  {/* ที่อยู่ */}
                  <div className='flex flex-col items-center justify-center '> 
                      <h1 className="text-2xl font-bold text-amber-500 space-x-2">
                          ที่อยู่
                      </h1>
                      <p className='text-center ml-10 mr-10 font-meduim text-black text-lg mb-[15rem]'>
                        <a href="https://maps.app.goo.gl/ePKVXGMgAbyWeZtP7" 
                        className="flex items-center gap-2 hover:underline 
                        hover:scale-105 transition duration-300 ease-in-outeffect hover:text-amber-500 "
                        target="_blank" rel="noopener noreferrer ">
                        74 ถ.ติวานนท์ ต.บางกระสอ อ.เมือง นนทบุรี 11000
                        </a>
                      </p>
                    </div>
                </div>

                {/* Card 2 */}
              <div className="bg-white w-80 h-100 text-center rounded-3xl space-y-5 flex-col  
                shadow-xl flex items-center justify-center hover:scale-105 transition duration-300 ease-in-out ">
                  <div className="size-30 bg-green-600 rounded-full flex items-center justify-center shadow-lg ">
                    <h1 className="text-2xl font-bold ">
                      <BsFillTelephoneFill className="text-5xl text-green-100" /></h1>
                  </div>
                  <h1 className="text-2xl font-bold text-green-600">เบอร์โทรติดต่อ  </h1>
                  <p className='text-center ml-10 mr-10 font-meduim text-black grid grid-cols-1'>
                     <a href="tel:+6625470999"
                        className="flex items-center gap-2 hover:underline 
                        hover:scale-105 transition duration-300 ease-in-outeffect hover:text-green-500"
                        target="_blank" rel="noopener noreferrer">
                        <BsFillTelephoneFill className="text-lg" />
                        02-547-0999
                      </a>
                    <br />
                    <a href="tel:+6625470999"
                    className="flex items-center gap-2 hover:underline 
                        hover:scale-105 transition duration-300 ease-in-outeffect hover:text-green-500"
                    target="_blank" rel="noopener noreferrer">
                      <FaFax className="text-lg" />
                      02-547-0999
                    </a>
                    <br />
                    <a href="tel:+1668"
                      className="flex items-center gap-2 hover:underline 
                        hover:scale-105 transition duration-300 ease-in-outeffect hover:text-green-500"
                      target="_blank" rel="noopener noreferrer">
                      <FaHeart className='text-lg'/>
                      1668</a>
                  </p>
                </div>    

                {/* Card 3 */}
              <div className="bg-white w-80 h-100 text-center rounded-3xl space-y-5 flex-col  
                shadow-xl flex items-center justify-center hover:scale-105 transition duration-300 ease-in-out ">
                  <div className="size-30 bg-indigo-700 rounded-full flex items-center justify-center shadow-xl">
                    <h1 className="text-2xl font-bold ">
                      <MdEmail className="text-5xl text-indigo-100" /></h1>
                  </div>
                  <h1 className="text-2xl font-bold text-indigo-700">ช่องทางการติดต่อ </h1>
                  <p className='text-center ml-10 mr-10 font-meduim text-black  '>
                     <a href="mailto:saraban@ccit.mail.go.th"
                        className="flex items-center gap-2 hover:underline 
                        hover:scale-105 transition duration-300 ease-in-outeffect hover:text-indigo-500"
                        target="_blank" rel="noopener noreferrer">
                        <MdEmail className="text-lg" />
                        saraban@ccit.mail.go.th
                      </a>
                    <br />
                    <a href="https://www.facebook.com/CentralChestInstituteOfThailandOfficial"
                    className="flex items-center gap-2 hover:underline 
                        hover:scale-105 transition duration-300 ease-in-outeffect hover:text-indigo-500"
                    target="_blank" rel="noopener noreferrer">
                      <FaFacebook className="text-lg" />
                      สถาบันโรคทรวงอก 
                    </a>
                    <br />
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSdRd4v0MGUpBAF5XtNtnun8tczK0fq-5SVp5tJuCgepo9PWEg/viewform"
                      className="flex items-center gap-2 hover:underline 
                        hover:scale-105 transition duration-300 ease-in-outeffect hover:text-indigo-500"
                      target="_blank" rel="noopener noreferrer">
                      <BiSolidReport className='text-lg'/>
                      แบบฟอร์มร้องเรียน
                    </a>
                  </p>
                </div> 
              </div>
          </div>
        </div>
    </>
  );
};

export default Contact;
