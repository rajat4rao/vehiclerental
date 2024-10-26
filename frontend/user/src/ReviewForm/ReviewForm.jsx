//React
import axios from "../api/axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

//CSS
import './ReviewForm.css'

//Antd-Framework
import { Rate } from "antd"

const ReviewForm=()=>
{
    const user=useSelector((state)=>state.user)

    const [loading,Setloading]=useState(true)
    const [Ack,SetAck]=useState(false)
    const [Reviewdata,SetReviewData]=useState({uid:user.uid,car_no:`${sessionStorage.getItem('Review_car_no')}`,car_review:'',general_review:'',overall_rating:'',ratings:''})
    const [Errmsg,SetErrmsg]=useState({car_review:'',general_review:''})
    const [ratings, Setratings] = useState(2.5) ;
    const [overall_ratings, Setoverallratings] = useState(2.5) ;

    const[Name,SetName]=useState()

    const Navigate=useNavigate()

    const desc = ['terrible', 'bad', 'normal', 'good','wonderful'];
   

    const getUserDetails=async(uid)=>
    {
        const {data}=await axios.post('/findusername',{uid})
        SetName(data.name)
        Setloading(false)
    }


    useEffect(()=>{
        if(user.isAuth && sessionStorage.getItem('Review_car_no'))
        {
            getUserDetails(user.uid)
        }
        else
        {
            if(!user.isAuth)
            {
                Navigate('/Login')
            }
            else
            {
                Navigate('/ViewBooking')
            }
        }
        Setloading(false)
    },[])

    const ReviewChange=(e)=>
    {
        const {name,value}=e.target;
        SetReviewData({...Reviewdata,[name]:value.trim()})
    }

    const ValidateForm=()=>
    {
        if(Reviewdata.name==="" || Reviewdata.name===null)
        {
            SetErrmsg((prev)=>{return({...prev,name:'Enter your name'})})
            SetAck(true)
        }
        else
        {
            SetErrmsg((prev)=>{return({...prev,name:''})})
            SetAck(false)
        }

        if(Reviewdata.car_review==="" || Reviewdata.car_review===null)
        {
            SetErrmsg((prev)=>{return({...prev,car_review:'Enter the car review'})})
            SetAck(true)
        }
        else
        {
            SetErrmsg((prev)=>{return({...prev,car_review:''})})
            SetAck(false)
        }

        if(Reviewdata.general_review==="" || Reviewdata.general_review===null)
        {
            SetErrmsg((prev)=>{return({...prev,general_review:'Enter the general review'})})
            SetAck(true)
        }
        else
        {
            SetErrmsg((prev)=>{return({...prev,general_review:''})})
            SetAck(false)
        }

        if(Reviewdata.car_no!=='' && Reviewdata.car_review!=='' && Reviewdata.general_review!=='')
        {
            SetReviewData((prev)=>{return({...prev,ratings:ratings,overall_rating:overall_ratings})})
            Reviewdata.ratings=ratings;
            Reviewdata.overall_rating=overall_ratings
            ReviewSubmit()
        }
    }

    const ReviewSubmit=async()=>
    {
        if(Reviewdata.car_no!=='' && Reviewdata.car_review!=='' && Reviewdata.ratings!='' && Reviewdata.general_review!=='' && Reviewdata.overall_rating!=='')
        {
            const {data}=await axios.post('/Reviews',Reviewdata);
            if(data.action)
            {
                sessionStorage.removeItem('Review_car_no')
                Navigate('/')
            } 
        }
     
    }

    if(loading)
    {
        return <h2>Loading</h2>
    }

    return(
        <div className="ReviewForm">
          <div className="ReviewForm-Form">
          <div className="ReviewForm-Name">
                <label htmlFor="">Name:</label>
                <input type="text" onChange={ReviewChange}  value={Name} readOnly/>
           </div>

           <div className="ReviewForm-div">
                <div className="ReviewForm-div-1">
                    <div className="ReviewForm-ReviewCar">
                        <label htmlFor="">About the Car:</label>
                        <textarea name="car_review" onChange={ReviewChange} placeholder="Share a review about the car" required ></textarea>
                        {Ack?(<span>{Errmsg.car_review}</span>):(<span>{Errmsg.car_review}</span>)}
                    </div>
                    <div className="ReviewForm-RatingCar">
                        <label htmlFor="">Ratings:</label>
                        <Rate tooltips={desc} allowHalf  onChange={Setratings} value={ratings} />
                        {ratings}
                    </div>
                </div>
                <div className="ReviewForm-div-2">
                    <div className="ReviewForm-ReviewOverall">
                        <label htmlFor="">About us:</label>
                        <textarea name="general_review" onChange={ReviewChange} placeholder="Share your overall website expereince" required ></textarea>
                        {Ack?(<span>{Errmsg.general_review}</span>):(<span>{Errmsg.general_review}</span>)}
                    </div>
                    <div className="ReviewForm-RatingCar">
                        <label htmlFor="">Ratings:</label>
                        <Rate tooltips={desc} allowHalf  onChange={Setoverallratings} value={overall_ratings} />
                        {overall_ratings}
                    </div>
                </div>
           </div>
           <div className="ReviewForm-Form-btns">
               <button onClick={ValidateForm}>Submit</button>
            </div>

          </div>
        </div>
    )
}

export default ReviewForm