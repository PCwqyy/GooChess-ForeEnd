console.log("Debugging enabled");
window.Debug={};

class DebugLine
{
	constructor(format)
	{
		this.format=format;
		this.ele=document.createElement("div");
		this.ele.className="DebugLine";
		this.ele.innerHTML=`<span></span>`;
		this.display=true;
	}
	GenText(args={})
	{
		return this.format.replaceAll(/{(\w+)}/g,(match,index)=>{
			return (typeof args[index]!=='undefined')?args[index]:match;
		});
	}
	Flush(args={})
	{
		if(!this.display)	return;
		this.ele.firstChild.innerText=this.GenText(args);
	}
	Switch()
	{
		this.display=!this.display;
		this.ele.style.display=this.display?"block":"none";
	}
}
class DebugScr
{
	constructor()
	{
		this.ele=document.createElement("div");
		this.ele.id="DebugScreen";
		document.body.appendChild(this.ele);
		this.ele.innerHTML=`
			<h2>Debug</h2>
			<div id="DebugLines"></div>
			<div id="DebugLinks"></div>
			<div id="DebugButtons"></div>`;
		document.addEventListener("keydown",(e)=>{
			if(e.key==="F3")
				this.Switch(),
				e.preventDefault();
		});
		this.lines={};
	}
	AddLine(name,format)
	{
		this.lines[name]=new DebugLine(format);
		this.lines[name].ele.id="db-"+name;
		this.ele.querySelector("#DebugLines").appendChild(this.lines[name].ele);
	}
	AddButton(name,onClick)
	{
		let button=document.createElement("div");
		button.className="DebugButton";
		button.innerText=name;
		button.addEventListener("click",(()=>{
			try{
				onClick();
				button.classList.remove("error");
			}catch(e){
				button.classList.add("error");
				console.error(e);
			}
		}).bind(button));
		this.ele.querySelector("#DebugButtons").appendChild(button);
	}
	AddLink(name,url)
	{
		let link=document.createElement("a");
		link.innerText=name;
		link.href=url;
		this.ele.querySelector("#DebugLinks").appendChild(link);
	}
	FlushLine(name,args={})
	{
		if(!this.lines[name]) return;
		this.lines[name].Flush(args);
	}
	Switch(){this.ele.classList.toggle("open");}
}
export let DebugScreen=new DebugScr();

DebugScreen.AddLink("Menu","/Src/Templates/Menu.html");
DebugScreen.AddLink("Wiki","/Src/Templates/Wiki.html");
DebugScreen.AddLink("Game","/Src/Templates/Gaming.html");
DebugScreen.AddLink("Editor","/Src/Templates/Editor.html");
DebugScreen.AddLink("Profile","/Src/Templates/Profile.html");
DebugScreen.AddLink("HTTPErr","/Src/Templates/HTTPErr.html");
DebugScreen.AddLink("PCLang","/Src/Templates/PCLangIME.html");

DebugScreen.AddLine("fps","{fps} FPS");
var tick=0,last=Date.now(),now;
function CalcFPS()
{
	tick++;
	if(tick>=30)
	{
		now=Date.now();
		DebugScreen.FlushLine("fps",{
			fps:Math.round(tick*1000/(now-last))
		});
		last=now;
		tick=0;
	}
	requestAnimationFrame(CalcFPS);
}
CalcFPS();