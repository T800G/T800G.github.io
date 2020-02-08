const DAYSTARTHH = 4; //day starts at 04:00h
var g_prevRow;
var g_prevColor;
var g_maxRowTime;
var g_currDay;

//needs HTML5 document
function AttachVisibilityEventHandler(vh)
{
	var stateKey, eventKey
	var	keys = {	hidden: "visibilitychange",
								webkitHidden: "webkitvisibilitychange",
								mozHidden: "mozvisibilitychange",
								msHidden: "msvisibilitychange" };						
	for (stateKey in keys)
	{
		if (stateKey in document)
		{
			eventKey = keys[stateKey];
			break;
		}
	}
	if (stateKey) document.addEventListener(eventKey, vh);
}


function LoadPage()
{
	var dateObj = new Date;
	g_currDay = dateObj.getDay();
	//console.log("LoadPage");
	g_prevRow = -1;
	g_maxRowTime = -1;
	setTimeout(JumpToTime, 0);
	//window.name = location.href
	window.addEventListener("focus", JumpToTime);
	AttachVisibilityEventHandler(JumpToTime);
}


function JumpToTime()
{
	console.log("JumpToTime");
	var dateObj = new Date;
	var sec;
	var idtime;
	var curtime = dateObj.getHours() * 60 + dateObj.getMinutes();
	if (curtime < DAYSTARTHH * 60) curtime += 1440; //vrijeme 0-4h
	//console.log("curtime="+curtime);
	
	if ((g_maxRowTime != -1) && (curtime > g_maxRowTime))
	{
		setTimeout(JumpToDay, 0);
		console.log("jump to next day");
		return;
	}
	

	if (g_currDay != dateObj.getDay())
	{
	console.log("g_currDay != dateObj.getDay");
		setTimeout(JumpToDay, 0);
		return;
	}

	var tr = document.getElementById("timetable").rows;
	var i = tr.length; //should be >0
	
	timeloop:
	while (i--)
	{
		idtime = parseInt(tr[i].getAttribute("id"), 10);
		if (-1 == g_maxRowTime) { g_maxRowTime = idtime; }
		
		if (curtime < idtime) { continue timeloop; }
		if ((curtime > idtime) && ((i + 1) < tr.length)) { i++; }
		//console.log("tr time="+tr[i].firstChild.innerHTML);
		if (g_prevRow != -1) { tr[g_prevRow].style.backgroundColor = g_prevColor; }
		g_prevRow = i;
		g_prevColor = tr[i].style.backgroundColor;
		tr[i].style.backgroundColor = "#e51400";
		
		tr[i].scrollIntoView(true);
		sec = 60 * (parseInt(tr[i].getAttribute("id"), 10) - curtime);
		sec = (sec > 0) ? (sec + (60 - dateObj.getSeconds())) : (60 - dateObj.getSeconds());
		//console.log("setTimeout " + sec.toString());
		setTimeout(JumpToTime, 1000 * sec);
		return;
	}
	console.log("i=" + (i));
	if (i == -1)
	{
		//vrijeme prije 04:00 / prije prvog vremena iz tablice
		if (g_prevRow != -1) { tr[g_prevRow].style.backgroundColor = g_prevColor; }
		g_prevRow = 0;
		g_prevColor = tr[0].style.backgroundColor;
		tr[0].style.backgroundColor = "#e74c3c";
		window.scrollTo(0,0);
	}

}


function JumpToDay()
{
	var x = "A";
	if (window.location.href.indexOf("#B") > -1){ x = "B";}

	var dateObj = new Date;
	switch (dateObj.getDay())
	{
    case 0: //Nedelja
			if (dateObj.getHours() < DAYSTARTHH) { location.replace("zetbus_S_" + x + ".html"); }
			else { location.replace("zetbus_N_" + x + ".html"); }
    break;
    case 6: //Subota
			if (dateObj.getHours() < DAYSTARTHH) { location.replace("zetbus_RD_" + x + ".html"); }
      else { location.replace("zetbus_S_" + x + ".html"); }
    break;
		case 1: //Pon
			if (dateObj.getHours() < DAYSTARTHH) { location.replace("zetbus_N_" + x + ".html"); }
      else { location.replace("zetbus_RD_" + x + ".html"); }		
		break;
    default: //Ut-Pet
			location.replace("zetbus_RD_" + x + ".html");
    }
}
