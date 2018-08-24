var jobData = [];//假设是一个数组。里面有1000万个数据  
function  sliceJob() {
    var  num  =  (jobData.length  /  100)  +  1;//把任务数据划分为100份。    
    var  portion  =  100000;//每份有10万个数字。    
    var  addition  =  0;//这里用来保存最后的结果。一开始是0；    
    var  intv  =  setInterval(function () {
            if (num--) {            //然后每一份结果。            
        additoin  +=  every;
    }  else  {            //计算最后一份，然后输出结果。            
        alert('最终结果是:',  addition);
        window.clearInterval(intv);
    }
        },  50);
}