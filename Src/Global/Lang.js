import './Debug.js'
import * as UIlib from './UI.js'
const Sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));

var WordMap;
var ThisPageName=document.querySelector('meta[name="PageName"]').content;
var DefaultLang='zh-cn';

var Transes=document.getElementsByTagName('trans');
var Tranbs=document.getElementsByTagName('tranb');

var Translated=false;

/**
 * Parse `key`
 * @param {String} key
 * @param {Array<any>} param
 * @returns {String}
 */
export function Text(key,param=[])
{
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
		if(param.length>0)
			work=work.replaceAll(/\$(\d+)/g,(match,index)=>{
				return param[index]||match;
			});
		return work;
	}catch(e){
		console.error(`Text(${key}) failed:\n`,e);
		return key;
	}
}

/**
 * Qurey if `key` exsit
 * @param {String} key
 * @returns {Boolean}
 */
export function Has(key){
	try{
		key=key.trim();
		var work;
		if(key.match(/^\$/))
			key=key.replace(/^\$/,`${ThisPageName}`),
			work=WordMap["Page"][key];
		else
			work=WordMap[key];
		return work!=null;
	}catch(e){
		return false;
	}
}
function GenTransableEle(key,param=[]){
	var p="";
	param.forEach((v)=>{p+=v+','});
	return `<trans class="t" localekey="${key}" param="${p}">
		${Text(key,param)}
	</trans>`;
}
export function SetEleTransable(ele,key,param){
	ele.innerHTML=GenTransableEle(key,param);
}
/**
 * Replace all `^{key}` in text with the corresponding translation
 * @param {String} text
 * @param {Boolean} genEle the text will change with lang or not 
 * @returns {String}
 */
export function Replace(text,genEle=true)
{
	return text.replaceAll(/\^\{([\.\w\$]+)(,.+)*\}/g,(match,key,value)=>{
		var func=genEle?GenTransableEle:Text;
		if(value==null||value=='')
			return func(key);
		return func(key,value.split(','));
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
}
async function SetLangByCookie(){
	var lang=getCookie('lang');
	if(lang==null||lang=='')
		lang='zh-cn';
	await TrySetLang(lang);
}
async function SetLangByBrowser(){
	if(Translated)	return;
	var lang=navigator.languages;
	for(var i of lang)
		if(await TrySetLang(i.toLowerCase()))
		{
			console.log(`SetLangByBrowser: ${i}`);
			Translated=true;
			window.localStorage.setItem('WordMap',JSON.stringify(WordMap));
			return;
		}
	UIlib.Notify('error',
		`语言包加载失败，请尝试刷新页面或检查网络连接<br>
		Language packes loading failed, 
		try refreshing the page or checking your network connection`);
}

await SetLangByBrowser();
Debug.SetLang=SetLang;