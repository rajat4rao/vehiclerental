//CSS

//React
import { useNavigate } from 'react-router-dom';


const Error = () => {

  const Navigate=useNavigate()

  const GetBackHome=()=>
  {
    Navigate('/')
  }

  return (
    <div className='ErrorPage'>
      <div className="ErrorPage-info">
              <h1>Error 404-Page Not Found</h1>
              <h4>Sorry this page isn't available</h4>
              <p>The link you followed is probably broken or the page has been removed.</p>
              <div className="ErrorPage-Footer">
                <button onClick={GetBackHome}>Go Back Home</button>
              </div>
      </div>
    </div>
  );
}

export default Error;
