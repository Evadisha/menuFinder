const search = document.getElementById("search");
const submit = document.getElementById ("submit");
const random = document.getElementById("random");
const resultHeading = document.getElementById("result-heading");
const mealsEl = document.getElementById("meals");
const singleMealEl = document.getElementById("single-meal");

// Functions

// 1. Search meal by Keyword
function searchMeal(e) {
    e.preventDefault();

    // Clear single meal
    singleMealEl.innerHTML = '';

    // Get search term
    const term = search.value;

    // Check for empty
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`
                
                if (data.meals == null) {
                    resultHeading.innerHTML = `<p>There are no search results. TRY AGAIN!!</p>`;
                    meals.innerHTML = "";
                    singleMealEl = "";
                }
                else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                    <div class="meal">
                        <image src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                    `
                    )
                    .join('')
                }
            })
        // CLear search input
        search.value = '';
    }
    else {
        alert("Please enter a search item.");
    }
}

// 2. Get meal info by the meal ID
function getMealByID(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        })
}

// 3. Adding single-meal info to page
function addMealToDOM(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++){

        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
        else {
            break;
        }
    }

    singleMealEl.innerHTML = `
            <div class="single-meal">
                <h1>${meal.strMeal}</h1>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" >
                <div class="single-meal-info">
                    ${meal.strCategory ? `<p>${meal.strCategory}</p>`: ""}
                    ${meal.strArea ? `<p>${meal.strArea}</p>`: ""}
                </div>
                <div class="main">
                    <p>${meal.strInstructions}</p>
                    <h2>Ingredients</h2>
                    <ul>
                        ${ingredients.map(obj => `<li>${obj}</li>`).join('')}
                    </ul>
                </div>
            </div>
    `
}

// 4. Adding random meal info to page
function randomMeal() {
    mealsEl.innerHTML = "";
    resultHeading.innerHTML = "";

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        })
}


// Event listeners 
// 1. For submit
submit.addEventListener('submit', searchMeal);

// 2. For random meal
random.addEventListener('click', randomMeal);

// 3. For more info on the selected meal for the meals selection
mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains("meal-info");
        }
        else {
            return false;
        }
    })

    if (mealInfo) {
        const mealId = mealInfo.getAttribute('data-mealid');
        getMealByID(mealId);
    }
})