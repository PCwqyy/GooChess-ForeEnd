import { DebugScreen } from '../Debug.js';
import * as Text from '../Lang.js';
const Sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
var codeEle=document.querySelector('div#code');
var desEle=document.querySelector('div#description');
var tri=document.querySelector('div#triangle');

// [TODO]状态码应由后端填充
var code=301,scale=1,speed=1;

async function set(first=false)
{
	codeEle.style.fontSize=`${52-4*Math.max(3,Math.floor(Math.log10(Math.max(1,Math.abs(code)))))}vmin`
	codeEle.textContent=code;
	var t=`HTTPError.Description.${code<0?'n':''}${Math.abs(code)}`;
	if(Text.Has(t))
		desEle.innerHTML=Text.Replace(first?`^{${t}}`:`[^{${t}}]`);
	else
		desEle.innerHTML='';
}
set(true);
tri.addEventListener('click',async()=>{
	if(code==2147483647)	code++;
	else	code+=speed;
	if(code==2147483648)	code=-code;
	if(code>2000000000&&code!=2147483647)	code=2147483647,SetSpeed(1);
	set();
	scale-=0.1;
	tri.style.scale=Math.max(0.9,Math.min(1,scale));
	await Sleep(210);
	scale+=0.1;
	tri.style.scale=Math.max(0.9,Math.min(1,scale));
});

DebugScreen.AddLine('speed','Cilck speed: {s}');
function SetSpeed(s)
{
	speed=Math.max(-1000000000,Math.min(1000000000,Math.round(s)));
	DebugScreen.FlushLine('speed',{s:speed});
}
SetSpeed(1);
DebugScreen.AddButton('speed=1',()=>{SetSpeed(1)})
DebugScreen.AddButton('speed+1',()=>{SetSpeed(speed+1)})
DebugScreen.AddButton('speed-1',()=>{SetSpeed(speed-1)})
DebugScreen.AddButton('speed*10',()=>{SetSpeed(speed*10)})
DebugScreen.AddButton('speed/10',()=>{SetSpeed(speed/10)})
DebugScreen.AddButton('code=0',()=>{code=0;set();})
DebugScreen.AddButton('code=INT_MAX',()=>{code=2147483647;set();})

window.IWannaCheat=()=>{
	window.MakeMyClickUltra=()=>{
		SetSpeed(speed+2);
		window.MakeMyClickMoreUltra=()=>{
			SetSpeed(speed*10);
			return Text.Text('HTTPError.EasterEgg.MakeMyClickMoreUltra');
		};
		return Text.Text('HTTPError.EasterEgg.MakeMyClickUltra');
	};
	return Text.Text('HTTPError.EasterEgg.IWannaCheat');
};