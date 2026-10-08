const recipes = [
  { id: 'cookie', name: 'Choco Cookie', emoji: '🍪', difficulty: 'Easy peasy', ingredients: ['Flour', 'Sugar', 'Chocolate chips'], reward: 8, color: '#a97850', caption: 'A gooey little cookie, coming up!' },
  { id: 'cupcake', name: 'Berry Cupcake', emoji: '🧁', difficulty: 'Sweet & simple', ingredients: ['Flour', 'Egg', 'Berries'], reward: 12, color: '#dfa6b6', caption: 'A berry lovely cupcake!' },
  { id: 'pie', name: 'Apple Pie', emoji: '🥧', difficulty: 'Cozy classic', ingredients: ['Flour', 'Butter', 'Apples'], reward: 15, color: '#d59a55', caption: 'The whole kitchen smells like autumn.' }
];

let selected = recipes[0];
let collected = new Set();
let coins = 0;
let baked = 0;
let toastTimer;

const list = document.querySelector('#recipe-list');
const detail = document.querySelector('#recipe-detail');

function drawRecipes() {
  list.innerHTML = recipes.map(recipe => `
    <button class="recipe-card ${recipe.id === selected.id ? 'active' : ''}" data-recipe="${recipe.id}" aria-pressed="${recipe.id === selected.id}">
      <span class="recipe-emoji">${recipe.emoji}</span><span class="recipe-name">${recipe.name}</span>
    </button>`).join('');
  list.querySelectorAll('.recipe-card').forEach(button => button.addEventListener('click', () => {
    selected = recipes.find(recipe => recipe.id === button.dataset.recipe);
    collected = new Set();
    updateBowl();
    drawRecipes();
    drawDetail();
    document.querySelector('#scene-caption').textContent = 'A fresh batch starts here';
  }));
}

function drawDetail() {
  detail.innerHTML = `
    <div class="detail-top"><strong>${selected.emoji} ${selected.name}</strong><span class="difficulty">${selected.difficulty}</span></div>
    <div class="ingredient-list">${selected.ingredients.map((ingredient, i) => {
      const done = collected.has(i);
      return `<button class="ingredient ${done ? 'done' : ''}" data-ingredient="${i}" ${done ? 'disabled' : ''}>${done ? '✓ ' : '+ '}${ingredient}</button>`;
    }).join('')}</div>
    <button class="bake-button" ${collected.size !== selected.ingredients.length ? 'disabled' : ''}>${collected.size === selected.ingredients.length ? `Bake it!  ·  +${selected.reward} coins` : 'Add all ingredients first'}</button>`;

  detail.querySelectorAll('.ingredient:not(:disabled)').forEach(button => button.addEventListener('click', () => {
    collected.add(Number(button.dataset.ingredient));
    updateBowl();
    drawDetail();
    document.querySelector('#bowl').classList.remove('mix');
    requestAnimationFrame(() => document.querySelector('#bowl').classList.add('mix'));
  }));
  detail.querySelector('.bake-button').addEventListener('click', bake);
}

function updateBowl() {
  const batter = document.querySelector('#batter');
  batter.style.height = `${24 + collected.size * 8}px`;
  batter.style.background = selected.color;
}

function bake() {
  if (collected.size !== selected.ingredients.length) return;
  coins += selected.reward;
  baked += 1;
  document.querySelector('#coins').textContent = coins;
  document.querySelector('#baked-count').textContent = baked;
  document.querySelector('#scene-caption').textContent = selected.caption;
  const bowl = document.querySelector('#bowl');
  bowl.classList.remove('baked');
  requestAnimationFrame(() => bowl.classList.add('baked'));
  showToast(`${selected.emoji} ${selected.name} is ready! +${selected.reward} coins`);
  collected = new Set();
  updateBowl();
  drawDetail();
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
}

drawRecipes();
drawDetail();
