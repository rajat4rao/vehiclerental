const Loading=()=>
  {
      return(
         <div className="flex justify-center items-center h-screen w-screen bg-gray-900">
           <div className='flex space-x-2'>
              <div className="w-5 h-5 rounded-full bg-red-600 animate-bounce-delay-100"></div>
              <div className="w-5 h-5 rounded-full bg-yellow-400 animate-bounce-delay-200"></div>
              <div className="w-5 h-5 rounded-full bg-blue-500 animate-bounce-delay-100"></div>
              <div className="w-5 h-5 rounded-full bg-green-500 animate-bounce-delay-200"></div>
          </div>
         </div>
      )
  }
  
  export default Loading;