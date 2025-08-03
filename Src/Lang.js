import * as UIlib from './UI.js'
var WordMap;
var ThisPageName=document.querySelector('meta[name="PageName"]').content;
var DefaultLang='zh-cn';

var Transes=document.getElementsByTagName('trans');
var Tranbs=document.getElementsByTagName('tranb');
export function Text(key){
	try{
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
			return `${key}`;
		}
		return work;
	}catch(e){
		console.error(`Text(${key}) failed:`,e);
		return key;
	}
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
		}).catch((error)=>{
			console.error(`FetchLang(${lang}) failed:`,{error});
			UIlib.Notify('warning',
			   `「${lang}」语言包加载失败，正在尝试更换语言……<br>
				"${lang}" language pack loading failed, trying another language...`);
		});
}
function ModifyDoc(eles){
	for(var ele of eles)
	{
		if(!ele.classList.contains('t'))
			ele.setAttribute('localekey',ele.innerHTML);
		ele.innerHTML=Text(ele.getAttribute('localekey'));
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
		console.warn(`SetLang(${lang}) failed:`,e);
		return false;
	}
	return true;
}
function SetLangByCookie(){
	var lang=getCookie('lang');
	if(lang==null||lang=='')
		lang='zh-cn';
	TrySetLang(lang);
}
async function SetLangByBrowser(){
	var lang=navigator.languages;
	for(var i of lang)
		if(await TrySetLang(i.toLowerCase()))
		{
			console.log(`SetLangByBrowser: ${i}`);
			return;
		}
	UIlib.Notify('error',
		`语言包加载失败，请尝试刷新页面或检查网络连接<br>
		Language packes loading failed, 
		try refreshing the page or checking your network connection`);
}

SetLangByBrowser();