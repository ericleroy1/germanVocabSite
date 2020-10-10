

function filterFunction(){
    const filter = document.querySelector('.checkbox:checked').value;
    const trs = document.querySelectorAll('#myTable tr:not(.header)');
    trs.forEach(tr => tr.style.display = [...tr.children].find(td => td.innerHTML.includes(filter)) ? '' : 'none');
};
