// CSS

//React
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

//antd
import { Breadcrumb, ConfigProvider } from 'antd';


const BookingBanner = (props) => {

    const { Name, img, Back } = props

    const imgref = useRef()
    const Navigate = useNavigate()

    useEffect(() => {
        imgref.current.style.backgroundImage = `url(${img})`;
        imgref.current.style.backgroundRepeat = 'no-repeat';
        imgref.current.style.backgroundPosition = 'center';
        imgref.current.style.backgroundSize = 'cover';

    }, [])

    const BackToCar = () => {
        Back()
    }

    const BackToHome = () => {
        Navigate('/')
    }

    return (
        <div ref={imgref} className='relative text-white w-full h-[60vh] z-30'>
            <div className="absolute w-full h-[60vh] bg-black/80 z-10 pb-10">
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">{Name}</h1>
                    </div>
                    <div className="mt-4">
                        <ConfigProvider
                            theme={{
                                components: {
                                    Breadcrumb: {
                                        separatorColor: '#fff',
                                        itemColor: '#fff'
                                    },
                                },
                            }}
                        >
                            <Breadcrumb
                                items={[
                                    {
                                        title: <p onClick={BackToHome} className='cursor-pointer hover:underline'>Home</p>,
                                    },
                                    {
                                        title: <p onClick={BackToCar} className='cursor-pointer hover:underline'>Our Cars</p>,
                                    },
                                    {
                                        title: <p>{Name}</p>,
                                    },
                                ]}
                            />
                        </ConfigProvider>

                    </div>
                </div>

            </div>



        </div>
    );
}

export default BookingBanner;