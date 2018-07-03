context.beginPath()
context.moveTo(50, 250);
context.lineTo(50, 350);
context.lineTo(150, 350);
context.closePath();
context.moveTo(230, 360);
context.lineTo(270, 360);
context.lineTo(270, 310);
context.closePath();
context.moveTo(250, 50);
context.lineTo(370, 50);
context.lineTo(370, 100);
context.closePath();
context.strokeStyle = "#FFFF00";
context.fillStyle = "#000000";
context.fill();
context.stroke(); 