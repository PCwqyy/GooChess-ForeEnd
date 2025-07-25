import * as Text from "./Lang.js";
const Sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
let NotifyHome=document.createElement('div');
NotifyHome.id='NotifyHome';
document.body.appendChild(NotifyHome);
let NotifyCount=0;
export async function Notify(type='info',message,code=''){
	NotifyCount++;
	const ele=document.createElement('div');
	ele.className=`notify ntf-${type}`;
	ele.innerHTML=`<div class="iconArea">
			<div class="icon"></div>
			<div class="code">${code}</div>
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