export const Sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
const RomeApl={
	1:'i',2:'ii',3:'iii',4:'iv',5:'v',
	6:'vi',7:'vii',8:'viii',9:'ix',10:'x',
	11:'xi',12:'xii',13:'xiii',14:'xiv'};
// 坐标
export class XY{
	x;y;
	/**D
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	constructor(x,y)
	{
		this.x=x;
		this.y=y;
	}
	print(){return `${this.x},${this.y}`;}
}

const BombRange={
	white:[
		{x:-1,y:0},
		{x:1,y:0},
		{x:-1,y:-1}
	],
	black:[
		{x:-1,y:0},
		{x:1,y:0},
		{x:1,y:1}
	],
};
const GoobombRange={
	white:[
		{x:-1,y:0},
		{x:1,y:0},
		{x:-1,y:-1},
		{x:-3,y:-1},
		{x:1,y:-1},
		{x:1,y:1}
	],
	black:[
		{x:-1,y:0},
		{x:1,y:0},
		{x:1,y:1},
		{x:3,y:1},
		{x:-1,y:1},
		{x:-1,y:-1}
	],
};

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
function SetElementChoosType(ele,type){
	ele.style.backgroundImage=`url(${GetChoosIconPath(type)})`;
}
/** @returns {HTMLElement} */
function NewPerformer(Tag,Pos,...Class){
	var t=document.createElement(Tag);
	if(Pos!=null)
		SetElementPos(t,Pos);
	t.classList.add('perform',...Class);
	return t;
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
}
/**
 * @param {XY} a
 * @param {Number} rows
 */
export function XYtoNAR(a,rows){
	if(a instanceof NAR)	return a;
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
	var b=new XY(2*a.num-2,rows-a.rom+1);
	if(2*rows+2*b.y-b.x!=2*a.alp)	b.x++;
	return b;
}

/** @param {String} type */
export function GetChoosIconPath(type){
	return `../../Icon/Chooses/${type}.svg`;
}

export class Choos{
	type;hue;element;pos;
	/** 
	 * @param {String} t type
	 * @param {NAR} p position
	 * @param {Number} h hue
	 */
	constructor(t,p,h)
	{
		this.element=document.createElement('choos');
		this.SetType(t);
		this.SetHue(h);
		this.pos=p;
	}
	SetType(t){
		this.type=t;
		this.element.style.backgroundImage=`url(${GetChoosIconPath(t)})`;
	}
	/** @param {Number} h hue */
	SetHue(h){
		if(!h instanceof Number)
			return NaN;
		if(h==-1)
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
	element;
	/** @type {Array<Choos>} */
	chooses;
	/**
	 * @param {Number} rows 
	 * @param {HTMLElement} parentElement 
	 * @param {Function} clickFunc 
	 */
	constructor(rows,parentElement,clickFunc,game=true)
	{
		this.rows=rows;
		this.element=document.createElement('grood');
		this.chooses=new Array;
		this.cells=new Array(this.rows*2);
		this.visEle;
		this.DrawGrood(game);
		parentElement.appendChild(this.element);
		this.element.addEventListener('click',clickFunc);
	}
	/**
	 * @param {boolean} game is in game 
	 */
	DrawGrood(game=true){
		this.element.setAttribute('rows',`${this.rows}`);
		this.visEle=document.createElement('div');
		this.visEle.classList.add('cells');
		this.element.appendChild(this.visEle);
		var row=new Array(this.rows*2);
		for(let i=1;i<=this.rows*2-1;i++){
			row[i]=document.createElement('div');
			row[i].classList.add('row');
			this.cells[i]=new Array(this.rows);
			if(i%2==0)	row[i].classList.add('black');
			for(let j=1;j<=Math.floor((i-1)/2)+1;j++){
				this.cells[i][j]=document.createElement('cell');
				this.cells[i][j].setAttribute('x',`${i}`);
				this.cells[i][j].setAttribute('y',`${j}`);
				var perform=document.createElement('span');
				this.cells[i][j].appendChild(perform);
				if(game)
				{
					// 确定shooter
					for(var q in Shooter)
						if(Shooter[q].x==i&&Shooter[q].y==j){
							this.cells[i][j].classList.add('shooter');
							break;
						}
					// 确定三方位置
					var thisNar=XYtoNAR(new XY(i,j),this.rows);
					if(thisNar.num<=4)	this.cells[i][j].classList.add(Side.num);
					if(thisNar.alp<=4)	this.cells[i][j].classList.add(Side.alp);
					if(thisNar.rom<=4)	this.cells[i][j].classList.add(Side.rom);
				}
				row[i].appendChild(this.cells[i][j]);
			}
			this.visEle.appendChild(row[i]);
		}
		return;
	}
	/** @param {NAR|XY} pos */
	CheckCellExist(pos){
		pos=NARtoXY(pos,this.rows);
		if(pos.x>this.rows*2||pos.x<1)
			return false;
		if(pos.y>Math.floor((pos.x+1)/2)||pos.y<1)
			return false;
		return true;
	}
	/** @param {NAR|XY} pos */
	CheckCellEmpty(pos){
		pos=NARtoXY(pos,this.rows);
		var c=this.GetChoosIdByPos(pos);
		if(c==undefined||c=='-1'||c==null)
			return true;
		else return false;
	}
	/** @param {NAR|XY} pos */
	CheckCellBlack(pos){
		pos=NARtoXY(pos,this.rows);
		return pos.x%2==0;
	}
	/**
	 * @param {NAR|XY} pos
	 * @returns {Number}
	 */
	GetChoosIdByPos(pos){
		if(pos instanceof NAR)
			pos=NARtoXY(pos,this.rows);
		if(!this.CheckCellExist(pos))
			return;
		var c=this.cells[pos.x][pos.y];
		var id=c.getAttribute('choosId');
		return id;
	}
	/**
	 * @param {NAR|XY} pos
	 * @param {String} type
	 * @param {Number} hue
	 */
	PlaceChoos(pos,type,hue){
		pos=XYtoNAR(pos,this.rows);
		if(!this.CheckCellEmpty(pos))
			return 'Already a choos here';
		var ch=new Choos(type,pos,hue);
		this.AppendChoos(ch);
	}
	/** @param {Choos} c */
	AppendChoos(c){
		var id=this.chooses.push(c);
		var pos=NARtoXY(c.pos,this.rows);
		this.cells[pos.x][pos.y].appendChild(c.element);
		this.cells[pos.x][pos.y].setAttribute('choosId',`${id-1}`);
	}
	/** @param {NAR|XY} pos */
	RemoveChoos(pos){
		pos=NARtoXY(pos,this.rows);
		if(!this.CheckCellExist(pos))	return;
		if(this.CheckCellEmpty(pos))	return;
		var id=this.GetChoosIdByPos(pos);
		var tar=this.cells[pos.x][pos.y]
		tar.removeChild(this.chooses[id].element);
		tar.setAttribute('choosId','-1');
		return id;
	}
	ClearChooses(){
		for(var i of this.chooses)
		{
			var pos=NARtoXY(i.pos,this.rows);
			this.cells[pos.x][pos.y].setAttribute('choosId','-1');
			i.element.remove();
		}
		this.chooses=new Array;
	}
	/**
	 * @param {NAR|XY} from
	 * @param {NAR|XY} to
	 */
	MoveChoos(from,to){
		from=NARtoXY(from,this.rows);
		to=NARtoXY(to,this.rows);
		if(from==to)	return;
		if(!this.CheckCellExist(from))	return;
		if(!this.CheckCellExist(to))	return;
		var id=this.GetChoosIdByPos(from);
		this.RemoveChoos(from);
		this.chooses[id].pos=to;
		this.AppendChoos(this.chooses[id]);
	}
	/** @param {NAR|XY} pos */
	QueryChoosClientPos(pos){
		pos=NARtoXY(pos,this.rows);
		var tar=this.cells[pos.x][pos.y];
		var measurer=document.createElement('choos');
		measurer.style.opacity='0';
		tar.appendChild(measurer);
		var posc=measurer.getBoundingClientRect();
		var posg=this.visEle.getBoundingClientRect();
		tar.removeChild(measurer);
		return {x:posc.x-posg.x,y:posc.y-posg.y};
	}
	/** @param {NAR|XY} pos */
	QueryCellCenterClientPos(pos){
		pos=NARtoXY(pos,this.rows);
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
			pos=NARtoXY(pos,this.rows);
		this.cells[pos.x][pos.y].classList.add(signs);
	}

// ----------------------------带动画---------------------------
	/**
	 * @param {NAR|XY} pos
	 * @param {Number} cid
	 * @returns {HTMLElement}
	 */
	NewPerformerChoos(cid,...Class){
		var ele=NewPerformer('choos',
			this.QueryChoosClientPos(this.chooses[cid].pos),...Class);
		SetElementChoosType(ele,this.chooses[cid].type);
		SetElementHue(ele,this.chooses[cid].hue);
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
		from=NARtoXY(from,this.rows);
		if(this.CheckCellEmpty(from))	return;
		to=NARtoXY(to,this.rows);
		if(!this.CheckCellEmpty(to))	return;
		if(from==to)	return;
		this.SetSign(from,'latest');
		this.SetSign(to,'latest');
		var id=this.GetChoosIdByPos(from);
		var pChoos=this.NewPerformerChoos(id);
		var pCell=this.NewPerformerCell(from,'ShootLight');
		if(shoot)
			this.visEle.appendChild(pCell);
		this.visEle.appendChild(pChoos);
		await Sleep(shoot?1000:10);
		this.chooses[id].Hide();
		this.MoveChoos(from,to);
		SetElementPos(pChoos,this.QueryChoosClientPos(to));
		await Sleep(200);
		this.chooses[id].Show();
		await Sleep(10);
		pChoos.remove();
		if(!shoot)	return;
		await Sleep(1000);
		pCell.remove();
		return;
	}
	/** @param {NAR|XY} pos */
	async AnimExplode(pos){
		pos=NARtoXY(pos,this.rows);
		if(this.CheckCellEmpty(pos))	return;
		var c=this.chooses[this.GetChoosIdByPos(pos)];
		var goo=false;
		if(c.type=='goobomb')	goo=true;
		else if(c.type!='bomb')	return;
		var pWrap=this.NewPerformerCell(pos,'ExplodeWrap');
		var pMask=NewPerformer('span',null,'GooExplodeMask');
		pWrap.innerHTML=`
			<span class="perform Explode Big${goo?' Goo':''}"></span>
			<span class="perform Explode Small${goo?' Goo':''}"></span>`
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
		await Sleep(goo?4000:1500);
		this.RemoveChoos(pos);
		var range=goo?
			GoobombRange[black?'black':'white']
		   :BombRange[black?'black':'white'];
		for(var i of range)
		{
			var post=new XY(pos.x+i.x,pos.y+i.y);
			this.AnimExplode(post);
			this.RemoveChoos(post);
		}
		await Sleep(1100);
		pWrap.remove();
		if(goo)
			pMask.remove(),
			this.element.style.animation='Shake 1s';
	}
	/**
	 * @param {XY|NAR} from
	 * @param {XY|NAR} port1
	 * @param {XY|NAR} port2
	 * @param {XY|NAR} to
	 */
	async AnimTeleport(from,port1,port2,to){
		from=NARtoXY(from,this.rows);
		if(this.CheckCellEmpty(from))	return;
		to=NARtoXY(to,this.rows);
		if(!this.CheckCellEmpty(to))	return;
		port1=NARtoXY(port1,this.rows);
		port2=NARtoXY(port2,this.rows);
		if(from==to)	return;
		var id=this.GetChoosIdByPos(from);
		var fromPos=this.QueryChoosClientPos(from);
		var toPos=this.QueryChoosClientPos(port1);
		var pChoos=this.NewPerformerChoos(id);
		var pCell1=this.NewPerformerCell(port1,'TeleLight');
		var pCell2=this.NewPerformerCell(port2,'TeleLight');
		this.visEle.appendChild(pChoos);
		await Sleep(10);
		this.chooses[id].Hide();
		this.MoveChoos(from,to);
		SetElementPos(pChoos,toPos);
		this.visEle.appendChild(pCell1);
		this.visEle.appendChild(pCell2);
		await Sleep(200);
		pChoos.style.display='none';
		fromPos=this.QueryChoosClientPos(port2);
		toPos=this.QueryChoosClientPos(to);
		SetElementPos(pChoos,fromPos);
		pChoos.style.display='block';
		await Sleep(200);
		SetElementPos(pChoos,toPos);
		await Sleep(200);
		this.chooses[id].Show();
		await Sleep(10);
		pChoos.remove();
		await Sleep(1000);
		pCell1.remove();
		pCell2.remove();
	}
};