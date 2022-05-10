
const input_x_start = document.querySelector(".input-x-start");
const input_x_end = document.querySelector(".input-x-end");
const input_accuracy = document.querySelector(".input-accuracy");
const input_population_size = document.querySelector(".input-population-size");
const input_iteration_number = document.querySelector(".input-iteration-number");
const output_chromosome_size = document.querySelector(".output-chromosome-size");
const button_div = document.querySelector(".button-div");
const iteration_header = document.querySelector(".iteration-header");
const result_content = document.querySelector(".result-content");

const submit_variables_button = document.querySelector(".submit-variables");
const step_forvard_button = document.querySelector(".step-forvard-button");
const result_button = document.querySelector(".result-button");

let xStart, xEnd, accuracy, populationSize, iterationNumber, chromosomeSize, iterationCount, TableGlobal;
let R, kol;
let chromosomeArr = [], xArr = [], yArr = [];

const y = (x) => ((x-155)**2 + 100);

const xFromChoromosome = (chromosome, chromosomeSize, xStart, xEnd) =>
{
    let delta = (xEnd - xStart)/(2**chromosomeSize);
    let x = xStart + delta * parseInt(chromosome, 2); 
    return x;
}

const getRandom = (min, max) => Math.random() * (max - min) + min;

const choseParents = (copyMas, populationSize, sum) =>
{
    let parent1, parent2;
    let idMas = copyMas.map((value, index) => index);

    let chance = Math.random() * sum;
    parent1 = idMas[copyMas.findIndex((value) => chance <= value)];
    copyMas.splice(parent1, 1);
    idMas.splice(parent1, 1);

    chance = Math.random() * sum;
    parent2 = idMas[copyMas.findIndex((value) => chance <= value)];
    return [parent1, parent2];
}

submit_variables_button.onclick = initVariables;
function initVariables()
{
    xStart = parseFloat(input_x_start.value);
    xEnd = parseFloat(input_x_end.value);
    if(xStart > xEnd)
    {
        button_div.style.visibility = "hidden";
        iteration_header.style.visibility = "hidden";
        alert("Неверные данные! (начальное значение меньше конечного)");
        return;
    }
    accuracy = 1/(10 ** parseInt(input_accuracy.value));
    populationSize = parseInt(input_population_size.value);
    iterationNumber = parseInt(input_iteration_number.value);

    R = Math.abs(xEnd - xStart);
    kol = Math.floor((R / accuracy)+1);

    chromosomeSize = 1;
    while( kol > 2**chromosomeSize)
        chromosomeSize++;

    output_chromosome_size.innerText = chromosomeSize;

    StartPopulation();
}

function StartPopulation()
{
    chromosomeArr = []; xArr = []; yArr = [];
    for(let i = 0; i < populationSize; i++)
    {
        let chromosome = "";
        for(let j = 0; j < chromosomeSize; j++)
        {   
            chromosome += (Math.round(Math.random()) == 1) ? '1' : '0';
        }
        chromosomeArr[i] = chromosome;
        xArr[i] = xFromChoromosome(chromosome, chromosomeSize, xStart, xEnd);
        yArr[i] = y(xArr[i]); 
    }

    let outputTable = document.createElement("table");
    outputTable.appendChild(document.createElement("tbody"));
    for(let i = 0; i < populationSize; i++)
    {
        outputTable.tBodies[0].appendChild(document.createElement("tr"));
        for(let j = 0; j < 5; j++)
        {
            outputTable.rows[i].appendChild(document.createElement("td"));
        }
        outputTable.tBodies[0].rows[i].cells[0].innerText = `${i+1}`;
        outputTable.tBodies[0].rows[i].cells[1].innerText = `${chromosomeArr[i]}`;
        outputTable.tBodies[0].rows[i].cells[2].innerText = `${xArr[i].toFixed(input_accuracy.value)}`;
        outputTable.tBodies[0].rows[i].cells[3].innerText = `${yArr[i].toFixed(input_accuracy.value)}`;
    }

    outputTable.prepend(document.createElement("thead"));
    outputTable.tHead.appendChild(document.createElement("tr"));
    outputTable.tHead.appendChild(document.createElement("tr"));
    for(let i = 0; i < 2; i++)
    {
        for(let j = 0; j < 5; j++)
        {
            outputTable.tHead.rows[i].appendChild(document.createElement("td"));
        }
    }

    outputTable.tHead.rows[0].cells[0].innerText = "№";
    outputTable.tHead.rows[0].cells[1].innerText = "Хромосома";
    outputTable.tHead.rows[0].cells[2].innerText = "X";
    outputTable.tHead.rows[0].cells[3].innerText = "Y";
    outputTable.tHead.rows[0].cells[4].innerText = "Модификация";

    let bestChromosome = yArr.reduce((minIndex, value, index) => (yArr[minIndex] > value) ? index : minIndex, 0);

    outputTable.tHead.rows[1].cells[0].innerText = `${bestChromosome + 1}`;
    outputTable.tHead.rows[1].cells[1].innerText = `${chromosomeArr[bestChromosome]}`;
    outputTable.tHead.rows[1].cells[2].innerText = `${xArr[bestChromosome].toFixed(input_accuracy.value)}`;
    outputTable.tHead.rows[1].cells[3].innerText = `${yArr[bestChromosome].toFixed(input_accuracy.value)}`;

    result_content.removeChild(document.querySelector("table"));
    TableGlobal = result_content.appendChild(outputTable);

    iterationCount = 0;
    iteration_header.innerHTML = "Итерация: 0<br>Новое поколение";
    button_div.style.visibility = "visible";
    iteration_header.style.visibility = "visible";
}

