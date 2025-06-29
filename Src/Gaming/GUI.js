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
		return `${minutes}`.padStart(2,'0')+':'+`${seconds}`.padStart(2,'0');
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
	constructor(text,author)
	{
		this.text=text;
		this.ProcessText();
		this.author=author;
		this.time=this.GetTimeNow();
	}
	GetTimeNow()
	{
		var date=new Date();
		return `${date.getHours()}`.padStart(2,'0')
		+':'+`${date.getMinutes()}`.padStart(2,'0')
		+':'+`${date.getSeconds()}`.padStart(2,'0');
	}
	GenHTML()
	{
		var message=document.createElement('div');
		message.classList.add('message');
		message.innerHTML=`<span class="author">${this.author}</span>
			<span class="time">${this.time}</span><br>
			<div class="text"><span class="word">${this.text}</span></div>`;
		return message;
	}
	ProcessText()
	{
		if(this.text.match(/f(\*\*|uc)k/gui)!==null||
			this.text.match(/(U|you|your)[\s\S]*(mom|m)/gui)!==null)
			this.text=this.text.replaceAll(/\byour\b/gui,'my'),
			this.text=this.text.replaceAll(/\byou\b/gui,'myself'),
			this.text=this.text.replaceAll(/U\b/gui,'I');
		if(this.text.match(/[超操草没][\s\S]*[妈马玛Mm]/gui)!==null)
			this.text=this.text.replaceAll(/[你泥尼]/gui,'我');
		if(this.text.match(/[你泥尼][\s\S]*[妈马玛Mm]/gui)!==null)
			this.text=this.text.replaceAll(/[你泥尼]/gui,'我');
		var res=this.text.match(/(傻逼|煞笔|笨蛋|蠢货|死鬼|傻叉|脑残|弱智|垃圾|废物|sb|fw)/ui);
		if(res!=null)
		{
			this.text=this.text.replaceAll(/你/g,'我');
			if(res.index==0)
				this.text='我是'+this.text;
		}
		this.text=this.text.replaceAll('\n','<br>');
		this.text=this.text.replaceAll('<','&lt;');
		this.text=this.text.replaceAll('>','&gt;');
		this.text=this.text.replaceAll(' ','&nbsp;</span><span class="word">');
	
	}
}
class ChatRoom
{
	constructor(element)
	{
		this.messages=[];
		this.element=element;
		this.observer=new MutationObserver((m)=>{
			m.forEach((mutation)=>
			{
				if(mutation.type==='childList')
					mutation.addedNodes.forEach((node)=>
					{node.scrollIntoView({block:'end',inline: 'nearest'});});
			});
		});
		this.observer.observe(this.element,{childList:true,subtree:true});
	}
	AddMessage(msg)
	{
		this.element.appendChild(msg.GenHTML());
		this.messages.push(msg);
	}
}
var ChatRoomMain=new ChatRoom(document.querySelector('div#chatMsgs'));

export function NewMsg(text,author)
{
	var msg=new Messages(text,author);
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

/* Records of each step */
class Record
{
	constructor(element)
	{
		/** @type {HTMLTableElement} */
		this.element=element;
		this.currentPlayer=1;
		this.records=[];
		this.round=0;
		this.observer=new MutationObserver((m)=>{
			m.forEach((mutation)=>
				{
					if(mutation.type==='childList')
						mutation.addedNodes.forEach((node)=>
					{
						node.scrollIntoView({block:'end',inline: 'nearest'});
						console.log('Mutation:',node);
					});
			});
		});
		this.observer.observe(this.element.parentElement,{childList:true,subtree:true});
	}
	AppendRecord(record)
	{
		if(this.currentPlayer===1)
			this.currentRow=document.createElement('tr'),
			this.currentRow.classList.add('recordRow'),
			this.element.tBodies[0].appendChild(this.currentRow),
			this.currentRow.innerHTML=
			`<td class="round">
				<span class="text">${++this.round}</span>
			</td>`;
		var cell=document.createElement('td');
		cell.classList.add('recordCell');
		cell.innerHTML=`<span class="text">${record}</span>`;
		this.currentRow.appendChild(cell);
		this.currentPlayer++;
		if(this.currentPlayer>3)
			this.currentPlayer=1;
	}
}
var RecordMain=new Record(document.querySelector('table#record'));
export function AddRecord(record)
{
	RecordMain.AppendRecord(record);
}