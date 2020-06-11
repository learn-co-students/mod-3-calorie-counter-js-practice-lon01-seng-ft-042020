const urlApi = 'http://localhost:3000/api/v1/calorie_entries';
let spanLower = document.getElementById('lower-bmr-range');
let spanHigher = document.getElementById('higher-bmr-range');
let addButton = document.querySelector('#new-calorie-form');
let calculateForm = document.getElementById('bmr-calulator');
let progressBar = document.querySelector('.uk-progress');


document.addEventListener('DOMContentLoaded', () => {

  getAllObjects();
})


function getAllObjects() {
    fetch(urlApi)
      .then(arrayObjects => arrayObjects.json())
      .then(arrayObjects => renderAllObjects(arrayObjects));
  }

function createLi(object) {
  const li = document.createElement('li');
  li.innerHTML = ` <div class="uk-grid">
    <div class="uk-width-1-6">
    <strong>${object.calorie}</strong>
    <span>kcal</span>
    </div>
    <div class="uk-width-4-5">
    <em class="uk-text-meta">${object.note}</em>
    </div>
    </div>
    <div class="list-item-menu">
    </div>`;
  const deleteButton = document.createElement('button');
  deleteButton.setAttribute("uk-icon","icon: trash");
  deleteButton.classList.add("delete-button");
  li.append(deleteButton);
  deleteButton.addEventListener('click', e => deleteCalorieFunction(e, object, li))

  const editButton = document.createElement('button');
  editButton.setAttribute("uk-icon","icon: pencil");
  editButton.classList.add("edit-button");
  li.append(editButton);
  // editButton.addEventListener('click', e => editCalorieFunction(e, object, li))
  li.className = "calories-list-item";

  return li
}

let countArray = [];

function renderLi(object) {
  countArray.push(object);
  const ul = document.getElementById("calories-list");
  li = createLi(object);
  ul.append(li);
  reduceFunction(countArray);

  return ul
}

function renderAllObjects(arrayObjects) {
  arrayObjects.forEach(object => {
    renderLi(object)
  });
}

function reduceFunction(countArray) {
  let total = countArray.map(object => object.calorie).reduce((total, e) => e + total);
  progressBar.max = 5000;
  progressBar.value = total;
}

addButton.addEventListener('submit', e => addCalorieFunction(e))

function addCalorieFunction(e) {
  e.preventDefault();
  let object = {
  calorie: `${e.target[0].value}`,
  note: `${e.target[1].value}`
  };
  let configObject = {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
  },
  body: JSON.stringify(object)
  };
  
  fetch(urlApi, configObject)
  .then(resp => resp.json())
  .then(newObject => renderLi(newObject))
  .catch(error => console.log(error));
}


function deleteCalorieFunction(e, object, li) {
  e.preventDefault();
 
  let configObject = {
  method: 'DELETE',
  }
  fetch(`${urlApi}/${object.id}`, configObject)
  .then(resp => resp.json())
  .then(li.remove())
  .catch(error => console.log(error));

  countArray = countArray.filter(ob => object != ob);
  reduceFunction(countArray);

}

function editCalorieFunction(e, objectCalorie, li) {
  const form = document.getElementById('new-calorie-form');

  let object = {
  calorie: `${e.target[0].value}`,
  note: `${e.target[1].value}`
  };
  
  let configObject = {
  method: 'PATCH',
  headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
  },
  body: JSON.stringify(object)
  };
  
  fetch(`${urlApi}/${objectCalorie.id}/edit`, configObject)
  .then(resp => resp.json())
  .then(data => renderLi(data))
  .catch(error => console.log(error));

  li.remove
}

calculateForm.addEventListener('submit', e => calculateBMR(e))

function calculateBMR(e) {
  e.preventDefault();
  let weight = e.target[0].value;
  let height = e.target[0].value;
  let age = e.target[0].value;

  let lowerBMR = 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age);
  let upperBMR = 66 + (6.23 * weight) + (12.7 * height) - (6.8 * age);
  let avg = (lowerBMR + upperBMR)/2;

  spanLower.innerText = lowerBMR;
  spanHigher.innerText = upperBMR;
  progressBar.max = avg;
}