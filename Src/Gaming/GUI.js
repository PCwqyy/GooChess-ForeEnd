var BkgMeta=document.querySelector('meta[name="Background"]');
class Timer
{
	/**
	 * @param {Number} time
	 * @param {HTMLElement} element
	 * @param {HTMLElement} fatherEle
	 */
	constructor(time,element,fatherEle)
	{
		this.total=time;
		this.time=time;
		this.element=element;
		this.fatherEle=fatherEle;
		this.running=false;
		console.log('Ele:',element);
		element.textContent=this.ConvertFormat(time);
	}
	ConvertFormat(time)
	{
		var minutes=Math.floor(time/60);
		var seconds=time%60;
		return `${minutes<10?'0':''}${minutes}:${seconds<10?'0':''}${seconds}`;
	}
	Set(time)
	{
		this.time=time;
		this.element.textContent=time;
	}
	Toggle()
	{
		if(this.running)
			clearInterval(this.interval);
		else
			this.interval=setInterval(this.IntervalFunc.bind(this),1000);
		this.running=!this.running;
		this.fatherEle.classList.toggle('running',this.running);
		this.UpdBackground();
	}
	GetPercent(time=this.time){return time/this.total*100;}
	GetSpeed(time=this.time){return 8-Math.ceil(Math.log2(this.GetPercent(time)+1))}
	UpdBackground()
	{
		BkgMeta.setAttribute('content',`Slashes(
			${this.fatherEle.computedStyleMap().get('--hue')},
			${this.GetSpeed(this.time)})`);
	}
	IntervalFunc()
	{
		if(!this.running)	return;
		if(this.time<=0)	return;
		this.time--;
		this.element.textContent=this.ConvertFormat(this.time);
		this.fatherEle.style.setProperty('--time-percent',this.GetPercent()+'%');
		if(this.GetSpeed(this.time)!=this.GetSpeed(this.time+1))
			this.UpdBackground();
	}
}
/** @type {Timer[]} */
var Timers=new Array(3);
var NowRunningTimer=0;
export function InitTimers(time)
{
	var timeEle=document.querySelectorAll('div.timer');
	for(var i=0;i<Timers.length;i++)
		Timers[i]=new Timer(time,timeEle[i].querySelector('.time'),timeEle[i]);
	Timers[0].Toggle();
	BkgMeta.setAttribute('content',`Slashes(
		${Timers[0].fatherEle.computedStyleMap().get('--hue')},
		${Timers[0].GetSpeed()})`);
}
export function SwitchTimers()
{
	Timers[NowRunningTimer].Toggle();
	NowRunningTimer++;
	NowRunningTimer%=3;
	Timers[NowRunningTimer].Toggle();/* 
	BkgMeta.setAttribute('content',
		`Slashes(
			${Timers[NowRunningTimer].fatherEle.computedStyleMap().get('--hue')},
			${Timers[NowRunningTimer].GetSpeed()})`); */
}

class Messages
{
	/**
	 * @param {String} text
	 * @param {String} author
	 * @param {String} time
	 */
	constructor(text,author,time)
	{
		this.text=text;
		this.text=text.replaceAll('\n','<br>');
		this.text=text.replaceAll('<','&lt;');
		this.text=text.replaceAll('>','&gt;');
		this.author=author;
		this.time=time;
	}
	GenHTML()
	{
		var message=document.createElement('div');
		message.classList.add('message');
		message.innerHTML=`<span class="author">${this.author}</span>
			<span class="time">${this.time}</span><br>
			<span class="text"><span class="word">${this.text}</span></span>`;
		return message;
	}
}
class ChatRoom
{
	constructor(element)
	{
		this.messages=[];
		this.element=element;
	}
	AddMessage(msg)
	{
		this.element.appendChild(msg.GenHTML());
		this.messages.push(msg);
	}
}
var ChatRoomMain=new ChatRoom(document.querySelector('div#chatMsgs'));
function GetTimeNow()
{
	var date=new Date();
	return `${date.getHours()}:${date.getMinutes()}`;
}
export function NewMsg(text,author,time)
{
	var msg=new Messages(text,author,GetTimeNow());
	ChatRoomMain.AddMessage(msg);
}
var InputEle=document.querySelector('#chatInput');
InputEle.addEventListener('keydown',function(e){
	if(e.key==='Enter')
		SendMessage();
});
export function SendMessage()
{
	const text=InputEle.value.trim();
	if (text){
		NewMsg(text,'Me');/* 
		if (typeof socket!=='undefined'){
			socket.send(JSON.stringify({ type: 'chat', text }));
		} */
		InputEle.value = '';
	}
}