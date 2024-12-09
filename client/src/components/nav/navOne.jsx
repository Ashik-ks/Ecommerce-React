import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileScreen, faCircleInfo, faTruck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from "react-router-dom";


function NavOne() {

  const handleRedirect = () => {
    window.location.href = "https://play.google.com/store/search?q=purple&c=apps&hl=en";
  };

  const navigate = useNavigate();
  const { id,usertype } = useParams();

  return (
    <>
      <div className='border-b border-gray-300'>
        <div className="container mx-auto px-4 ">
          <div>
            <div className="w-full  mt-1 p-2 mx-auto">
              <div className="flex flex-wrap">
                <div className="flex-1 hidden md:block" />
                <div className="flex flex-wrap justify-center md:justify-end space-x-4 w-full md:w-auto mr-4">
                  <div
                    className="flex items-center gap-2 md:border-r md:border-b-0 border-gray-300 pb-2 md:pb-0 md:pr-4 text-gray-700 text-xs"
                    onClick={handleRedirect}
                    style={{ cursor: 'pointer' }}  // Optional: to indicate that it's clickable
                  >
                    <FontAwesomeIcon icon={faMobileScreen} />
                    {" "}DOWNLOAD APP
                  </div>
                  <div className="flex items-center gap-2 md:border-r md:border-b-0 border-gray-300 pb-2 md:pb-0 md:pr-4 text-gray-700 text-xs">
                    <FontAwesomeIcon icon={faCircleInfo} />
                    {" "}SUPPORT
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 pb-2 md:pb-0 md:pr-4 text-xs" onClick={() => navigate(`/order/${id}/${usertype}`)}>
                    <FontAwesomeIcon icon={faTruck} />
                    TRACK ORDER
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavOne;

