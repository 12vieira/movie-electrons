// -------------------------------
// Seleção dos elementos principais
// -------------------------------
const lista = document.getElementById("ul__movie");
const botaoAdd = document.querySelector(".card__movie_btn_add");
const input = document.getElementById("inputMovie");
const selectCategory = document.getElementById("selectCategory");
const selectFilter = document.getElementById("selectFilter");

// -------------------------------
// Função para salvar no LocalStorage
// -------------------------------
function salvarNoLocalStorage() {
  const itens = [];

  document.querySelectorAll("#ul__movie li").forEach(li => {
    itens.push({
      texto: li.querySelector("span").textContent,
      categoria: li.classList.contains("serie") ? "serie" : "filme",
      status: li.dataset.status,
      avaliacao: Number(li.dataset.rating) || 0
    });
  });

  localStorage.setItem("movies", JSON.stringify(itens));
}

// -------------------------------
// Função para aplicar filtro
// -------------------------------
function aplicarFiltro() {
  const filtro = selectFilter.value;
  document.querySelectorAll("#ul__movie li").forEach(li => {
    li.style.display = (filtro === "todos" || li.dataset.status === filtro) ? "flex" : "none";
  });
}

selectFilter.addEventListener("change", aplicarFiltro);

// -------------------------------
// Função para criar avaliação (estrelas)
// -------------------------------
function criarAvaliacao(valor = 0) {
  const rating = document.createElement('div');
  rating.className = 'rating';

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.textContent = '⭐';
    star.dataset.value = i;

    if (i <= valor) star.classList.add('active');

    rating.appendChild(star);
  }

  return rating;
}

// -------------------------------
// Função para criar item <li>
// -------------------------------
function criarItem(texto, categoria = "filme", status = "pendente", avaliacao = 0) {
  const li = document.createElement("li");
  li.classList.add(categoria, status);
  li.dataset.status = status;
  li.dataset.rating = avaliacao;
  li.style.position = 'relative';

  const spanTexto = document.createElement("span");
  spanTexto.textContent = texto;
  li.appendChild(spanTexto);

  if (status === "finalizado") {
    li.appendChild(criarAvaliacao(avaliacao));
  }

  const btn = document.createElement("span");
  btn.textContent = "Deletar";
  btn.className = "close";
  li.appendChild(btn);

  return li;
}

// -------------------------------
// Carregar itens salvos
// -------------------------------
function carregarFilmes() {
  const filmesSalvos = JSON.parse(localStorage.getItem("movies"));
  if (!filmesSalvos) return;

  filmesSalvos.forEach(item => {
    lista.appendChild(criarItem(item.texto, item.categoria, item.status, item.avaliacao));
  });
}

carregarFilmes();

// -------------------------------
// Função para obter próximo status
// -------------------------------
function proximoStatus(atual) {
  if (atual === 'pendente') return 'assistindo';
  if (atual === 'assistindo') return 'finalizado';
  return 'pendente';
}

// -------------------------------
// Evento: adicionar novo item
// -------------------------------
botaoAdd.addEventListener("click", () => {
  const texto = input.value.trim();
  if (!texto) {
    alert("Digite um filme ou série!");
    return;
  }

  const categoria = selectCategory.value;
  lista.appendChild(criarItem(texto, categoria));
  salvarNoLocalStorage();
  aplicarFiltro();

  input.value = "";
});

// -------------------------------
// Delegação de eventos na lista
// -------------------------------
lista.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  // ⭐ Clique na estrela
  if (e.target.classList.contains("star")) {
    e.stopPropagation(); // evita mudar status
    const valor = Number(e.target.dataset.value);
    li.dataset.rating = valor;

    li.querySelectorAll(".star").forEach(star => {
      star.classList.toggle("active", Number(star.dataset.value) <= valor);
    });

    salvarNoLocalStorage();
    return;
  }

  // 🗑️ Clique no botão deletar
  if (e.target.classList.contains("close")) {
    li.classList.add("removing");
    setTimeout(() => {
      li.remove();
      salvarNoLocalStorage();
    }, 200);
    return;
  }

  // ✅ Clique no li → mudar status
  const atual = li.dataset.status;
  const novo = proximoStatus(atual);

  li.classList.remove(atual);
  li.classList.add(novo);
  li.dataset.status = novo;

  const ratingExistente = li.querySelector(".rating");

  if (novo === "finalizado" && !ratingExistente) {
    li.appendChild(criarAvaliacao(Number(li.dataset.rating)));
  }

  if (novo !== "finalizado" && ratingExistente) {
    ratingExistente.remove();
  }

  salvarNoLocalStorage();
  aplicarFiltro();
});
