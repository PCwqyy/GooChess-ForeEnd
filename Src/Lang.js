var WordMap;
var ThisPageName=document.querySelector('meta[name="PageName"]').content;
var DefaultLang='zh-cn';

var Transes=document.getElementsByTagName('trans');
var Tranbs=document.getElementsByTagName('tranb');
export function Text(key){
	key=key.trim();
	var work;
	if(key.match(/^\$/))
		key=key.replace(/^\$/,`${ThisPageName}`),
		work=WordMap["Page"][key];
	else
		work=WordMap[key];
	if(work==null)
	{
		console.warn(`${key}: Unknown trans key.`);
		return `unknown.${key}`;
	}
	return work;
}
/** Replace all `^{key}` in text with the corresponding translation */
export function Replace(text)
{
	return text.replaceAll(/\^\{(.+?)\}/g,(match,key)=>{
		return Text(key);
	});
}
async function FetchLang(lang)
{
	await fetch(`/Assets/Lang/${lang}.json`)
		.then((response)=>{
			return response.json();
		}).then((data)=>{
			WordMap=data;
		});
}
function ModifyDoc(eles){
	for(var ele of eles)
	{
		ele.innerHTML=Text(ele.textContent);
		ele.classList.add('t');
		if(ele.getAttribute('href')!==null)
			ele.addEventListener('click',(e)=>{
				window.location.href=e.target.getAttribute('href');
			});
	}
}
async function SetLang(lang){
	if(lang==null||lang=='')
		lang=DefaultLang;
	if(lang=='art-pc')
		document.body.classList.add('pclang');
	else
		document.body.classList.remove('pclang');
	await FetchLang(lang);
	ModifyDoc(Transes);
	ModifyDoc(Tranbs);
	return true;
}
async function TrySetLang(lang){
	try{
		return await SetLang(lang);
	}
	catch(e){
		console.warn(`SetLang(${lang}) failed:`,{e});
		return false;
	}
}
function SetLangByCookie(){
	var lang=getCookie('lang');
	if(lang==null||lang=='')
		lang='zh-cn';
	TrySetLang(lang);
}
function SetLangByBrowser(){
	var lang=navigator.languages;
	for(var i of lang)
		if(TrySetLang(i.toLowerCase()))
		{
			console.log(`SetLangByBrowser: ${i}`);
			return;
		}
}

SetLangByBrowser();