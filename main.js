// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
let editSelect;
document.addEventListener('DOMContentLoaded', () => {
    removeLi()
    getCalories()
    addNewFormListener()
    addBMRListener()
    addEditListener()
})

const removeLi = () => {
    let caloriesUl = document.getElementById('calories-list')
    while(caloriesUl.firstChild){
        caloriesUl.removeChild(caloriesUl.firstChild)
    }
}


const getCalories = () => {
    fetch('http://localhost:3000/api/v1/calorie_entries')
    .then(resp => resp.json())
    .then(caloriesArr => {
        let totalCalories = 0
        caloriesArr.forEach(calorieObj => {
            totalCalories += calorieObj.calorie
            createCaloriesLi(calorieObj)
        })
        fillProgressBar(totalCalories)
    })
}

const addBMRListener = () => {
    document.getElementById('bmr-calculator').addEventListener("submit", (event) => {
        event.preventDefault()
        let weight = event.target[0].value,
            height = event.target[1].value,
            age = event.target[2].value;
        calculateBMR(weight, height, age)
    })
}

const calculateBMR = (weight, height, age) => {
    let lower = 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age),
        upper = 66 + (6.23 * weight) + (12.7 * height) - (6.8 * age)
    document.getElementById('lower-bmr-range').innerText = lower
    document.getElementById('higher-bmr-range').innerText = upper
    removeLi(), getCalories()
}

const addNewFormListener = () => {
   let form = document.getElementById('new-calorie-form'),
        number = form[0],
        note = form[1];

        form.addEventListener("submit", (event) => {
            event.preventDefault()
        
        fetch('http://localhost:3000/api/v1/calorie_entries', {
            method: 'POST',
            headers: {
                'content-type':'application/json',
                'accept':'application/json'
            },
            body: JSON.stringify({
                calorie: number.value,
                note: note.value
            })
        })
        .then(resp => resp.json())
        .then(json => {
            console.log(json)
            form.reset()
            removeLi()
            getCalories()
            
        })
    })
}

const createCaloriesLi = (calorie) => {
    let calorieLi = document.createElement('li')
    calorieLi.className = "calories-list-item"
    calorieLi.innerHTML = `<div class="uk-grid">
            <div class="uk-width-1-6">
              <strong>${calorie.calorie}</strong>
              <span>kcal</span>
            </div>
            <div class="uk-width-4-5">
              <em class="uk-text-meta">${calorie.note}</em>
            </div>
          </div>
          <div class="list-item-menu">
            <a class="edit-button" id="edit-button-${calorie.id}" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"></a>
            <a class="delete-button" id="delete-button-${calorie.id}" uk-icon="icon: trash"></a>
          </div>`
    document.getElementById('calories-list').append(calorieLi)
    let deleteButton = document.querySelector(`#delete-button-${calorie.id}`)
    let editButton = document.querySelector(`#edit-button-${calorie.id}`)
    addDeleteListener(deleteButton, calorie)
    addEditButtonListener(editButton,calorie.id)
}

const addDeleteListener = (button, calorie) => {
    button.addEventListener("click", () => {
        deleteCalorie(calorie)
    })
}

const addEditButtonListener = (button, calorieId) => {
    button.addEventListener("click", event => {
        editSelect = calorieId
        console.log(editSelect)
    })
}


const editCalorie = (calorieChange,noteChange) => {
    
    fetch(`http://localhost:3000/api/v1/calorie_entries/${editSelect}`, {
        method: 'PATCH',
        headers: {
            'content-type':'application/json',
            'accept':'application/json'
        },
        body: JSON.stringify({
            calorie: calorieChange,
            note: noteChange
        })
    })
    .then(resp => resp.json())
    .then(returned => {
        console.log(returned)
        removeLi()
        getCalories()
    })
}

const addEditListener = () => {
    let form = document.getElementById('edit-calorie-form')

    form.addEventListener('submit', (event) => {
        event.preventDefault()
        
        let calorieChange = event.target[0].value,
            noteChange = event.target[1].value
        editCalorie(calorieChange, noteChange)
        form.reset()
    })
}

const deleteCalorie = (calorie) => {
    fetch(`http://localhost:3000/api/v1/calorie_entries/${calorie.id}`, {
        method: 'DELETE'
    })
    .then(resp => resp.json())
    .then(json => {
        removeLi()
        getCalories()
    })
}

const fillProgressBar = (total) => {
    let progressBar = document.querySelector('.uk-progress'),
        maxBMR = document.getElementById('higher-bmr-range').innerText

    progressBar.max = `${maxBMR}`, progressBar.value = `${total}`
}

