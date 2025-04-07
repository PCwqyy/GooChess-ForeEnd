window.matchMedia('(prefers-color-scheme: dark)')
	.addEventListener('change',()=>{
		document.body.style.dark
	}
);

var L=new Lang;
L.setLocale('zh');
L.setFallback('en');
var ThisPageName;
var Metas=document.getElementsByTagName('meta');
for(var ele of Metas){
	if(ele.name=='PageName')
		ThisPageName=ele.content;
}
var NeedTrans=document.getElementsByClassName('TRANS');
async function SetLang(lang,init=false){
	if(init)
	{
		for(var ele of NeedTrans)
			ele.setAttribute('OriText',`${ThisPageName}.${ele.textContent}`);
		await fetch('../Lang.json')
			.then((response)=>response.json())
			.then((data)=>{
				L.setMessages(data);
			});
	}
	L.setLocale(lang);
	for(var ele of NeedTrans)
		ele.innerHTML=L.get(ele.getAttribute('OriText'));
}
SetLang('zh',true);
