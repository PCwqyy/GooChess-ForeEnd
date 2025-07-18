export const Sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
// 常量
const RomeApl={
	1:'i',2:'ii',3:'iii',4:'iv',5:'v',
	6:'vi',7:'vii',8:'viii',9:'ix',10:'x',
	11:'xi',12:'xii',13:'xiii',14:'xiv',15:'xv',
	16:'xvi',17:'xvii',18:'xviii',19:'xix',20:'xx',
	21:'xxi',22:'xxii',23:'xxiii',24:'xxiv',25:'xxv',
	26:'xxvi',27:'xxvii',28:'xxviii',29:'xxix',30:'xxx'
};

const PieceList=
[
	"pawn","bishop","knight","rook","queen","king","gooshop","gooking",
	"fircar","seccar","hoorse","bomb","goobomb","stone","trap","rotator",
	"jumper","cannon","portal","diplomat","deaf","diploqueen","diportal",
	"employee","factory","product","pecookie","__hzx","yzy"
];
export var PieceMatch='^(';
for(var ele of PieceList)
	PieceMatch+='|'+ele;
PieceMatch+=')\\(\\d+,\\d+,\\d+\\)\\d*$';
const ClassNamesForSign={
	O:"oto",
	M:"moove",
	J:"jump",
	E:"effect"
};
// HTML操作
function ParseFromHTML(html){
	var parser=document.createElement('temp');
	parser.innerHTML=html;
	return parser.firstChild;
}
function SetElementPos(ele,pos){
	ele.style.left=`${pos.x}px`;
	ele.style.top=`${pos.y}px`;
}
function SetElementHue(ele,hue){
	ele.style.filter=(`hue-rotate(${hue}deg)`);
}
function SetElementUpSideDown(ele){
	ele.style.rotate='180deg';
}
function SetElementRotate(ele,angle){
	ele.style.rotate=`${angle}deg`;
}
function SetElementPieceType(ele,type){
	ele.style.backgroundImage=`url(${GetPieceIconPath(type)})`;
}
/** @returns {HTMLElement} */
function NewPerformer(Tag,Pos,...Class){
	var t=document.createElement(Tag);
	if(Pos!=null)
		SetElementPos(t,Pos);
	t.classList.add('perform',...Class);
	return t;
}


// 坐标
export class XY{
	x;y;
	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor(x,y)
	{
		this.x=x;
		this.y=y;
	}
	print(){return `${this.x},${this.y}`;}
	valueOf(){return this.print();}
}
export class NAR{
	num;alp;rom;
	/**
	 * @param {Number} num 
	 * @param {Number} alp 
	 * @param {Number} rom 
	 */
	constructor(num,alp,rom)
	{
		this.num=num;
		this.alp=alp;
		this.rom=rom;
	}
	print(plain=false)
	{
		if(plain)
			return `${this.num},${this.alp},${this.rom}`;
		return `${this.num}, ${String.fromCharCode(96+this.alp)}, ${RomeApl[this.rom]}`;
	}
	/**
	 * @param {NAR} pos
	 */
	delta(pos){
		return new NAR(this.num+pos.num,this.alp+pos.alp,this.rom+pos.rom);
	}
	valueOf(){return this.print(true);}
}
/**
 * @param {XY} a
 * @param {Number} rows
 */
export function XYtoNAR(a,rows){
	if(a instanceof NAR)	return a;
	if(a.x===-1)	return new NAR(-1,-1,-1);
	return new NAR(
		Math.floor(a.x/2)+1,
		Math.floor((2*rows+2*a.y-a.x)/2),
		rows-a.y+1);
}
/**
 * @param {NAR} a
 * @param {Number} rows
 */
export function NARtoXY(a,rows){
	if(a instanceof XY)	return a;
	if(a.alp===-1)	return new XY(-1,-1);
	var b=new XY(2*a.num-2,rows-a.rom+1);
	if(2*rows+2*b.y-b.x!=2*a.alp)	b.x++;
	return b;
}

/**
 * @param {XY|NAR} a
 * @param {XY|NAR} b
 */
function SamePos(a,b){
	a=XYtoNAR(a);
	b=XYtoNAR(b);
	return a.x===b.x&&a.y===b.y;
}

