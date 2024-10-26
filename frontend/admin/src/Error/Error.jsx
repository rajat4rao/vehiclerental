//React
import { useNavigate } from 'react-router-dom';
import errorCarImage from '../Images/ErrorCarImage.jpg';

const Error = () => {
  const Navigate = useNavigate();

  const GetBackHome = () => {
    Navigate("/Dashboard");
  };

  return (
    <div className=" bg-cover bg-center bg-no-repeat w-screen h-screen flex flex-col justify-center items-end text-white" style={{ backgroundImage: `url(${errorCarImage})` }}>
      <div className="bg-black/70 backdrop-blur-sm rounded-md border border-gray-300/30 p-6 mr-4 md:mr-8 lg:mr-12"> 
        <h1 className="text-3xl font-bold mb-4">Error 404 - Page Not Found</h1>
        <h4 className="text-xl font-semibold mb-2">Sorry, this page isn't available</h4>
        <p className="mb-6">
          The link you followed is probably broken or the page has been removed.
        </p>
        <div className="">
          <button onClick={GetBackHome} className="bg-red-600 hover:bg-red-700 rounded px-6 py-3 text-lg font-medium transition-colors duration-300"> 
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;