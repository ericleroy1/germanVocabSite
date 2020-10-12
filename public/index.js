

function filterFunction(){
    const filter = document.querySelector('.checkbox:checked').value;
    const trs = document.querySelectorAll('#myTable tr:not(.header)');
    trs.forEach(tr => tr.style.display = [...tr.children].find(td => td.innerHTML.includes(filter)) ? '' : 'none');
};

// var ctx = document.getElementById('myChart2').getContext('2d');
// var chart = new Chart(ctx, {
//     // The type of chart we want to create
//     type: 'horizontalBar',
//
//     // The data for our dataset
//     data: {
//         labels: ['Nouns', 'Verbs', 'Adjectives/Adverbs', 'Others'],
//         datasets: [{
//             label: 'My Word Bank',
//             backgroundColor: 'rgb(255, 99, 132)',
//             borderColor: 'rgb(255, 99, 132)',
//             data: [10, 5, 2, 20]
//         }]
//     },
//
//     // Configuration options go here
//     options: {}
// });
//
// var ctx2 = document.getElementById('myChart').getContext('2d');
// var chart = new Chart(ctx2, {
//     // The type of chart we want to create
//     type: 'horizontalBar',
//
//     // The data for our dataset
//     data: {
//         labels: ['Hard', 'Medium', 'Easy'],
//         datasets: [{
//             label: 'My First dataset',
//             backgroundColor: 'rgb(255, 99, 132)',
//             borderColor: 'rgb(255, 99, 132)',
//             data: [10, 5, 2, 20]
//         }]
//     },
//
//     // Configuration options go here
//     options: {}
// });
