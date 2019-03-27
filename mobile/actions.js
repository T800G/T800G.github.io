var g_prevRow;
var g_prevColor;
var g_maxRowTime;
var DAYSTARTHH=4; //day start at 04:00h


function LoadPage()
{
	//console.log("LoadPage");
	g_prevRow=-1;
	g_maxRowTime=-1;
	setTimeout(JumpToTime,0);
	//window.name=location.href
}

function JumpToTime()
{
	//console.log("JumpToTime");
	var dateObj=new Date;
	var sec;
	var idtime;
	var curtime=dateObj.getHours()*60+dateObj.getMinutes();
	if (curtime < DAYSTARTHH*60 ) curtime +=1440; //vrijeme 0-4h
	//console.log("curtime="+curtime);
	
	if ((g_maxRowTime != -1) && (curtime > g_maxRowTime))
	{
		console.log("jump to next day");	
		setTimeout(JumpToDay,0);
		return;
	}
	
	
	
	
////////////////////////////////////////
if (sessionStorage.currDay)
{
	if (sessionStorage.currDay != dateObj.getDate())
	{
console.log("sessionStorage.currDay != dateObj.getDate");
		setTimeout(JumpToDay,0);
		return;
	}
}	
	
	
	
	
	var tr=document.getElementById("timetable").rows;
	var i=tr.length;//should be >0
	
	timeloop:
	while(i--)
	{
		idtime=parseInt(tr[i].getAttribute("id"), 10);
		if (-1==g_maxRowTime) {g_maxRowTime=idtime;}
		
		if (curtime < idtime) {continue timeloop;}
		if ((curtime > idtime) && ((i+1)<tr.length)) { i++; }
		//console.log("tr time="+tr[i].firstChild.innerHTML);
		
		if (g_prevRow != -1) { tr[g_prevRow].style.backgroundColor=g_prevColor; }
		g_prevRow=i;
		g_prevColor=tr[i].style.backgroundColor;
		tr[i].style.backgroundColor="#e74c3c";
		
		tr[i].scrollIntoView(true);
		
		sec=60*(parseInt(tr[i].getAttribute("id"), 10) - curtime);
		sec=(sec>0) ? (sec + (60-dateObj.getSeconds())) : (60-dateObj.getSeconds());
		//console.log("setTimeout " + sec.toString());
		setTimeout(JumpToTime, 1000*sec);
		return;

	}
	console.log("i="+(i));
	if (i==-1)
	{
		//vrijeme prije 04:00 / prije prvog vremena iz tablice
		if (g_prevRow != -1) { tr[g_prevRow].style.backgroundColor=g_prevColor; }
		g_prevRow=0;
		g_prevColor=tr[0].style.backgroundColor;
		tr[0].style.backgroundColor="#e74c3c";
		window.scrollTo(0,0);
	}

}


function JumpToDay()
{
	var dateObj=new Date;
	sessionStorage.currDay=dateObj.getDate();
	switch(dateObj.getDay())
	{
    case 0: //Nedelja
		if (dateObj.getHours() < DAYSTARTHH) {location.replace("zetbus_S_A.html");}
		else {location.replace("zetbus_N_A.html");}
        break;
    case 6: //Subota
		if (dateObj.getHours() < DAYSTARTHH) {location.replace("zetbus_RD_A.html");}
        else {location.replace("zetbus_S_A.html");}
        break;
	case 1: //Pon
		if (dateObj.getHours() < DAYSTARTHH) {location.replace("zetbus_N_A.html");}
        else {location.replace("zetbus_RD_A.html");}		
		break;
    default: //Ut-Pet
		location.replace("zetbus_RD_A.html");
    }
}