const BombRange={
	white:[new XY(-1,0),new XY(1,0),new XY(-1,-1)],
	black:[new XY(-1,0),new XY(1,0),new XY(1,1)]
};
const GoobombRange={
	white:[new XY(-1,0),new XY(1,0),new XY(-1,-1),new XY(-3,-1),new XY(1,-1),new XY(1,1)],
	black:[new XY(-1,0),new XY(1,0),new XY(1,1),new XY(3,1),new XY(-1,1),new XY(-1,-1)],
};
const RotatorRange={
	white:{
		1:[new NAR(0,0,1),new NAR(0,1,0),new NAR(1,0,0)],
		2:[new NAR(1,1,-1),new NAR(1,-1,1),new NAR(-1,1,1)],
		3:[new NAR(-1,-1,2),new NAR(-1,2,-1),new NAR(2,-1,-1)]
	},
	black:{
		1:[new NAR(-1,0,0),new NAR(0,-1,0),new NAR(0,0,-1)],
		2:[new NAR(-1,1,-1),new NAR(-1,-1,1),new NAR(1,-1,-1)],
		3:[new NAR(-2,1,1),new NAR(1,-2,1),new NAR(1,1,-2)]
	}
};
const DiplomatRange={
	white:[new NAR(0,0,1),new NAR(0,1,0),new NAR(1,0,0)],
	black:[new NAR(-1,0,0),new NAR(0,-1,0),new NAR(0,0,-1)]
};

/** @param {String} type */
export function GetPieceIconPath(type){
	return `/Assets/Pieces/${type}.svg`;
}

export class Piece{
	type;hue;element;
	/** 
	 * @param {String} t type
	 * @param {Number} h hue
	 */
	constructor(t,h)
	{
		this.element=document.createElement('piece');
		this.SetType(t);
		this.SetHue(h);
	}
	SetType(t){
		this.type=t;
		this.element.style.backgroundImage=`url(${GetPieceIconPath(t)})`;
	}
	/** @param {Number} h hue */
	SetHue(h){
		if(!h instanceof Number)
			return NaN;
		if(h===-1)
			this.element.style.filter=`brightness(2) grayscale(1)`;
		else
			this.element.style.filter=`hue-rotate(${h}deg)`
		this.hue=h;
	}
	Hide(){
		this.element.style.opacity='0';
	}
	Show(){
		this.element.style.opacity='1';
	}
}

// 布置棋盘
const Shooter={
	1:new XY(15,4),2:new XY(15,5),3:new XY(17,5),
	4:new XY(9,1),5:new XY(9,5),6:new XY(15,1),
	7:new XY(23,5),8:new XY(23,8),9:new XY(15,8)
};
const Side={num:'red',alp:'blue',rom:'yellow'};

