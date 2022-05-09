
let input_x_start = document.querySelector(".input-x-start");
let input_x_end = document.querySelector(".input-x-end");
let input_accuracy = document.querySelector(".input-accuracy");
let input_population_size = document.querySelector(".input-population-size");
let input_iteration_number = document.querySelector(".input-iteration-number");
let output_chromosome_size = document.querySelector(".output-chromosome-size");
let button_div = document.querySelector(".button-div");
let result_content = document.querySelector(".result-content");

let submit_variables_button = document.querySelector(".submit-variables");
let step_forvard_button = document.querySelector(".step-forvard-button");
let result_btton = document.querySelector(".result-btton");

let xStart, xEnd, accuracy, populationSize, iterationNumber, chromosomeSize;
let R, kol;

submit_variables_button.onclick = initVariables;
function initVariables()
{
    xStart = parseFloat(input_x_start.value);
    xEnd = parseFloat(input_x_end.value);
    if(xStart > xEnd)
    {
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
    // let outputTable = document.createElement("table");
    // for(let i = 0; i < 10; i++)
    // {
    //     outputTable.appendChild(document.createElement("tr"));
    //     for(let j = 0; j < 10; j++)
    //     {
    //         outputTable.rows[i].appendChild(document.createElement("td"));
    //         outputTable.rows[i].cells[j].innerText = `${i}  ${j}`;
    //     }
    // }
    // outputTable = result_content.appendChild(outputTable);
    // outputTable.rows[0].cells[0].innerText = "asdasfa";

    
}