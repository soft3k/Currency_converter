let result = document.getElementById("result");
let select = document.getElementById("rovSelect");
let endSelect = document.getElementById("endRovSelect");
let form = document.getElementById('inputForm');
let sumInput = document.getElementById('inputSum');
let submitBtn = document.getElementById('submitBtn');
let swapBtn = document.getElementById('swapBtn');
let error = document.getElementById('errorSum');


submitBtn.disabled = true;
function getSelectList(){
    select.append(new Option("Загрузка..."));
    endSelect.append(new Option("Загрузка..."));
    fetch('https://api.frankfurter.dev/v1/currencies')
    .then(response=>response.json())
    .then(data=>{
        select.remove(0);
        endSelect.remove(0);
        for(key in data){

            let newSelect = document.createElement('option');
            let newEndSelect = document.createElement('option');

            newSelect.textContent = `${key} - ${data[key]}`;
            newSelect.value = key;
            newEndSelect.textContent = `${key} - ${data[key]}`;
            newEndSelect.value = key;

            select.appendChild(newSelect);
            endSelect.appendChild(newEndSelect);

            
        }
        select.value = 'USD';
        endSelect.value = 'EUR';
    })
    .catch(error=>{
        result.textContent = "Извините, сервер не отвечает";
    })
    .finally(console.log("Fetch is valid"));
}

function convert(e){
    e.preventDefault();
    fetch(`https://api.frankfurter.dev/v1/latest?base=${select.value}&symbols=${endSelect.value}`)
    .then(response=>response.json())
    .then(data=>{
        let resultConvert = parseFloat(sumInput.value) * data.rates[endSelect.value];
        result.textContent = `${resultConvert.toFixed(2)}  ${endSelect.value}`;
        result.style.display = 'block';
    })
    .catch(error=>{
        result.textContent = "Извините, сервер не отвечает";
        console.log('server error');
    })
    .finally(console.log("fetch is valid"));
    
}

function swap(){
    let buf = select.value;
    select.value = endSelect.value;
    endSelect.value = buf;
}

function isBtnsValid(){
    if(select.value == endSelect.value){
        swapBtn.disabled = true;
        submitBtn.disabled = true;

        swapBtn.classList.remove('valid');
        submitBtn.classList.remove('valid');
        
        select.classList.add('error');
        endSelect.classList.add('error');
        
        error.textContent = 'Вы выбрали одинаковую валюту, конвертация не требуется'
    }
    else{
        swapBtn.disabled = false;
        
        swapBtn.classList.add('valid');

        select.classList.remove('error');
        endSelect.classList.remove('error');

        error.textContent = '';
        isSubBtnValid();
    }
}
function isSubBtnValid(){
    if(sumInput.value != ''&& sumInput.value != 0){
        submitBtn.disabled = false;
        submitBtn.classList.add('valid');
    }
    else{
        submitBtn.disabled = true;
        submitBtn.classList.remove('valid');
    }
}

function validSum(){
    let regSum = /^\d{1,10}$/;
    sumInput.value = sumInput.value
    .replace(/[a-zA-Z]/gi , '')
    .replace(/[!,@,#,$,%,^,&,*,(,),\-,=,_,+,[,\],\\,\,,\',\",\`,\>,~,>,<,?,/,{,},;,:,|]/g , '')
    .trim();
    isBtnsValid();
}


getSelectList();
sumInput.addEventListener('input',validSum);
form.addEventListener('submit',convert);
swapBtn.addEventListener('click',swap);
select.addEventListener('change',isBtnsValid);
endSelect.addEventListener('change',isBtnsValid);




