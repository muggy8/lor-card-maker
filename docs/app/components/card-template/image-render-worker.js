onmessage=e=>{(async function(e){const{image:t,width:a,height:s}=e,n=new OffscreenCanvas(2*a,2*s),r=n.getContext("2d");return r.clearRect(0,0,n.width,n.height),r.drawImage(t,0,0,a,s,0,0,a,s),r.scale(-1,1),r.drawImage(t,0,0,a,s,-n.width,0,a,s),r.setTransform(1,0,0,1,0,0),r.scale(1,-1),r.drawImage(t,0,0,a,s,0,-n.height,a,s),r.setTransform(1,0,0,1,0,0),r.scale(-1,-1),r.drawImage(t,0,0,a,s,-n.width,-n.height,a,s),r.setTransform(1,0,0,1,0,0),n.convertToBlob({type:"image/png",quality:1})})(e.data).then(postMessage,(e=>{setTimeout((function(){throw e}),250)}))};