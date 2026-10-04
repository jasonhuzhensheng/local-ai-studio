const transientReadError=error=>['EAGAIN','EINTR'].includes(error?.code)||error?.errno===-11;

export function retryReadSync(operation,{attempts=9,delays=[25,75,150,300,600,1000,1500,2000]}={}){
  for(let attempt=0;;attempt++){
    try{return operation();}
    catch(error){
      if(!transientReadError(error)||attempt>=attempts-1)throw error;
      const delay=delays[Math.min(attempt,delays.length-1)]??60;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,delay);
    }
  }
}
