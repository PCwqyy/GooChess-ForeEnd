window.matchMedia('(prefers-color-scheme: dark)')
	.addEventListener('change',()=>{
		document.body.style.dark
	}
);

const Translated=JSON.parse(`
{
	"zh.Editor":{
		"Apply":"应用",
		"Load":"加载"
	},
	"zh.Menu":{
		"Title":"Welcome to<br>Goochess",
		"SubTitle":"按任意键以继续",
		"Account":"账户",
		"Game":"游戏",
		"Wiki":"维基",
		"About":"关于"
	},
	"zh.Gaming":{
		"Scale":"缩放",
		"Menu":"主菜单",
		"Wiki":"Wiki",
		"Debug":"运行调试"
	},
	"zh.Wiki":{
		"Menu":"主菜单",
		"Game":"棋盘界面",
		"Editor":"棋盘编辑器",
		"DebugTip":"选择一个 .md 文件来查看"
	},
	"en.Editor":{
		"Apply":"Apply",
		"Load":"Load"
	},
	"en.Menu":{
		"Title":"Welcome to<br>Goochess",
		"SubTitle":"Press Any Key",
		"Account":"Account",
		"Game":"Game",
		"Wiki":"Wiki",
		"About":"About"
	},
	"en.Gaming":{
		"Scale":"Scale",
		"Menu":"Main Menu",
		"Wiki":"Wiki",
		"Debug":"Run Debug"
	},
	"en.Wiki":{
		"Menu":"Title Screen",
		"Game":"Gaming",
		"Editor":"Grood Editor",
		"DebugTip":"Choose a .md file to view"
	}
}
`);

var ThisPageName;
var Metas=document.getElementsByTagName('meta');
for(var ele of Metas){
	if(ele.name=='PageName')
		ThisPageName=ele.content;
}
var L=new Lang;
L.setMessages(Translated);
L.setLocale('zh');
L.setFallback('en');

/** @param {Array<HTMLElement>} eles */
function PolyLang(eles){
	for(var ele of eles)
		ele.innerHTML=L.get(`${ThisPageName}.${ele.textContent}`);
}

PolyLang(document.getElementsByTagName('a'));
PolyLang(document.getElementsByTagName('p'));
PolyLang(document.getElementsByTagName('span'));