//React
import { useEffect, useState } from 'react'
import axios from "../api/axios"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { PDFDownloadLink } from '@react-pdf/renderer'

//Modules
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import Loading from '../Loading/Loading'
import GraphCount from '../GraphCount'
import Pdf from '../PDF/Pdf'

//Antd-Framework
import { CheckSquareOutlined, CarOutlined, CodeSandboxOutlined, ArrowUpOutlined, BookOutlined, DollarCircleOutlined, StarFilled, DownloadOutlined } from '@ant-design/icons'
import { Empty } from 'antd';

//Chart
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

//Images
import Logo from '../Images/Logo.png'


const Dashboard = () => {
  const user = useSelector((state) => state.user)
  const [loading, Setloading] = useState(true)
  const [BookingList, SetBookingList] = useState([])
  const [CardsCount, SetCardsCount] = useState({})
  const [graphdata, Setgraphdata] = useState({ ActiveBookingcnt: '', UpcomingBookingcnt: '', PastBookingcnt: '' })

  const Navigate = useNavigate()

  const getBookingList = async (sid) => {
    const { data } = await axios.post('/BookingList', { sid })
    SetBookingList(data)
    Setloading(false)
  }

  const getUserCars = async (sid) => {
    const { data } = await axios.post('/UserCarsCount', { sid })
    SetCardsCount(data)
  }

  const getGraphDetails = async (sid) => {
    const { data } = await axios.post('/BookingsPerMonth', { sid })
    const Activecars = await GraphCount(data.ActiveBookings, "Active")
    const Upcomingcars = await GraphCount(data.ActiveBookings, "Upcoming")
    Setgraphdata((prev) => ({
      ...prev,
      ActiveBookingcnt: Activecars,
      UpcomingBookingcnt: Upcomingcars,
      PastBookingcnt: data.PastBooking,
    }));
  }

  const data = {
    labels: ['Active', 'Past', 'Upcoming'],
    datasets: [
      {
        label: 'My Bookings',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgb(255, 99, 132)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: [graphdata.ActiveBookingcnt, graphdata.PastBookingcnt, graphdata.UpcomingBookingcnt],
      },
    ],
  };

  useEffect(() => {
    if (user.isAuth) {
      getGraphDetails(user.sid)
      getBookingList(user.sid)
      getUserCars(user.sid)
    }
    else {
      Navigate('/')
    }
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex-1 bg-gray-100 ml-[15%] md:ml-[20%] overflow-x-hidden">
          <div className="w-full lg:w-4/5 px-4 py-8 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Total Cars", icon: <BookOutlined style={{ fontSize: '25px' }} />, value: CardsCount.carcount },
                { title: "Verified Cars", icon: <CheckSquareOutlined style={{ fontSize: '25px' }} />, value: CardsCount.verifycarcount },
                { title: "Bookings", icon: <CarOutlined style={{ fontSize: '25px' }} />, value: CardsCount.ActiveCars },
                { title: "Total Earnings", icon: <DollarCircleOutlined style={{ fontSize: '25px' }} />, value: `₹${CardsCount.TotalSum}` },
              ].map((card, index) => (
                <div key={index} className="bg-white border border-white rounded-lg shadow-md p-4 hover:border-green-500 transition-colors duration-300">
                  <div className="flex items-center">
                    {card.icon}
                    <h3 className="ml-2 text-lg font-medium">{card.title}</h3>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <h2 className="text-2xl font-bold ml-2">{card.value}</h2>
                    <ArrowUpOutlined style={{ fontSize: '30px', color: '#3f8600' }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Bar data={data} />
            </div>

            <div className="mt-8 bg-white border border-black rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CodeSandboxOutlined style={{ fontSize: '30px', marginRight: '0.5rem' }} />
                  <h3 className="text-lg font-medium">Booking List</h3>
                </div>
                <div>
                  <PDFDownloadLink document={<Pdf BookingList={BookingList} Logo={Logo} />} fileName='Bookings'>
                    <button className="bg-gray-800 hover:bg-gray-100 hover:text-black border border-gray-800 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
                      <DownloadOutlined style={{ marginRight: '0.25rem', fontSize: '18px' }} /> Download
                    </button>
                  </PDFDownloadLink>
                </div>
              </div>

              <div className="mt-4">
                <div className="bg-gray-200 grid grid-cols-7 gap-2 p-2 font-bold">
                  <div>Customer Name</div>
                  <div>Contact No</div>
                  <div>Car Number</div>
                  <div>Start Date</div>
                  <div>Drop Date</div>
                  <div>Total Cost</div>
                  <div>Ratings</div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {BookingList.length > 0 ? (
                    BookingList.map((data) => (
                      <div key={data._id} className="grid grid-cols-7 gap-2 p-2 even:bg-gray-300">
                        <div>{data.userdetails.name}</div>
                        <div>{data.userdetails.phone}</div>
                        <div>{data.bookingDetails.car_no}</div>
                        <div>{data.bookingDetails.start_date.split('-')[2]}-{data.bookingDetails.start_date.split('-')[1]}-{data.bookingDetails.start_date.split('-')[0]}</div>
                        <div>{data.bookingDetails.drop_date.split('-')[2]}-{data.bookingDetails.drop_date.split('-')[1]}-{data.bookingDetails.drop_date.split('-')[0]}</div>
                        <div>₹{data.bookingDetails.amount}</div>
                        <div><StarFilled /> {data.cardetails.ratings}</div>
                      </div>
                    ))
                  ) : (
                    <div className="h-48 flex justify-center items-center">
                      <Empty />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Dashboard;