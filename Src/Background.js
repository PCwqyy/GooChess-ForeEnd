class Background
{
	/** @type {HTMLCanvasElement} */
	canvas;
	/** @type {CanvasRenderingContext2D} */
	ctx;
	/** @type {boolean} */
	run=true;
	constructor(Body)
	{
		this.canvas=document.createElement('canvas');
		this.canvas.classList.add('Background');
		this.canvas.width=Body.clientWidth;
		this.canvas.height=Body.clientHeight;
		Body.appendChild(this.canvas);
		this.ctx=this.canvas.getContext('2d');
		window.addEventListener('resize',()=>{
			this.canvas.width=Body.clientWidth;
			this.canvas.height=Body.clientHeight;
		});
		document.addEventListener('visibilitychange',()=>{
            this.run=document.visibilityState=="visible";
		});
	}
	Triangles(interval=200,minSize=20,maxSize=50,minSpeed=2,maxSpeed=4)
	{
		const triangles=[];
		const maxRotate=maxSpeed/50;
		const minRotate=minSpeed/50;
		const genTriangle=()=>
		{
			const size=minSize+Math.random()*(maxSize-minSize);
			const y=Math.random()*this.canvas.height;
			const speed=minSpeed+Math.random()*(maxSpeed-minSpeed);
			const rotateSpeed=minRotate+Math.random()*(maxRotate-minRotate);
			return {
				x:-2*size,y,size,
				angle:Math.random()*Math.PI*2,
				rotateSpeed,speed,
				color:`hsl(${Math.random()*360},100%,40%)`
			};
		}
		setInterval(()=>
			{
				if(!this.run) return;
				triangles.push(genTriangle.call(this));
			},interval);
		const draw=()=>
		{
			this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			for(let t of triangles)
			{
				t.x+=t.speed;
				t.angle+=t.rotateSpeed;
				this.ctx.save();
				this.ctx.translate(t.x,t.y);
				this.ctx.rotate(t.angle);
				this.ctx.beginPath();
				for(let i=0;i<3;i++)
				{
					const theta=i*(2*Math.PI/3)-Math.PI/2;
					const px=Math.cos(theta)*t.size;
					const py=Math.sin(theta)*t.size;
					if(i===0)	this.ctx.moveTo(px,py);
					else	this.ctx.lineTo(px,py);
				}
				this.ctx.closePath();
				this.ctx.fillStyle=t.color;
				this.ctx.globalAlpha=0.8;
				this.ctx.fill();
				this.ctx.restore();
			}
			// Remove triangles that are out of right bound
			while(triangles.length&&triangles[0].x-triangles[0].size>this.canvas.width)
				triangles.shift();
			requestAnimationFrame(draw);
		};
		draw();
	}
	Lines(interval=300,stroke=1,slowIn=300,slowOut=2700)
	{
		const ttl=slowIn+slowOut;
		var lines=[];
		const GenLine=()=>
		{
			var Angle=Math.random()*Math.PI;
			var mx=Math.random()*this.canvas.width;
			var my=Math.random()*this.canvas.height;
			var x=Math.cos(Angle)*this.canvas.width;
			var y=Math.sin(Angle)*this.canvas.height;
			return {
				sx:mx+x,sy:my+y,ex:mx-x,ey:my-y,
				color:`hsl(${Math.random()*360},80%,50%)`,
				startTime:performance.now()
			};
		}
		setInterval(()=>
			{
				if(!this.run)	return;
				lines.push(GenLine());
			},interval);
		// 动画渲染
		const Opacity=(time)=>
		{
			if(time<slowIn)	return time/slowIn;
			else	return 1-(time-slowIn)/slowOut;
		}
		const Draw=()=>
		{
			this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			var now=performance.now();
			lines=lines.filter(line=>now-line.startTime<ttl);
			for (let line of lines)
			{
				this.ctx.save();
				this.ctx.strokeStyle=line.color;
				this.ctx.lineWidth=stroke;
				this.ctx.globalAlpha=Opacity(now-line.startTime);
				this.ctx.beginPath();
				this.ctx.moveTo(line.sx,line.sy);
				this.ctx.lineTo(line.ex,line.ey);
				this.ctx.lineCap='round';
				this.ctx.stroke();
				this.ctx.restore();
			}
			requestAnimationFrame(Draw);
		}
		Draw();
	}
}

// interface
var bkg=new Background(document.body);
var content=document.querySelector('meta[name="Background"]').content;
if(content.match(/\w+\([\d,]*\)/)!=null)
{
	eval('bkg.'+content);
	console.log('Background loaded:',content);
}