export class Grood{
	rows;
	/** @type {Array<Array<HTMLElement>>} */
	cells;
	/** @type {HTMLElement} */
	visEle;
	/** @type {Map<String,Piece>} */
	pieces=new Map();
	element;Tip;Game;
	TipPlainPaint=false;PosInTip=new NAR(-1,-1,-1);
	/**
	 * @param {String} text
	 * @param {HTMLElement} parentElement
	 * @param {Function} clickFunc
	 */
	constructor(text='[12]',parentElement,clickFunc,game=false)
	{
		this.element=document.createElement('grood');
		this.Tip=document.createElement('span');
		this.Tip.classList.add('Tip');
		this.Game=game;
		this.ParseFromText(parentElement,text);
		parentElement.appendChild(this.element);
		this.element.addEventListener('click',clickFunc);
	}
	/** @param {XY} xy */
	XYtoNAR(xy){
		return XYtoNAR(xy,this.rows);
	}
	/** @param {NAR} nar */
	NARtoXY(nar){
		return NARtoXY(nar,this.rows);
	}
	DrawGrood(){
		this.element.setAttribute('rows',`${this.rows}`);
		this.visEle=document.createElement('div');
		this.visEle.classList.add('cells');
		this.element.appendChild(this.visEle);
		var row=new Array(this.rows*2);
		for(let i=1;i<this.rows*2;i++){
			row[i]=document.createElement('div');
			row[i].classList.add('row');
			this.cells[i]=new Array(this.rows);
			if(i%2===0)	row[i].classList.add('black');
			for(let j=1;j<=Math.floor((i-1)/2)+1;j++){
				this.cells[i][j]=document.createElement('cell');
				this.cells[i][j].setAttribute('x',`${i}`);
				this.cells[i][j].setAttribute('y',`${j}`);
				var show=document.createElement('span');
				this.cells[i][j].appendChild(show);
				if(this.Game)
				{
					// 确定shooter
					for(var q in Shooter)
						if(Shooter[q].x===i&&Shooter[q].y===j){
							this.cells[i][j].classList.add('shooter');
							break;
						}
					// 确定三方位置
					var thisNar=this.XYtoNAR(new XY(i,j));
					if(thisNar.num<=4)	this.cells[i][j].classList.add(Side.num);
					if(thisNar.alp<=4)	this.cells[i][j].classList.add(Side.alp);
					if(thisNar.rom<=4)	this.cells[i][j].classList.add(Side.rom);
				}
				this.cells[i][j].addEventListener('mouseenter',(e)=>{
					this.Tip.style.opacity=0.8;
					if(e.target.tagName!='CELL')	return;
					this.PosInTip=this.XYtoNAR(
						new XY(e.target.getAttribute('x'),e.target.getAttribute('y')));
					this.Tip.innerHTML=`${this.PosInTip.print(this.TipPlainPaint)}`;
				});
				row[i].appendChild(this.cells[i][j]);
			}
			this.visEle.appendChild(row[i]);
		}
		document.body.appendChild(this.Tip);
		this.element.addEventListener('mouseleave',()=>{
			this.Tip.style.opacity=0;
		});
		this.element.addEventListener('mousemove',(e)=>{
			this.Tip.style.left=`${e.clientX+10}px`;
			this.Tip.style.top=`${e.clientY+10}px`;
		});
		this.element.addEventListener('wheel',(e)=>{
			this.Tip.style.left=`${e.clientX+10}px`;
			this.Tip.style.top=`${e.clientY+10}px`;
		});
		document.body.addEventListener('keydown',(e)=>{
			if(e.key!='Shift')	return;
			this.TipPlainPaint=true;
			this.Tip.innerHTML=`${this.PosInTip.print(this.TipPlainPaint)}`;
		})
		document.body.addEventListener('keyup',(e)=>{
			if(e.key!='Shift')	return;
			this.TipPlainPaint=false;
			this.Tip.innerHTML=`${this.PosInTip.print(this.TipPlainPaint)}`;
		})
		return;
	}
	/**
	 * @param {HTMLElement} parentElement
	 * @param {String} text
	 */
	ParseFromText(parentElement,text){
		if(text.length===0)
			throw new Error('Empty text!');
		var res;
		this.ClearPieces();
		this.element.innerHTML='';
		// [size]
		this.rows=text.match(/^\[([1-9][0-9]*)\]$/m)[1];
		this.cells=new Array(this.rows*2);
		this.DrawGrood();
		parentElement.appendChild(this.element);
		// piece(N,A,R)hue
		res=text.match(new RegExp(PieceMatch,'gim'));
		if(res!=null)for(var i of res)
		{
			var type=i.match(/([a-z|A-Z])+/)[0];
			var tar=i.match(/\((\d+),(\d+),(\d+)\)(\d*)/);
			this.PlacePiece(new NAR(tar[1],tar[2],tar[3]),type,tar[4]==''?-1:tar[4]);
		}
		// tag(N,A,R)
		res=text.match(/^[OJME]!{0,1}\(\d+,\d+,\d+\)$/gm);
		if(res!=null)for(var i of res)
		{
			var tar=i.match(/\((\d+),(\d+),(\d+)\)/);
			var pos=new NAR(tar[1],tar[2],tar[3]);
			this.SetSign(pos,"sign",ClassNamesForSign[i[0]]);
			if(i[1]=='!')
				this.SetSign(pos,"only");
		}
		// (N1,A1,R1)->(N2,A2,R2)color
		res=text.match(/^\(\d+,\d+,\d+\)->\(\d+,\d+,\d+\).+$/gm);
		if(res!=null)
		{
			var svgHead=`<svg class="arrows" height="${this.visEle.offsetHeight}" width="${this.visEle.offsetWidth}"><defs>`;
			var svgBody=`</defs>`;
			for(var i in res)
			{
				var tar=res[i].match(/\((\d+),(\d+),(\d+)\)->\((\d+),(\d+),(\d+)\)(.+)/);
				var pos1=new NAR(tar[1],tar[2],tar[3]);
				var pos2=new NAR(tar[4],tar[5],tar[6]);
				var p1=this.QueryCellCenterClientPos(pos1);
				var p2=this.QueryCellCenterClientPos(pos2);
				svgHead+=`<marker id="arrow${tar[7]}" markerWidth="3" markerHeight="3" refX="1" refY="1.5" orient="auto">
							<path d="M 0 0 L 0 3 L 2 1.5 Z" fill="${tar[7]}" />
						</marker>`
				svgBody+=`<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"
					stroke="${tar[7]}" stroke-width="10" marker-end="url(#arrow${tar[7]})" />`
			}
			svgBody+=`</svg>`;
			var c=ParseFromHTML(svgHead+svgBody);
			this.element.appendChild(c);
		}
	}
	/** @param {NAR|XY} pos */
	CheckPosValid(pos){
		pos=this.NARtoXY(pos);
		if(pos.x===-1)	return true;
		if(pos.x>this.rows*2||pos.x<1)
			return false;
		if(pos.y>Math.floor((pos.x+1)/2)||pos.y<1)
			return false;
		return true;
	}
	/**
	 * @param {NAR|XY} pos
	 */
	GetPieceByPos(pos){
		pos=this.XYtoNAR(pos);
		if(!this.CheckPosValid(pos))
			return undefined;
		return this.pieces.get(pos.print(true));
	}
	/** @param {NAR|XY} pos */
	CheckCellEmpty(pos){
		return this.GetPieceByPos(pos)===undefined;
	}
	/** @param {NAR|XY} pos */
	CheckCellBlack(pos){
		pos=this.NARtoXY(pos);
		return pos.x%2===0;
	}
	/**
	 * @param {NAR|XY} pos
	 * @param {Piece} ch
	 */
	AppendPiece(pos,ch){
		pos=this.XYtoNAR(pos);
		if(!this.CheckPosValid(pos))	return;
		if(!this.CheckCellEmpty(pos))	return;
		this.pieces.set(pos.print(true),ch);
		if(pos.alp===-1)	return;
		var posN=this.NARtoXY(pos);
		this.cells[posN.x][posN.y].appendChild(ch.element);
	}
	/**
	 * @param {NAR|XY} pos
	 * @param {String} type
	 * @param {Number} hue
	 */
	PlacePiece(pos,type,hue){
		pos=this.XYtoNAR(pos);
		if(!this.CheckCellEmpty(pos))	return;
		var ch=new Piece(type,hue);
		this.AppendPiece(pos,ch);
		return ch;
	}
	/** @param {NAR|XY} pos */
	RemovePiece(pos){
		pos=this.XYtoNAR(pos);
		if(!this.CheckPosValid(pos))	return;
		if(this.CheckCellEmpty(pos))	return;
		if(pos.x!==-1)
			this.GetPieceByPos(pos).element.remove();
		this.pieces.delete(pos.print(true));
	}
	/**
	 * @param {NAR|XY} pos
	 * @param {Piece} ch
	 */
	ReplacePiece(pos,ch){
		pos=this.XYtoNAR(pos);
		if(!this.CheckPosValid(pos)) return;
		if(this.CheckCellEmpty(pos)) return;
		this.RemovePiece(pos);
		this.AppendPiece(pos,ch);
	}
	ClearPieces(){
		for(var i of this.pieces)
			i[1].element.remove();
		this.pieces.clear();
	}
	/**
	 * @param {NAR|XY} from
	 * @param {NAR|XY} to
	 */
	MovePiece(from,to){
		from=this.XYtoNAR(from);
		to=this.XYtoNAR(to);
		if(from===to)	return;
		if(!this.CheckPosValid(from))	return;
		if(!this.CheckPosValid(to))	return;
		if(this.CheckCellEmpty(from))	return;
		if(!this.CheckCellEmpty(to))	return;
		var c=this.GetPieceByPos(from);
		this.RemovePiece(from);
		this.AppendPiece(to,c);
	}
	/** @param {NAR|XY} pos */
	QueryPieceClientPos(pos){
		pos=this.NARtoXY(pos);
		var tar=this.cells[pos.x][pos.y];
		var measurer=document.createElement('piece');
		measurer.style.opacity='0';
		tar.appendChild(measurer);
		var posc=measurer.getBoundingClientRect();
		var posg=this.visEle.getBoundingClientRect();
		tar.removeChild(measurer);
		return {x:posc.x-posg.x,y:posc.y-posg.y};
	}
	/** @param {NAR|XY} pos */
	QueryCellCenterClientPos(pos){
		pos=this.NARtoXY(pos);
		var tar=this.cells[pos.x][pos.y];
		var black=this.CheckCellBlack(pos);
		return {
			x:tar.offsetLeft+tar.offsetWidth/2,
			y:tar.offsetTop+(black?1:2)/3*tar.offsetHeight,
		};
	}
	/** @param {NAR|XY} pos */
	SetSign(pos,...signs){
		if(pos instanceof NAR)
			pos=this.NARtoXY(pos);
		this.cells[pos.x][pos.y].classList.add(...signs);
	}
	async KillPiece(pos){
		pos=this.XYtoNAR(pos);
		if(!this.CheckPosValid(pos))	return;
		if(this.CheckCellEmpty(pos))	return;
		var ch=this.GetPieceByPos(pos);
		if(ch.type==='goobomb'||ch.type==='bomb')
			await this.AnimExplode(pos);
		else if(ch.type==='king')
			;// [TODO]:king die
		else
			await this.RemovePiece(pos);
	}

// ----------------------------带动画---------------------------
	/**
	 * @param {NAR|XY} pos
	 * @returns {HTMLElement}
	 */
	NewPerformerPiece(pos,...Class){
		pos=this.XYtoNAR(pos);
		var ch=this.GetPieceByPos(pos);
		var ele=NewPerformer('piece',
			this.QueryPieceClientPos(pos),...Class);
		SetElementPieceType(ele,ch.type);
		SetElementHue(ele,ch.hue);
		return ele;
	}
	/**
	 * @param {NAR|XY} pos
	 * @returns {HTMLElement}
	 */
	NewPerformerCell(pos,...Class){
		var ele=NewPerformer('span',this.QueryCellCenterClientPos(pos),...Class);
		if(this.CheckCellBlack(pos))
			SetElementUpSideDown(ele);
		return ele;
	}
	/**
	 * @param {NAR|XY} from
	 * @param {NAR|XY} to
	 */
	async AnimMove(from,to,shoot=false){
		from=this.XYtoNAR(from);
		to=this.XYtoNAR(to);
		if(this.CheckCellEmpty(from))	return;
		var eat=!this.CheckCellEmpty(to);
		var ch=this.GetPieceByPos(from);
		if(eat&&this.GetPieceByPos(to).hue===ch.hue)	return;
		var pPiece=this.NewPerformerPiece(from);
		var pCell=this.NewPerformerCell(from,'ShootLight');
		if(shoot)	this.visEle.appendChild(pCell);
		if(eat)
		{
			var pPiece2=this.NewPerformerPiece(to,'Eaten');
			this.KillPiece(to);
			this.visEle.appendChild(pPiece2);
		}
		this.visEle.appendChild(pPiece);
		await Sleep(shoot?1000:10);
		ch.Hide();
		this.MovePiece(from,to);
		SetElementPos(pPiece,this.QueryPieceClientPos(to));
		await Sleep(200);
		ch.Show();
		await Sleep(200);
		pPiece.remove();
		if(eat)	pPiece2.remove();
		if(!shoot)	return;
		await Sleep(1000);
		pCell.remove();
		return;
	}
	/**
	 * @param {XY|NAR} from
	 * @param {XY|NAR} edge
	 * @param {XY|NAR} to
	 */
	async AnimBounce(from,edge,to){
		from=this.NARtoXY(from);
		to=this.NARtoXY(to);
		edge=this.NARtoXY(edge);
		if(this.CheckCellEmpty(from))	return;
		var eat=!this.CheckCellEmpty(to);
		var ch=this.GetPieceByPos(from);
		if(eat&&this.GetPieceByPos(to).hue===ch.hue)	return;
		var midPos=this.QueryPieceClientPos(edge);
		var toPos=this.QueryPieceClientPos(to);
		var pPiece=this.NewPerformerPiece(from);
		var pCell=this.NewPerformerCell(edge,'BounceLight');
		if(eat)
		{
			var pPiece2=this.NewPerformerPiece(to,'Eaten');
			this.KillPiece(to);
			this.visEle.appendChild(pPiece2);
		}
		this.visEle.appendChild(pCell);
		this.visEle.appendChild(pPiece);
		await Sleep(10);
		ch.Hide();
		this.MovePiece(from,to);
		SetElementPos(pPiece,midPos);
		await Sleep(200);
		SetElementPos(pPiece,toPos);
		await Sleep(200);
		ch.Show();
		await Sleep(200);
		if(eat)	pPiece2.remove();
		pPiece.remove();
		await Sleep(1000);
		pCell.remove();
	}
	/**
	 * @param {XY|NAR} from
	 * @param {XY|NAR} port1
	 * @param {XY|NAR} port2
	 * @param {XY|NAR} to
	 */
	async AnimTeleport(from,port1,port2,to){
		from=this.NARtoXY(from);
		to=this.NARtoXY(to);
		port1=this.NARtoXY(port1);
		port2=this.NARtoXY(port2);
		if(this.CheckCellEmpty(from))	return;
		var eat=!this.CheckCellEmpty(to);
		var ch=this.GetPieceByPos(from);
		if(eat&&this.GetPieceByPos(to).hue===ch.hue)	return;
		var fromPos=this.QueryPieceClientPos(from);
		var toPos=this.QueryPieceClientPos(port1);
		var pPiece=this.NewPerformerPiece(from);
		var pCell1=this.NewPerformerCell(port1,'TeleLight');
		var pCell2=this.NewPerformerCell(port2,'TeleLight');
		if(eat)
		{
			var pPiece2=this.NewPerformerPiece(to,'Eaten');
			this.KillPiece(to);
			this.visEle.appendChild(pPiece2);
		}
		this.visEle.appendChild(pPiece);
		await Sleep(10);
		ch.Hide();
		this.MovePiece(from,to);
		SetElementPos(pPiece,toPos);
		this.visEle.appendChild(pCell1);
		this.visEle.appendChild(pCell2);
		await Sleep(200);
		pPiece.style.display='none';
		fromPos=this.QueryPieceClientPos(port2);
		toPos=this.QueryPieceClientPos(to);
		SetElementPos(pPiece,fromPos);
		pPiece.style.display='block';
		await Sleep(200);
		SetElementPos(pPiece,toPos);
		await Sleep(200);
		ch.Show();
		await Sleep(200);
		if(eat)	pPiece2.remove();
		pPiece.remove();
		await Sleep(1000);
		pCell1.remove();
		pCell2.remove();
	}
	/** @param {NAR|XY} pos */
	async AnimExplode(pos){
		pos=this.NARtoXY(pos);
		if(this.CheckCellEmpty(pos))	return;
		var c=this.GetPieceByPos(pos);
		var goo=false;
		if(c.type==='goobomb')	goo=true;
		else if(c.type!=='bomb')	return;
		var pWrap=this.NewPerformerCell(pos,'ExplodeWrap');
		var pMask=NewPerformer('span',null,'GooExplodeMask');
		pWrap.innerHTML=`
			<span class="perform Explode Big${goo?' Goo':''}"></span>
			<span class="perform Explode Small${goo?' Goo':''}"></span>`;
		pWrap.style.filter=
			`hue-rotate(${c.hue}deg)
			${goo?'drop-shadow(0px 0px 10px white)':''}`;
		var black=this.CheckCellBlack(pos);
		if((!black&&!goo)||(black&&goo))	SetElementUpSideDown(pWrap);
		else	pWrap.style.rotate='0deg';
		this.visEle.appendChild(pWrap);
		if(goo)
			document.body.appendChild(pMask),
			this.element.style.animation='Shake 0.5s infinite';
		this.RemovePiece(pos);
		await Sleep(goo?4000:1500);
		var range=goo?
			GoobombRange[black?'black':'white']
		   :BombRange[black?'black':'white'];
		for(var i of range)
		{
			var post=new XY(pos.x+i.x,pos.y+i.y);
			this.KillPiece(post);
		}
		await Sleep(1100);
		pWrap.remove();
		if(goo)
			pMask.remove(),
		this.element.style.animation='Shake 1s';
	}
	/**
	 * @param {NAR|XY} pos
	 * @param {1|2|3} radius
	 */
	async AnimRotate(pos,radius){
		pos=this.XYtoNAR(pos);
		var posN=this.QueryCellCenterClientPos(pos);
		if(this.CheckCellEmpty(pos)) return;
		var ch=this.GetPieceByPos(pos);
		if(ch.type!='rotator') return;
		var bw=this.CheckCellBlack(pos)?'black':'white';
		var pWraps=Array(3),pPieces=Array(3),newChs=Array(3),newPoses=Array(3);
		var pCell=this.NewPerformerCell(pos,'RotateCircle');
		pCell.style.setProperty('--perform-size',`${radius*9}vmin`);
		SetElementHue(pCell,ch.hue);
		ch.element.style.animation='RotatePiece 2s';
		this.visEle.appendChild(pCell);
		await Sleep(500);
		for(var i=0;i<3;i++)
		{
			newPoses[i]=pos.delta(RotatorRange[bw][radius][i]);
			if(!this.CheckPosValid(newPoses[i])) continue;
			if(this.CheckCellEmpty(newPoses[i])) continue;
			var posC=this.QueryPieceClientPos(newPoses[i]);
			pWraps[i]=NewPerformer('span',posC,'RotateWrap');
			newChs[i]=this.GetPieceByPos(newPoses[i]);
			pPieces[i]=this.NewPerformerPiece(newPoses[i],'RotatePiece');
			SetElementPos(pPieces[i],{x:0,y:0});
			pWraps[i].style.transformOrigin=`${posN.x-posC.x}px ${posN.y-posC.y}px`;
			this.visEle.appendChild(pWraps[i]);
			pWraps[i].appendChild(pPieces[i]);
			newChs[i].Hide();
		}
		await Sleep(10);
		for(var i=0;i<3;i++)
		{
			if(pWraps[i]===undefined) continue;
			SetElementRotate(pWraps[i],120);
			SetElementRotate(pPieces[i],-120);
		}
		await Sleep(500);
		this.MovePiece(newPoses[0],new XY(-1,-1));
		this.MovePiece(newPoses[1],newPoses[0]);
		this.MovePiece(newPoses[2],newPoses[1]);
		this.MovePiece(new XY(-1,-1),newPoses[2]);
		for(var i=0;i<3;i++)
		{
			if(pWraps[i]===undefined) continue;
			newChs[i].Show();
			pWraps[i].remove();
			pPieces[i].remove();
		}
		await Sleep(1000);
		pCell.remove();
		ch.element.style.animation='';
	}
	/** 
	 * @param {NAR|XY} pos
	 * @param {String} newType
	 */
	async AnimPromote(pos,newType){
		pos=this.NARtoXY(pos);
		if(this.CheckCellEmpty(pos)) return;
		var ch=this.GetPieceByPos(pos);
		if(ch.type!=='pawn') return;
		var pPiece=this.NewPerformerPiece(pos,'PromotePiece');
		pPiece.style.filter=`hue-rotate(${ch.hue}deg) brightness(1) drop-shadow(0px 0px 0px gold)`;
		this.visEle.appendChild(pPiece);
		await Sleep(10);
		pPiece.style.filter=`hue-rotate(${ch.hue}deg) brightness(10) drop-shadow(0px 0px 10px gold)`;
		ch.Hide();
		await Sleep(2000);
		ch.SetType(newType);
		pPiece.style.filter=`hue-rotate(${ch.hue}deg) brightness(1) drop-shadow(0px 0px 0px gold)`;
		SetElementPieceType(pPiece,newType);
		await Sleep(2000);
		this.ReplacePiece(pos,ch);
		ch.Show();
		pPiece.remove();
	}
	/** @param {NAR|XY} pos */
	async AnimToggleControl(pos){
		pos=this.XYtoNAR(pos);
		if(!this.CheckPosValid(pos)) return;
		if(this.CheckCellEmpty(pos)) return;
		var ch=this.GetPieceByPos(pos);
		if(ch.type!=='diplomat') return;
		var bw=this.CheckCellBlack(pos)?'black':'white';
		for(var i=0;i<3;i++)
		{
			var newPoses=pos.delta(DiplomatRange[bw][i]);
			if(!this.CheckPosValid(newPoses)) continue;
			if(this.CheckCellEmpty(newPoses)) continue;
			var c=this.GetPieceByPos(newPoses);
			if(c.hue===ch.hue)	continue;
			var posN=this.NARtoXY(newPoses);
			if(this.cells[posN.x][posN.y].classList.contains('DiplomatControlled'))
				this.cells[posN.x][posN.y].classList.remove('DiplomatControlled'),
				this.cells[posN.x][posN.y].firstChild.style.filter='',
				SetElementHue(c.element,c.hue);
			else
				this.cells[posN.x][posN.y].classList.add('DiplomatControlled'),
				SetElementHue(this.cells[posN.x][posN.y].firstChild,ch.hue),
				c.element.style.filter=
					`grayscale(0.1) brightness(0.9)
					drop-shadow(0px 0px 3px hsl(${ch.hue},100%,85%))
					hue-rotate(${c.hue}deg)`;
		}
		await Sleep(200);
	}
	/** @param {NAR|XY} pos */
	async AnimToggleCheck(pos){
		pos=this.XYtoNAR(pos);
		if(!this.CheckPosValid(pos)) return;
		if(this.CheckCellEmpty(pos)) return;
		var ch=this.GetPieceByPos(pos);
		if(ch.type!=='king'&&ch.type!=='gooking') return;
		if(ch.element.classList.contains('Checked'))
			ch.element.classList.remove('Checked'),
			ch.element.style.filter=`hue-rotate(${ch.hue}deg)`;
		else
			ch.element.classList.add('Checked'),
			ch.element.style.filter=`hue-rotate(${ch.hue}deg) drop-shadow(0px 0px 5px red)`;
		await Sleep(200);
	}
	/**
	 * @param {NAR|XY} fact
	 * @param {NAR|XY} prod
	 */
	async AnimProduce(fact,prod){
		fact=this.XYtoNAR(fact);
		prod=this.XYtoNAR(prod);
		if(!this.CheckPosValid(fact)) return;
		if(!this.CheckPosValid(prod)) return;
		if(this.CheckCellEmpty(fact)) return;
		var eat=!this.CheckCellEmpty(prod);
		var ch=this.GetPieceByPos(fact);
		if(ch.type!=='factory') return;
		if(eat&&this.GetPieceByPos(prod).hue===ch.hue) return;
		var pPiece=this.NewPerformerPiece(fact,'Factory');
		pPiece.style.filter=`hue-rotate(${ch.hue}deg) brightness(1)`;
		ch.Hide();
		this.visEle.appendChild(pPiece);
		await Sleep(10);
		pPiece.style.filter=`hue-rotate(${ch.hue}deg) brightness(2)`;
		await Sleep(2000);
		pPiece.style.filter=`hue-rotate(${ch.hue}deg) brightness(1)`;
		ch.Show();
		if(eat) this.KillPiece(prod);
		var produced=!this.CheckCellEmpty(fact)&&this.GetPieceByPos(fact).type==='factory';
		if(produced)
		{
			var c=this.PlacePiece(prod,'product',ch.hue);
			c.Hide();
			var pPiece2=this.NewPerformerPiece(prod,'Product');
			this.visEle.appendChild(pPiece2);
		}
		await Sleep(1000);
		if(produced)
			c.Show(),
			await Sleep(200),
			pPiece2.remove();
	}
	/** @param {NAR|XY} pos */
	async AnimToggleRevolt(pos,by){
		pos=this.XYtoNAR(pos);
		if(!this.CheckPosValid(pos)) return;
		if(this.CheckCellEmpty(pos)) return;
		var ch=this.GetPieceByPos(pos);
		if(ch.type!=='employee') return;
		var posN=this.NARtoXY(pos);
		var c=this.cells[posN.x][posN.y];
		if(c.classList.contains('Revolting'))
		{
			c.firstChild.style.filter='';
			c.classList.remove('Revolting');
		}
		else
		{
			c.classList.add('Revolting');
			var pPiece=this.NewPerformerPiece(pos,'Revolt');
			SetElementHue(c.firstChild,by);
			SetElementHue(pPiece,by);
			this.visEle.appendChild(pPiece);
			await Sleep(1000);
			pPiece.remove();
		}
	}
};