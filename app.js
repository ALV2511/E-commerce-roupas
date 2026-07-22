// 1. CONEXÃO COM O SUPABASE
const SUPABASE_URL = "https://rtzlswsbywvqpeynzfqt.supabase.co";
// Cole aqui a sua Publishable Key completa que copiou do painel:
const SUPABASE_KEY = "sb_publishable_xKFbqTiOkI2jrp3670_tNw_N9pQWy1M"; 

// Inicializa o cliente através do objeto global do CDN
const { createClient } = window.supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let produtos = [];
let carrinho = [];

// 2. BUSCAR PRODUTOS DO BANCO DE DADOS (SUPABASE)
async function carregarProdutosDoBanco() {
  const container = document.getElementById("grade-produtos");
  container.innerHTML = `<p class="text-gray-500 col-span-3 text-center py-8">A carregar produtos...</p>`;

  // Procura todos os registos da tabela 'produtos'
  const { data, error } = await _supabase
    .from('produtos')
    .select('*');

  if (error) {
    console.error('Erro ao carregar produtos do Supabase:', error);
    container.innerHTML = `<p class="text-red-500 col-span-3 text-center py-8">Erro ao carregar os produtos.</p>`;
    return;
  }

  // Converte a string de tamanhos ("P, M, G") num Array do JS (["P", "M", "G"])
  produtos = data.map(prod => ({
    ...prod,
    tamanhos: typeof prod.tamanhos === 'string' 
      ? prod.tamanhos.split(',').map(t => t.trim()) 
      : (prod.tamanhos || ["Único"])
  }));

  renderizarProdutos();
}

// 3. DESENHAR OS PRODUTOS NA TELA
function renderizarProdutos() {
  const container = document.getElementById("grade-produtos");
  container.innerHTML = "";

  if (produtos.length === 0) {
    container.innerHTML = `<p class="text-gray-500 col-span-3 text-center py-8">Nenhum produto encontrado na base de dados.</p>`;
    return;
  }

  produtos.forEach(prod => {
    container.innerHTML += `
      <div class="bg-white rounded-lg shadow-sm border p-4 flex flex-col justify-between">
        <div>
          <img src="${prod.imagem}" alt="${prod.nome}" class="w-full h-64 object-cover rounded-md mb-4">
          <h3 class="font-semibold text-lg leading-tight mb-1">${prod.nome}</h3>
          <p class="text-gray-900 font-bold mb-3">R$ ${Number(prod.preco).toFixed(2).replace('.', ',')}</p>
        </div>
        
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Tamanho:</label>
          <select id="tamanho-${prod.id}" class="w-full border rounded p-2 text-sm mb-3">
            ${prod.tamanhos.map(t => `<option value="${t}">${t}</option>`).join('')}
          </select>
          
          <button 
            onclick="adicionarAoCarrinho(${prod.id})" 
            class="w-full bg-black text-white py-2 rounded-md font-medium text-sm hover:bg-gray-800 transition flex items-center justify-center gap-2">
            <i data-lucide="shopping-cart" class="w-4 h-4"></i> Adicionar
          </button>
        </div>
      </div>
    `;
  });

  // Atualiza os ícones da biblioteca Lucide
  if (window.lucide) {
    lucide.createIcons();
  }
}

// 4. LÓGICA DO CARRINHO
function adicionarAoCarrinho(idProduto) {
  const produto = produtos.find(p => p.id === idProduto);
  const tamanho = document.getElementById(`tamanho-${idProduto}`).value;

  const itemExistente = carrinho.find(item => item.id === idProduto && item.tamanho === tamanho);

  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({ ...produto, tamanho, quantidade: 1 });
  }

  atualizarCarrinho();
}

function atualizarCarrinho() {
  const containerItens = document.getElementById("itens-carrinho");
  const contador = document.getElementById("contador-carrinho");
  const totalElemento = document.getElementById("total-carrinho");

  const totalQtd = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
  contador.innerText = totalQtd;

  if (carrinho.length === 0) {
    containerItens.innerHTML = `<p class="text-gray-500 text-center py-8">O seu carrinho está vazio.</p>`;
    totalElemento.innerText = "R$ 0,00";
    return;
  }

  containerItens.innerHTML = "";
  let valorTotal = 0;

  carrinho.forEach(item => {
    valorTotal += item.preco * item.quantidade;
    containerItens.innerHTML += `
      <div class="flex items-center justify-between border-b pb-3">
        <div>
          <h4 class="font-medium text-sm">${item.nome}</h4>
          <p class="text-xs text-gray-500">Tam: ${item.tamanho} | Qtd: ${item.quantidade}</p>
          <p class="text-sm font-bold">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</p>
        </div>
      </div>
    `;
  });

  totalElemento.innerText = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
}

function alternarCarrinho() {
  const painel = document.getElementById("carrinho-painel");
  painel.classList.toggle("translate-x-full");
}

// Executa a busca na base de dados assim que a página carrega
carregarProdutosDoBanco();
