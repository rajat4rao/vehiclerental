const Amount=(start_date,drop_date,price)=>
{

    var bookedstartdate=Number(start_date.split("-")[2]);
    var bookeddropdate=Number(drop_date.split("-")[2]);
    var bookedstartmonth=Number(start_date.split("-")[1]);
    var bookeddropmonth=Number(drop_date.split("-")[1])
    var bookedstartyear=Number(start_date.split("-")[0]);
    var bookeddropyear=Number(drop_date.split("-")[0]);
    var days_in_each_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    var amt=0;
    var duration=0;

    if(bookedstartyear===bookeddropyear)
    {
        if(bookedstartmonth===bookeddropmonth)
        {
            let sday=Math.abs((bookedstartdate-bookeddropdate))+1
            duration=sday
                amt=sday *Number(price)
        }
        else if(bookedstartmonth===(bookeddropmonth-1))
        {
            let sday=Math.abs(bookedstartdate-days_in_each_month[bookedstartmonth-1])+1
            let dday=Math.abs(bookeddropdate-1)+1
            duration=sday+dday

            amt=(sday+dday)*Number(price)
        }
    }
    else if(bookedstartyear===bookeddropyear-1)
    {
            let sday=Math.abs(bookedstartdate-days_in_each_month[bookedstartmonth-1])+1
            let dday=Math.abs(bookeddropdate-1)+1
            amt=(sday+dday)*Number(price)
            duration=sday+dday

    }

    return  {amt,duration};
}


export default Amount;