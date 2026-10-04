document.addEventListener('DOMContentLoaded', () => {


document.querySelector("#btn").addEventListener("click", arraySum);


 function arraySum(){
 
 var text = document.querySelector("#inp");
text = text.value;
text = text.trim();
var split = text.split("");
var countWords = text.split(" ");

     countWords = Number(countWords.length);

 
  var sumA = 0;
  var sumB = 0;
  var sumC = 0;
  var sumD = 0;
  var sumE = 0;
  var sumI = 0;
  var sumF = 0;
  var sumG = 0;
  var sumJ = 0;
  var sumK = 0;
  var sumL = 0;
  var sumM = 0;
  var sumN = 0;
  var sumO = 0;
  var sumP = 0;
  var sumQ = 0;
  var sumR = 0;
  var sumS = 0;
  var sumV = 0;
  var sumT = 0;
  var sumU = 0;
  var sumW = 0;
  var sumX = 0;
  var sumH = 0;
  var sumY = 0;
  var sumZ = 0;
  var outSum = 0;
  
  var outA = document.querySelector("#outA");
  var outB = document.querySelector("#outB");
  var outC = document.querySelector("#outC");
  var outD = document.querySelector("#outD");
  var outE = document.querySelector("#outE");
  var outI = document.querySelector("#outI");
  var outF = document.querySelector("#outF");
  var outG = document.querySelector("#outG");
   var outJ = document.querySelector("#outJ");
  var outS = document.querySelector("#outS");
  var outT = document.querySelector("#outT");
  var outN = document.querySelector("#outN");
  var outX = document.querySelector("#outX");
  var outL = document.querySelector("#outL");
  var outH = document.querySelector("#outH");
  var outO = document.querySelector("#outO");
  var outP = document.querySelector("#outP");
  var outQ = document.querySelector("#outQ");
  var outR = document.querySelector("#outR");
  var outU = document.querySelector("#outU");
  var outV = document.querySelector("#outV");
  var outW = document.querySelector("#outW");
  var outY = document.querySelector("#outY");
  var outZ = document.querySelector("#outZ");
  var outSum = document.querySelector("#outSum");
  
  let arr = ["а","б","в","г","д","е","ж","з","и","й","к","л","м","н","о","п","р","с","т", "у","х","п","ч","щ","э","ю","я"];

   for(var i = 0; i < split.length; i++){
   if(split[i] === arr[i]){
      alert ("Введите буквы английского алфавита")
  }
   
   if(split[i] == "a" || split[i] == "A"){
   sumA = sumA+1;
   outA.innerHTML="количество букв "+ split[i]+" = "+sumA;
   }
    if(split[i] == "b" || split[i] == "B"){
   sumB = sumB+1;
   outB.innerHTML="количество букв "+ split[i]+" = "+sumB;
       
   }
   
   if(split[i] == "c" || split[i] == "C"){
   sumC = sumC+1;
   outC.innerHTML="количество букв "+ split[i]+" = "+sumC;
       
   }
   
   if(split[i] == "d" || split[i] == "D"){
   sumD = sumD+1;
   outD.innerHTML="количество букв "+ split[i]+" = "+sumD;
       
   }
   
   if(split[i] == "i" || split[i] == "I"){
   sumI = sumI+1;
   outI.innerHTML="количество букв "+ split[i]+" = "+sumI;
       
   }
   
   
   if(split[i] == "f" || split[i] == "F"){
   sumF = sumF+1;
   outF.innerHTML="количество букв "+ split[i]+" = "+sumF;
       
   }
   
   if(split[i] == "g" || split[i] == "G"){
   sumG = sumG+1;
   outG.innerHTML="количество букв "+ split[i]+" = "+sumG;
       
   }
   
   if(split[i] == "s" || split[i] == "S"){
   sumS = sumS+1;
   outS.innerHTML="количество букв "+ split[i]+" = "+sumS;
       
   }
   if(split[i] == "t" || split[i] == "T"){
   sumT = sumT+1;
   outT.innerHTML="количество букв "+ split[i]+" = "+sumT;
       
   }
   if(split[i] == "n" || split[i] == "N"){
   sumN = sumN+1;
   outN.innerHTML="количество букв "+ split[i]+" = "+sumN;
       
   }
   if(split[i] == "x" || split[i] == "X"){
   sumX = sumX+1;
   outX.innerHTML="количество букв "+ split[i]+" = "+sumX;
       
   }
   if(split[i] == "l" || split[i] == "L"){
   sumL = sumL+1;
   outL.innerHTML="количество букв "+ split[i]+" = "+sumL;
       
   }
   if(split[i] == "h" || split[i] == "H"){
   sumH = sumH+1;
   outH.innerHTML="количество букв "+ split[i]+" = "+sumH;
       
   }
   if(split[i] == "j" || split[i] == "J"){
   sumJ = sumJ+1;
   outJ.innerHTML="количество букв "+ split[i]+" = "+sumJ;
       
   }
    if(split[i] == "o" || split[i] == "O"){
   sumO = sumO+1;
   outO.innerHTML="количество букв "+ split[i]+" = "+sumO;
       
   }
    if(split[i] == "e" || split[i] == "E"){
   sumE = sumE+1;
   outE.innerHTML="количество букв "+ split[i]+" = "+sumE;
       
   }
   
   if(split[i] == "k" || split[i] == "K"){
   sumK = sumK+1;
   outK.innerHTML="количество букв "+ split[i]+" = "+sumK;
       
   }
    if(split[i] == "l" || split[i] == "L"){
   sumL = sumL+1;
   outL.innerHTML="количество букв "+ split[i]+" = "+sumL;
       
   }
    if(split[i] == "m" || split[i] == "M"){
   sumM = sumM+1;
   outM.innerHTML="количество букв "+ split[i]+" = "+sumM;
       
   }
   
    if(split[i] == "u" || split[i] == "U"){
   sumU = sumU+1;
   outU.innerHTML="количество букв "+ split[i]+" = "+sumU;
       
   }
   
    if(split[i] == "v" || split[i] == "V"){
   sumV = sumV+1;
   outV.innerHTML="количество букв "+ split[i]+" = "+sumV;
       
   }
   
    if(split[i] == "p" || split[i] == "P"){
   sumP = sumP+1;
   outP.innerHTML="количество букв "+ split[i]+" = "+sumP;
       
   }
   
   if(split[i] == "q" || split[i] == "Q"){
   sumQ = sumQ+1;
   outQ.innerHTML="количество букв "+ split[i]+" = "+sumQ;
       
   }
   if(split[i] == "w" || split[i] == "W"){
   sumW = sumW+1;
   outW.innerHTML="количество букв "+ split[i]+" = "+sumW;
       
   }
    if(split[i] == "z" || split[i] == "Z"){
   sumZ = sumZ+1;
   outZ.innerHTML="количество букв "+ split[i]+" = "+sumZ;
       
   }
    if(split[i] == "y" || split[i] == "Y"){
   sumY = sumY+1;
   outY.innerHTML="количество букв "+ split[i]+" = "+sumY;
       
   }
   if(split[i] == "r" || split[i] == "R"){
   sumR = sumR+1;
   outR.innerHTML="количество букв "+ split[i]+" = "+sumR;
       
   }
   
     } 
     split = Number(split.length);
     
     var countLetters=split-(countWords-1);
     
      
      outSum.innerHTML="<b>всего букв</b> - "+countLetters;
      
      
 
 function sumPercent(a,b){
     return a*100/b
 }
 
 
 /*--chart-*/
    
     
     
    /* let  data = [
     sumPercent(sumA,countLetters),
     sumPercent(sumB,countLetters), 
     sumPercent(sumC,countLetters),
     sumPercent(sumD,countLetters),
     sumPercent(sumE,countLetters),
     sumPercent(sumF,countLetters),
     sumPercent(sumG,countLetters),
     sumPercent(sumH,countLetters),
     sumPercent(sumI,countLetters),
     sumPercent(sumJ,countLetters),
     sumPercent(sumK,countLetters),
     sumPercent(sumL,countLetters),
     sumPercent(sumM,countLetters),
     sumPercent(sumN,countLetters),
     sumPercent(sumO,countLetters),
     sumPercent(sumP,countLetters),
     sumPercent(sumR,countLetters),
     sumPercent(sumQ,countLetters),
     sumPercent(sumS,countLetters),
     sumPercent(sumT,countLetters),
     sumPercent(sumU,countLetters),
     sumPercent(sumV,countLetters),
     sumPercent(sumW,countLetters),
     sumPercent(sumX,countLetters),
     sumPercent(sumY,countLetters),
     sumPercent(sumZ,countLetters)
     ];  */
          
          
           
    Highcharts.chart('container', {
    
    chart: {
   plotBackgroundColor: null,
   plotBorderWidth: null,
   plotShadow: false, 
   type: 'pie' }, 
    
    
    plotOptions: { 
pie: { 
allowPointSelect: true, 
cursor: 'pointer', 
dataLabels: { 
enabled: true, 
format: '<b>{point.name}</b>: {point.percentage:.1f} %' 
} } },

    accessibility: {
 point: { valueSuffix: '%' } 
 },
    
    title: {
        text: 'Pie chart of distribution of letters in the text',
        style: {
            color: "#888",
            
        }
    },
    colors: ['#8c110a', '#FCDBBA','##A12F2F', '#56a2a7','#461234','#82BFE0','#c196f3','#91A2C2','#e1d6f3', '#3ff','#fef', '#312e81','#2c3e50', 'red', 'green', 'blue', 'deepskyblue', 'pink', 'hotpink', 'tomato', 'yellow', 'orange', 'lightgreen', 'gray', 'silver'],
    yAxis: {
        title: {
            text: 'percent %'
        },
    },
     
      
      tooltip: { 
   pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
      
      
      
        xAxis: {
         title: {
            text: 'courses'
        },
            categories: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'Q', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        },
        
        series: [{ 
name: 'Letters', 
colorByPoint: true, 
data: [
{ 
name: 'A', 
y: sumPercent(sumA,countLetters),
 sliced: true, 
 selected: true }, 
{ 
name: 'B', 
y: sumPercent(sumB,countLetters) },
 { 
 name: 'C', 
 y: sumPercent(sumC,countLetters) }, 
 { 
 name: 'D', 
 y:  sumPercent(sumD,countLetters)
 },  { 
 name: 'E',
  y:  sumPercent(sumE,countLetters)
 }, { 
 name: 'F', 
 y:  sumPercent(sumF,countLetters)
 },{ 
 name: 'G', 
 y:  sumPercent(sumG,countLetters)
 }, { 
 name: 'H', 
 y: sumPercent(sumH,countLetters)
 }, { 
 name: 'I', 
 y: sumPercent(sumI,countLetters)
 }, { 
 name: 'J', 
 y: sumPercent(sumJ,countLetters)
 }, { 
 name: 'K', 
 y: sumPercent(sumK,countLetters)
 }, { 
 name: 'L', 
 y: sumPercent(sumL,countLetters)
 }, { 
 name: 'M', 
 y: sumPercent(sumM,countLetters)
 }, { 
 name: 'N', 
 y: sumPercent(sumN,countLetters)
 }, { 
 name: 'O', 
 y: sumPercent(sumO,countLetters)
 }, { 
 name: 'P', 
 y: sumPercent(sumP,countLetters)
 }, { 
 name: 'R', 
 y: sumPercent(sumR,countLetters)
 }, { 
 name: 'Q', 
 y: sumPercent(sumQ,countLetters)
 }, { 
 name: 'S', 
 y: sumPercent(sumS,countLetters)
 }, { 
 name: 'T', 
 y: sumPercent(sumT,countLetters)
 }, { 
 name: 'U', 
 y: sumPercent(sumU,countLetters)
 }, { 
 name: 'V', 
 y: sumPercent(sumV,countLetters)
 }, { 
 name: 'W', 
 y: sumPercent(sumW,countLetters)
 }, { 
 name: 'X', 
 y: sumPercent(sumX,countLetters)
 }, { 
 name: 'Y', 
 y: sumPercent(sumY,countLetters)
 }, { 
 name: 'Z', 
 y: sumPercent(sumZ,countLetters)
 }
 ] 
 }] 
 
        
        
        
        
        
    });
    }
});


 
 /*--End chart-*/

