import React from 'react';
import Logo from '../assets/logoNav.png'; // โลโก้เดียวกับ Navbar

const Footer = () => {
  return (
    
    <footer className="bg-gradient-to-r from-[#2E7D32] to-[#81C784] text-white pt-10 pb-6 px-6 md:px-16  
    w-screen flex flex-col items-center justify-center">
        
        <div className='grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-1  gap-[5rem]'>
          
            <div className="grid grid-cols-1 gap-[2rem]">
            <a href="https://www.ccit.go.th/" target="_blank" rel="noopener noreferrer">
              <ul className="flex flex-col items-center text-center"> 
              
                <li>
                  <img src={Logo} alt="Logo" className="w-20 h-20 mb-5" /> 
                </li>
                <li>
                  <h1 className="text-xl font-bold ">
                    สถาบันโรคทรวงอก
                    </h1>
                    </li>
                <li>
                  <h2 className="text-sm">
                    National Heart Institute
                  </h2>
                </li>
              </ul>  
            </a>
            </div>

            <div className='grid grid-cols-1 gap-2 justify-items-start'>
                <div>
                  <h1 className="text-lg font-bold ">
                    หน่วยงานที่เกี่ยวข้อง
                  </h1>
                  <p className='border mb-5'></p>
                    <ul> 
                      <li className="relative text-md">
                        <h1 className="gap-2 p-1 cursor-pointer">
                          <a href="https://www.moph.go.th/" target="_blank" rel="noopener noreferrer">
                          กระทรวงสาธารณสุข
                          </a>
                        </h1>
                      </li >
                                        
                      <li className="text-md">
                        <h1 className="gap-2 p-1 cursor-pointer">
                          <a href="https://www.ccit.go.th/" target="_blank" rel="noopener noreferrer">
                          กรมการแพทย์
                          </a>
                          </h1>
                        </li>
                      
                      <li className="text-md">
                        <h1 className="gap-2 p-1 cursor-pointer">
                          <a href="http://www.thaiheart.org/" target="_blank" rel="noopener noreferrer">
                          สมาคมแพทย์โรคหัวใจแห่งประเทศไทย ในพระบรมราชูปถัมภ์
                          </a>
                        </h1>
                      </li>
                    
                      <li className="text-md">
                        <h1 className="gap-2 p-1 cursor-pointer">
                          สมาคมพยาบาลทรวงอกแห่งประเทศไทย
                          <a href="http://www.thaicvtnurse.org/" target="_blank" rel="noopener noreferrer">
                          </a>
                        </h1>
                      </li>
                  </ul>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-2 justify-items-start'>
                <div>
                  <h1 className="text-lg font-bold ">
                    ติดต่อ :
                  </h1>
                  <p className='border mb-5'></p>
                    <ul> 
                      <li className="relative text-md">
                        <h1 className="gap-2 p-1 cursor-pointer">
                          ที่อยู่: 74 ถ.ติวานนท์ ต.บางกระสอ อ.เมือง นนทบุรี
                        </h1>
                      </li >
                                        
                      <li className="text-md">
                        <h1 className="gap-2 p-1 cursor-pointer">
                          โทร 02-547-0999
                          </h1>
                        </li>
                      
                      <li className="text-md">
                        <h1 className="gap-2 p-1 cursor-pointer">
                        แฟกซ์ 02-547-0935
                        </h1>
                      </li>
                    
                      <li className="text-md">
                        <h1 className="gap-2 p-1 cursor-pointer">
                        สายด่วนโรคหัวใจ 1668
                        </h1>
                      </li>
                  </ul>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-2 justify-items-start'>
                <div>
                  <h1 className="text-lg font-bold ">
                    การตรวจรักษา / อาการ :
                  </h1>
                  <p className='border mb-5'></p>
                    <ul> 
                      <li className="relative text-md">
                        <h1 className="gap-2 p-1 cursor-pointer">
                        คลินิกโรคหัวใจ ติดต่อ 02-547-0859
                        </h1>
                      </li >
                                        
                      <li className="text-md">
                        <h1 className="gap-2 p-1 cursor-pointer">
                        คลินิกโรคปอด ติดต่อ 02-547-0860
                          </h1>
                        </li>
                      
                      <li className="text-md">
                        <h1 className="gap-2 p-1 cursor-pointer">
                        คลินิกบุหรี่ ติดต่อ 02-547-0927
                        </h1>
                      </li>
                    
                      <li className="text-md">
                        <h1 className="gap-2 p-1 cursor-pointer">
                        คลินิกศัลยกรรม ติดต่อ 02-547-0883
                        </h1>
                      </li>

                      <li className="text-md">
                        <h1 className="gap-2 p-1 cursor-pointer">
                        คลินิก TB Clinic ติดต่อ 02-547-0415
                        </h1>
                      </li>
                  </ul>
                </div>
            </div>
          
        </div>
    </footer>
  );
};

export default Footer;
