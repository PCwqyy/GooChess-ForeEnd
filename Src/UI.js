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
	ele.innerHTML=`<div class="iconArea">
			<div class="icon"></div>
			${code?`<div class="code">${code}</div>`:''}
		</div>
		<div class="content">${Text.Replace(message)}</div>`;
	NotifyHome.appendChild(ele);
	ele.scrollIntoView({behavior:'smooth',block:'end'});
	await Sleep(message.length*50+2000);
	ele.classList.add('fade');
	NotifyCount--;
	if(NotifyCount===0)
	{
		await Sleep(500);
		if(NotifyCount===0)
			NotifyHome.innerHTML='';
	}
}

class Button{
	constructor(text,action)
	{
		this.text=Text.Replace(text);
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
	if(options.find(f=>f.text==='close')===undefined)
		hideOnClick=true;
	const buttonArea=popup.querySelector('.buttons');
	for(var t of options)
	{
		if(!(t.action instanceof Function))
			t.action=options.find(f=>f.text===t.action).action||(()=>{});
		if(t.text==='close')
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
		if(t.text===defaultAction)
			btn.classList.add('default');
		buttonArea.appendChild(btn);
	}
	console.log(options);
}

Debug.Notify=Notify;
Debug.PopUp=()=>{
	PopUp('Hello','Are you suck?',[
		new Button('Yes',()=>{Notify('debug','yes!')}),
		new Button('No',()=>{Notify('debug','no!')}),
		new Button('close','Yes')
	],'Yes',false);
}