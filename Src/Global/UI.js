import * as Text from "./Lang.js";
const Sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));

function GlobalAppend(id,tag='div')
{
	var ele=document.createElement(tag);
	ele.id=id;
	document.body.appendChild(ele);
	return ele;
}

let NotifyHome=GlobalAppend('NotifyHome');
let NotifyCount=0;
export async function Notify(type='info',message,code='')
{
	NotifyCount++;
	const ele=document.createElement('div');
	ele.className=`notify ntf-${type}`;
	var LongStay=message.match(/^\{LONG\}/g);
	if(LongStay)
		message=message.replace(/^\{LONG\}/g,''),
		ele.classList.add('longStay');
	ele.innerHTML=`<div class="iconArea">
			<div class="icon"></div>
			${code?`<div class="code">${code}</div>`:''}
		</div>
		<div class="content">${Text.Replace(message)}</div>`;
	NotifyHome.appendChild(ele);
	ele.scrollIntoView({behavior:'smooth',block:'end'});
	await Sleep(message.length*50+(LongStay?20000:2000));
	ele.classList.add('fade');
	NotifyCount--;
	if(NotifyCount===0)
	{
		await Sleep(500);
		if(NotifyCount===0)
			NotifyHome.innerHTML='';
	}
}

export class PopUpOp{
	constructor(tag,text,action)
	{
		this.tag=tag;
		this.text=Text.Text(text);
		this.action=action;
	}
	genEle()
	{
		var btn=document.createElement('div');
		btn.className='button';
		btn.innerHTML=this.text;
		return btn;
	}
}
async function ClosePopUp(ele)
{
	ele.classList.add('fade');
	await Sleep(500);
	ele.remove();
}
let PopUpHome=GlobalAppend('PopUpHome');
export async function PopUp(title,content,options=[],defaultAction='default',hideOnClick=true)
{
	const popup=document.createElement('div');
	popup.className='popupWrap';
	popup.innerHTML=`<div class="popup">
			<div class="title">${Text.Replace(title)}</div>
			<div class="content">${Text.Replace(content)}</div>
			<div class="buttons"></div>
		</div>`;
	PopUpHome.appendChild(popup);
	if(options.find(f=>f.tag==='close')===undefined)
		hideOnClick=true;
	const buttonArea=popup.querySelector('.buttons');
	for(var t of options)
	{
		if(!(t.action instanceof Function))
			t.action=options.find(f=>f.tag===t.action).action||(()=>{});
		if(t.tag==='close')
		{
			const closeButton=document.createElement('div');
			closeButton.className='close';
			closeButton.addEventListener('click',async()=>{
				t.action();
				await ClosePopUp(popup);
			});
			popup.firstChild.appendChild(closeButton);
			continue;
		}
		let tt=t;
		var btn=tt.genEle();
		btn.addEventListener('click',(async()=>{
			tt.action();
			if(hideOnClick)
				await ClosePopUp(popup);
		}));
		if(t.tag===defaultAction)
			btn.classList.add('default');
		buttonArea.appendChild(btn);
	}
}

// [TODO] Tips 纳入 UI 库
var Tip=document.createElement('span');
var ShiftEnabled=false,HoverEle=document.body;
document.body.appendChild(Tip);
Tip.id='Tip';
async function FillTip()
{
	var t=HoverEle.getAttribute(ShiftEnabled?'shiftTip':'tip');
	if(!t)	t=HoverEle.getAttribute('tip')||'';
	Tip.innerHTML=Text.Replace(t);
}
document.addEventListener('keydown',(e)=>{
	if(e.key!='Shift')	return;
	ShiftEnabled=true;
	FillTip();
})
document.addEventListener('keyup',(e)=>{
	if(e.key!='Shift')	return;
	ShiftEnabled=false;
	FillTip();
})
export function AddTip(ele,tip,shiftTip='')
{
	ele.setAttribute('tip',tip);
	if(shiftTip.length>0)
		ele.setAttribute('shiftTip',shiftTip);
	ele.addEventListener('mouseenter',(e)=>{
		HoverEle=e.target;
		FillTip();
		Tip.style.opacity=0.8;
	});
	ele.addEventListener('mouseleave',(e)=>{
		Tip.style.opacity=0;
	});
	ele.addEventListener('mousemove',(e)=>{
		Tip.style.left=`${e.clientX+10}px`;
		Tip.style.top=`${e.clientY+10}px`;
	});
	ele.addEventListener('wheel',(e)=>{
		Tip.style.left=`${e.clientX+10}px`;
		Tip.style.top=`${e.clientY+10}px`;
	});
	
}
function InitTip(selector)
{
	var eles=document.querySelectorAll(selector);
	for(var ele of eles)
		if(ele.getAttribute('tip'))
			AddTip(ele,ele.getAttribute('tip'),ele.getAttribute('shiftTip')||'');
}
InitTip('span,div,a,trans,tranb');