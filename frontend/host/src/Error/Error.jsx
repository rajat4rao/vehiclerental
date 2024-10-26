//React
import { useNavigate } from 'react-router-dom';

const Error = () => {

  const Navigate=useNavigate()

  const GetBackHome=()=>
  {
    Navigate('/')
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-end bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('../Images/Error/ErrorCarImage.jpg')" }}>
      <div className="p-6 mr-4 bg-black bg-opacity-70 rounded-xl border border-gray-300 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-white">Error 404 - Page Not Found</h1>
        <h4 className="text-lg text-white">Sorry, this page isn't available</h4>
        <p className="text-white">The link you followed is probably broken or the page has been removed.</p>
        <div className="mt-4">
          <button onClick={GetBackHome} className="bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md">
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Error;