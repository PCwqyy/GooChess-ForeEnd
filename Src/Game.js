export const Sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
const RomeApl={
	1:'i',2:'ii',3:'iii',4:'iv',5:'v',
	6:'vi',7:'vii',8:'viii',9:'ix',10:'x',
	11:'xi',12:'xii',13:'xiii',14:'xiv'};
// 坐标
export class XY{
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

export class NAR{
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
/** @returns {NAR} */
export function XYtoNAR(a,rows){
	return new NAR(
		Math.floor(a.x/2)+1,
		Math.floor((2*rows+2*a.y-a.x)/2),
		rows-a.y+1);
	}
/** @returns {XY} */
export function NARtoXY(a,rows){
	var b=new XY(2*a.num-2,rows-a.rom+1);
	if(2*rows+2*b.y-b.x!=2*a.alp)	b.x++;
	return b;
}

/** @param {String} type */
export function GetChoosIconPath(type){
	return `../../Icon/Chooses/${type}.svg`;
}

export class Choos{
	/** 
	 * @param {String} t type
	 * @param {NAR} p position
	 * @param {Number} h hue
	 */
	constructor(t,p,h)
	{
		this.type;
		this.hue;
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
	constructor(rows,parentElement,clickFunc,game=true)
	{
		this.rows=rows;
		this.element=document.createElement('grood');
		/** @type {Array<Choos>} */
		this.chooses=new Array;
		/** @type {Array<Array<HTMLElement>>} */
		this.cells=new Array(this.rows*2);
		/** @type {HTMLElement} */
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
		if(pos instanceof NAR)
			pos=NARtoXY(pos,this.rows);
		if(pos.x>this.rows||pos.x<1)
			return false;
		if(pos.y>Math.floor((pos.x+1)/2)||pos.y<1)
			return false;
		return true;
	}
	/** @param {NAR|XY} pos */
	CheckCellEmpty(pos){
		if(pos instanceof NAR)
			pos=NARtoXY(pos,this.rows);
		var c=this.GetChoosIdByPos(pos);
		if(c==undefined||c=='-1'||c==null)
			return true;
		else return false;
	}
	/** @param {NAR|XY} pos */
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
		if(pos instanceof XY)
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
		if(pos instanceof NAR)
			pos=NARtoXY(pos,this.rows);
		if(!this.CheckCellExist(pos))	return;
		if(this.CheckCellEmpty(pos))	return;
		var id=this.GetChoosIdByPos(pos);
		var tar=this.cells[pos.x][pos.y]
		tar.removeChild(this.chooses[id].element);
		tar.setAttribute('choosId','-1');
		return id;
	}
	/** @param {NAR|XY} pos */
	QueryChoosClientPos(pos){
		if(pos instanceof NAR)
			pos=NARtoXY(pos,this.rows);
		var tar=this.cells[pos.x][pos.y];
		var measurer=document.createElement('choos');
		tar.appendChild(measurer);
		var posc=measurer.getBoundingClientRect();
		var posg=this.visEle.getBoundingClientRect();
		tar.removeChild(measurer);
		return {x:posc.x-posg.x,y:posc.y-posg.y};
	}
	/** @param {NAR|XY} pos */
	QueryCellCenterClientPos(pos){
		if(pos instanceof NAR)
			pos=NARtoXY(pos,this.rows);
		var tar=this.cells[pos.x][pos.y];
		var black=tar.parentElement.classList.contains('black');
		return {
			x:tar.offsetLeft+tar.offsetWidth/2,
			y:tar.offsetTop+(black?1:2)/3*tar.offsetHeight,
		};
	}
	/** @param {NAR|XY} pos */
	SetSign(pos,...signs){
		if(pos instanceof NAR)
			pos=NARtoXY(pos,this.rows);
		for(var i of signs)
			this.cells[pos.x][pos.y].classList.add(i);
	}

// ----------------------------带动画---------------------------
	/**
	 * @param {NAR|XY} from
	 * @param {NAR|XY} to
	 */
	async AnimMove(from,to){
		if(from instanceof NAR)
			from=NARtoXY(from,this.rows);
		if(this.CheckCellEmpty(from))
			return 'No choos to move';
		if(to instanceof NAR)
			to=NARtoXY(to,this.rows);
		if(!this.CheckCellEmpty(to))
			return 'Already exist a choos';
		if(from==to)
			return 'You no move :(';
		var id=this.GetChoosIdByPos(from);
		var performer=document.createElement('choos');
		performer.style.backgroundImage=
			`url(${GetChoosIconPath(this.chooses[id].type)})`;
		performer.classList.add('performer');
		var fromPos=this.QueryChoosClientPos(from);
		var toPos=this.QueryChoosClientPos(to);
		performer.style.left=`${fromPos.x}px`;
		performer.style.top=`${fromPos.y}px`;
		performer.style.filter=`hue-rotate(${this.chooses[id].hue}deg)`;
		this.visEle.appendChild(performer);
		await Sleep(10);
		this.chooses[id].Hide();
		this.RemoveChoos(from);
		this.chooses[id].pos=XYtoNAR(to,this.rows);
		this.AppendChoos(this.chooses[id]);
		await Sleep(10);
		performer.style.left=`${toPos.x}px`;
		performer.style.top=`${toPos.y}px`;
		await Sleep(100);
		this.chooses[id].Show();
		await Sleep(10);
		performer.remove();
		return 'moved';
	}
	/** @param {NAR|XY} pos */
	async AnimExplode(pos){
		if(pos instanceof NAR)
			pos=NARtoXY(from,this.rows);
		if(this.CheckCellEmpty(pos))
			return 'No choos here';
		var c=this.chooses[this.GetChoosIdByPos(pos)];
		var goo=false;
		if(c.type=='goobomb')
			goo=true;
		else if(c.type!='bomb')
			return 'Not a bomb';
		var performer=document.createElement('span');
		var mask=document.createElement('span');
		performer.classList.add('perform','ExplodeWrap');
		mask.classList.add('perform','GooExplodeMask');
		performer.innerHTML=`
			<span class="perform Explode Big${goo?' Goo':''}"></span>
			<span class="perform Explode Small${goo?' Goo':''}"></span>`
		var cpos=this.QueryCellCenterClientPos(pos);
		performer.style.left=`${cpos.x}px`;
		performer.style.top=`${cpos.y}px`;
		performer.style.filter=
			`hue-rotate(${c.hue}deg)
			${goo?'drop-shadow(0px 0px 10px white)':''}`;
		var black=this.cells[pos.x][pos.y].parentElement
			.classList.contains('black');
		if(!black&&!goo||black&&goo)
			performer.style.rotate='180deg';
		this.visEle.appendChild(performer);
		if(goo)
			document.body.appendChild(mask),
			this.element.style.animation='Shake 0.5s infinite';
		await Sleep(goo?4000:1500);
		this.RemoveChoos(pos);
		var range=goo?
			GoobombRange[black?'black':'white']
		   :BombRange[black?'black':'white'];
		console.log(range);
		for(var i of range)
		{
			var post=new XY(pos.x+i.x,pos.y+i.y);
			this.AnimExplode(post);
			this.RemoveChoos(post);
		}
		await Sleep(1100);
		performer.remove();
		if(goo)
			mask.remove(),
			this.element.style.animation='Shake 1s';
	}
};