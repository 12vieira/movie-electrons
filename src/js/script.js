// -------------------------------
// Seleciona os elementos principais da interface
// -------------------------------

// Pega a <ul> onde as tarefas serão exibidas
const lista = document.getElementById("ul__movie");

// Pega o botão "Adicionar"
const botaoAdd = document.querySelector(".card__movie_btn_add");

// Pega o campo de texto onde o usuário digita a tarefa
const input = document.getElementById("inputMovie");



// -------------------------------
// LocalStorage - Função para salvar os dados
// -------------------------------
function salvarNoLocalStorage() {
  const itens = []; // array que vai armazenar todas as tarefas

  // Pega todos os <li> existentes e salva cada um no array "itens"
  document.querySelectorAll("#ul__movie li").forEach(li => {
    itens.push({
      texto: li.childNodes[0].textContent,   // texto da tarefa (primeiro nó do <li>)
      categoria: li.classList.contains("serie") ? "serie" : "filme", // categoria (filme ou série)
      assistido: li.classList.contains("checked") // se a tarefa está marcada como concluída
    });
  });

  // Salva o array como texto dentro do localStorage
  localStorage.setItem("movies", JSON.stringify(itens));
}



// -------------------------------
// Função que cria um novo item <li> com o texto digitado
// -------------------------------
function criarItem(texto, categoria = "filme", assistido = false) {

  // Cria o elemento <li> que representa a tarefa
  const li = document.createElement("li");

  // Coloca o texto da tarefa dentro do <li>
  li.textContent = texto;
  li.classList.add(categoria); // adiciona a classe "filme" ou "serie"

  // Se o item estava marcado como concluído no localStorage, aplicamos a classe "checked"
  if (assistido) {
    li.classList.add("checked");
  }

  // Cria o botão "Deletar" para excluir a tarefa
  const btn = document.createElement("span");
  btn.textContent = "Deletar";   // texto dentro do botão
  btn.className = "close";       // classe usada no CSS para estilização

  // Coloca o botão dentro do <li>
  li.appendChild(btn);

  // Retorna o <li> pronto para ser colocado na tela
  return li;
}



// -------------------------------
// LocalStorage - Carregar dados salvos ao iniciar
// -------------------------------
function carregarFilmes() {

  // Tenta recuperar os dados salvos
  const filmesSalvos = JSON.parse(localStorage.getItem("movies"));

  // Se não tem nada salvo, simplesmente não faz nada
  if (!filmesSalvos) return;

  // Para cada filme salvo, reconstruímos a interface usando criarItem()
  filmesSalvos.forEach(item => {
    lista.appendChild(criarItem(item.texto, item.categoria, item.assistido));
  });
}

// Executa o carregamento das tarefas ao abrir o app
carregarFilmes();



// -------------------------------
// Evento: clicar no botão "Adicionar"
// -------------------------------
const selectCategory = document.getElementById("selectCategory");
botaoAdd.addEventListener("click", () => {

  // Pega o texto digitado e remove espaços extras
  const texto = input.value.trim();

  // Validação: se o usuário não digitou nada
  if (!texto) {
    alert("Digite um filme ou série!");
    return; // interrompe a função
  }

  // Cria o <li> com a nova tarefa e adiciona na lista
  const categoria = selectCategory.value; // pega 'movie' ou 'series'
  lista.appendChild(criarItem(texto, categoria));
  // Salva a lista atualizada no localStorage
  salvarNoLocalStorage();

  // Limpa o campo de texto depois de adicionar a tarefa
  input.value = "";
});



// -------------------------------
// Delegação de eventos na lista inteira
// (para marcar tarefa como feita ou deletar)
// -------------------------------
lista.addEventListener("click", (e) => {

  // -----------------------------------------------------
  // 1️⃣ Se o clique foi no texto da tarefa (<li>)
  // -----------------------------------------------------
  if (e.target.tagName === "LI") {

    // Alterna a classe "checked" (marca/desmarca como concluída)
    e.target.classList.toggle("checked");

    // Salva o novo estado no localStorage
    salvarNoLocalStorage();
  }

  // -----------------------------------------------------
  // 2️⃣ Se o clique foi no botão "Deletar"
  // -----------------------------------------------------
  if (e.target.classList.contains("close")) {
    const li = e.target.parentElement;
    li.classList.add("removing");
    setTimeout(() => {
      li.remove();
      salvarNoLocalStorage();
    }, 200);
  }
});
