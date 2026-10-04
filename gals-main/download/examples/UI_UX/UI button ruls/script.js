window.onload = function(){
const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');
const btn1 = document.getElementById('radio1-1');
const btn2 = document.getElementById('radio1-2');



  

btn1.addEventListener('click', function(){

 ctx2.style.display="none"

/*

myChart.update()*/
 console.log(event.target.id)
 
 


const myChart = new Chart(ctx, {
   
    type: "bar",
         
    
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [1,8,3,5,10, 6],
        borderWidth: 1,
         borderColor: '#00ccff',
        backgroundColor: '#444',
      borderWidth: 1,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


});



btn2.addEventListener('click', function(event){

 ctx.style.display="none"
//myChart.update();

const myChart2 = new Chart(ctx2, {
   
    type: "line",
         
    
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [1,8,3,5,10, 6],
        borderWidth: 1,
         borderColor: '#00ccff',
        backgroundColor: '#444',
      borderWidth: 1,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });




console.log(event.target.id)
//console.log(myChart.type)
});



}