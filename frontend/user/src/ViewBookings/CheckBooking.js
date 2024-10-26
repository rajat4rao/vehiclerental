const CheckBooking= async(data,status)=>
{

        var todaymonth=new Date().getMonth();
        todaymonth=Number(todaymonth)+1;
        var todaydate=new Date().getDate();
        todaydate=Number(todaydate)
        var todayyear=new Date().getFullYear()
        todayyear=Number(todayyear)

        var flag=0;
        var newdata=[]
    
        for(let i=0;i<data.length;i++)
        {
            var bookedstartdate=Number(data[i].bookingDetails.start_date.split("-")[2]);
            var bookeddropdate=Number(data[i].bookingDetails.drop_date.split("-")[2]);
            var bookedstartmonth=Number(data[i].bookingDetails.start_date.split("-")[1]);
            var bookeddropmonth=Number(data[i].bookingDetails.drop_date.split("-")[1])
            var bookedstartyear=Number(data[i].bookingDetails.start_date.split("-")[0]);
            var bookeddropyear=Number(data[i].bookingDetails.drop_date.split("-")[0]);

            if(bookedstartyear===todayyear && bookeddropyear===todayyear)
            {
                if(bookedstartmonth===todaymonth && bookeddropmonth===todaymonth)
                {
                    if(todaydate>=bookedstartdate && todaydate<=bookeddropdate)
                    {
                        flag=1
                    }
                }
                else if(bookedstartmonth===todaymonth && bookeddropmonth===(todaymonth+1))
                {
                    if(todaydate>=bookedstartdate)
                    {
                        flag=1
                    }
                }
                else if(bookedstartmonth===(todaymonth-1) && bookeddropmonth===todaymonth)
                {
                    if(todaydate<=bookeddropdate)
                    {
                        flag=1
                    }
                }
                else if(bookedstartmonth<=todaymonth && bookeddropmonth>=todaymonth)
                {
                    flag=1
                }
            }
            else
            {
                if(todaymonth===12 && todaymonth===bookedstartmonth && bookeddropmonth===1 && todayyear===bookedstartyear)
                {
                    
                    if(todaydate>=bookedstartdate)
                    {
                        flag=1
                    }
                }
                else if(todaymonth===1 && todaymonth===bookeddropmonth && bookeddropmonth===1 && todayyear===bookeddropyear)
                {
                    if(todaydate<=bookeddropdate)
                    {
                        flag=1
                    }
                }
            }
    
                if(flag===1)
                {
                    flag=0;
                    if(status==="Active")
                    {
                        newdata.push(data[i])
                    }
                }
                else 
                {
                    flag=0
                    if(status==="Upcoming")
                    {
                        newdata.push(data[i])
                    }
                }
        }
    return newdata

}

export default CheckBooking