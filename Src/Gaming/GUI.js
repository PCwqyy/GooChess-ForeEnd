import {PieceList} from "../Game.js";
import * as UIlib from '../UI.js';
var PieceMatch='\\[(';
for(var ele of PieceList)
	PieceMatch+='|'+ele;
PieceMatch+=')\\]';
var BkgMeta=document.querySelector('meta[name="Background"]');
var IsThinPage=window.innerWidth<=600;
window.addEventListener('resize',function(){
	IsThinPage=window.innerWidth<=600;
	console.log('IsThinPage:',IsThinPage);
});
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
	Timers[NowRunningTimer].Toggle();
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
		this.ProcessText();
		this.author=author;
		this.time=this.GetTime(time);
	}
	GetTime(time=Date.now())
	{
		var date=new Date(time);
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
		if(this.text.match(/[超操草没死][\s\S]*[妈马玛Mm]/gui)!==null)
			this.text=this.text.replaceAll(/[你泥尼]/gui,'我');
		if(this.text.match(/[你泥尼][\s\S]*[妈马玛Mm]/gui)!==null)
			this.text=this.text.replaceAll(/[你泥尼]/gui,'我');
		var res=this.text.match(/(傻逼|煞笔|笨蛋|蠢货|傻叉|脑残|弱智|垃圾|废物|sb|fw)/ui);
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
		this.text=this.text.replaceAll(/\((\d+,[a-z],[xvi]+)\)/gui,'<span class="pos">$1</span>');
		this.text=this.text.replaceAll(PieceMatch,'<span class="piece">$1</span>');
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

export function NewMsg(text,author,time=this.GetTime())
{
	var msg=new Messages(text,author,time);
	ChatRoomMain.AddMessage(msg);
}
export var InputEle=document.querySelector('#chatInput');
// 发送部分在 [./WebSocket.js] 中

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
		if(!IsThinPage)
			cell.scrollIntoView({block:'end',inline: 'nearest'});
		else
			this.element.scrollTo({
				top: this.element.scrollHeight});
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
const ActionSet={
	'resign':()=>{UIlib.Notify('debug','resign')},
	'tie':()=>{UIlib.Notify('debug','tie')},
	'TakeBack':()=>{UIlib.Notify('debug','TakeBack')},
	'hurryup':()=>{UIlib.Notify('debug','hurryup')}
}
var ActionEles=document.querySelectorAll('div#buttons span');
for(var ele of ActionEles)
	{ele.addEventListener('click',ActionSet[ele.id]);}