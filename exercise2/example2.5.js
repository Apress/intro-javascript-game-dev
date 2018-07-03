context.beginPath()
context.moveTo(50, 250);
context.quadraticCurveTo(25, 300, 50, 350);
context.quadraticCurveTo(100, 375, 150, 350);
context.closePath();
context.moveTo(230, 360);
context.quadraticCurveTo(255, 340, 270, 360);
context.quadraticCurveTo(255, 340, 270, 310);
context.closePath();
context.moveTo(250, 50);
context.quadraticCurveTo(310, 60, 370, 50);
context.quadraticCurveTo(400, 75, 370, 100);
context.closePath();
context.strokeStyle = "#FFFF00";
context.fillStyle = "#000000";
context.fill();
context.stroke();