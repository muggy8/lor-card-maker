onmessage=e=>{(async function(e){const a=e.width,t=e.height,s=await createImageBitmap(e.image),n=new OffscreenCanvas(2*a,2*t),r=n.getContext("2d");return r.clearRect(0,0,n.width,n.height),r.drawImage(s,0,0,a,t,0,0,a,t),r.scale(-1,1),r.drawImage(s,0,0,a,t,-n.width,0,a,t),r.setTransform(1,0,0,1,0,0),r.scale(1,-1),r.drawImage(s,0,0,a,t,0,-n.height,a,t),r.setTransform(1,0,0,1,0,0),r.scale(-1,-1),r.drawImage(s,0,0,a,t,-n.width,-n.height,a,t),r.setTransform(1,0,0,1,0,0),n.convertToBlob({type:"image/png",quality:1})})(e.data).then(postMessage)};