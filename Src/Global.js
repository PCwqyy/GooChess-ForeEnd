// Language
var Lang;

var ThisPageName;
var Metas=document.getElementsByTagName('meta');
for(var ele of Metas){
	if(ele.name=='PageName')
		ThisPageName=ele.content;
}
var NeedTrans=document.getElementsByClassName('TRANS');
function InitLang(){
	for(var ele of NeedTrans)
		ele.setAttribute('OriText',`${ele.textContent}`);
}
async function SetLang(lang){
	await fetch(`/Assets/Lang/${lang}.json`)
		.then((response)=>{
			return response.json();
		})
		.then((data)=>{
			Lang=data;
		});
	for(var ele of NeedTrans)
		ele.innerHTML=Lang[ThisPageName][ele.getAttribute('OriText')];
	return true;
}
function SetLangByCookie(){
	var lang=getCookie('lang');
	if(lang==null||lang=='')
		lang='zh-cn';
	SetLang(lang,true);
}
function SetLangByBrowser(){
	InitLang();
	var lang=navigator.languages;
	for(var i of lang)
	{
		try{
			if(SetLang(i))
				return;
		}
		catch(e){
			console.log(`SetLang(${i}) failed`);
		}
	}
}
SetLangByBrowser('zh-cn');