step_forvard_button.onclick = crosingOver;
function crosingOver()
{
    
    let firstParent, secondParent;

    let [sum, Mas] = yArr.reduce(
        ([sum, Mas], element) => [sum + (1 / element) * 10000000, Mas.concat([sum + (1 / element) * 10000000])],
        [0, []]
    );

    let newGeneration = []; let parents = []; COPoints = [];
    for(let i = 0; i < Math.floor(populationSize / 2); i++)
    {
        [firstParent, secondParent] = choseParents([...Mas], populationSize, sum);
        let crossingOverPoint = Math.floor(getRandom(Math.floor(chromosomeSize / 2) - 2, Math.floor(chromosomeSize / 2) + 3));
        let firstChild = chromosomeArr[firstParent].substring(0, crossingOverPoint) + chromosomeArr[secondParent].substring(crossingOverPoint);
        let secondChild = chromosomeArr[secondParent].substring(0, crossingOverPoint) + chromosomeArr[firstParent].substring(crossingOverPoint);
        COPoints.push(crossingOverPoint, crossingOverPoint);
        parents.push([firstParent, secondParent]);
        parents.push([secondParent, firstParent]);
        newGeneration.push(firstChild, secondChild);
    }

    newGeneration.forEach((element) => {
        chromosomeArr.push(element);
        xArr.push(xFromChoromosome(element, chromosomeSize, xStart, xEnd));
        yArr.push(y(xArr.slice(-1)));
    });

    for(let i = 0; i < newGeneration.length; i++)
    {
        let row = TableGlobal.tBodies[0].appendChild(document.createElement("tr"));
        for(let j = 0; j < 5; j++)
        {
            row.appendChild(document.createElement("td"));
        }
        row.cells[0].innerText = `${populationSize + i + 1}`;
        row.cells[1].innerText = `${chromosomeArr[populationSize+i]}`;
        row.cells[2].innerText = `${xArr[populationSize + i].toFixed(input_accuracy.value)}`;
        row.cells[3].innerText = `${yArr[populationSize + i].toFixed(input_accuracy.value)}`;
        row.cells[4].innerText += `K(${parents[i][0] + 1}+${parents[i][1] + 1}in${COPoints[i]})`;
    }
    iteration_header.innerHTML = `Итерация: ${iterationCount}<br>Кросинговер`;

    step_forvard_button.onclick = () => {mutation(newGeneration)};
}

function mutation(newGeneration)
{
    let mutationChance = 0.05;

    let mutatedNewGeneration = newGeneration.reduce((mas, element) => 
        mas.concat([element
            .split('')
            .map((char) => (Math.random() < mutationChance) ? ((char === '0') ? '1' : '0') : char)
            .join('')])
    , []);
    
    let mutaions = mutatedNewGeneration.reduce((mas, element, i) =>
        mas.concat([element
            .split('')
            .map((char, id) => [id, char])
            .filter((char, id) => char[1] != newGeneration[i].split('')[id])])
    ,[]);

    mutatedNewGeneration.forEach((element, i) => {
        chromosomeArr[populationSize + i] = element;
        xArr[populationSize + i] = xFromChoromosome(element, chromosomeSize, xStart, xEnd);
        yArr[populationSize + i] = y(xArr[populationSize + i]);
    });
    
    for(let i = 0; i < newGeneration.length; i++)
    {
        TableGlobal.tBodies[0].rows[populationSize + i].cells[0].innerText = `${populationSize + i + 1}`;
        TableGlobal.tBodies[0].rows[populationSize + i].cells[1].innerText = `${chromosomeArr[populationSize+i]}`;
        TableGlobal.tBodies[0].rows[populationSize + i].cells[2].innerText = `${xArr[populationSize + i].toFixed(input_accuracy.value)}`;
        TableGlobal.tBodies[0].rows[populationSize + i].cells[3].innerText = `${yArr[populationSize + i].toFixed(input_accuracy.value)}`;
        TableGlobal.tBodies[0].rows[populationSize + i].cells[4].innerText += (mutaions[i].length != 0) ? ` М(${mutaions[i].map((elem) => elem[0] + 1).join()})` : '';
    }   
    iteration_header.innerHTML = `Итерация: ${iterationCount}<br>Мутация`;
    populationSize += newGeneration.length;
    step_forvard_button.onclick = selection();
}

function selection()
{
    
}


//find min value of a function