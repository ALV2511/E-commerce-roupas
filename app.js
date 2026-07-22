// 1. DADOS DOS PRODUTOS (Simulando o banco de dados)
const produtos = [
  {
    id: 1,
    nome: "Camiseta Oversized Streetwear",
    preco: 119.90,
    tamanhos: ["P", "M", "G", "GG"],
    imagem: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop"
  },
  {
    id: 2,
    nome: "Calça Cargo Utilitária",
    preco: 219.90,
    tamanhos: ["38", "40", "42"],
    imagem: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=500&auto=format&fit=crop"
  },
  {
    id: 3,
    nome: "Moletom Canguru Off-White",
    preco: 259.90,
    tamanhos: ["M", "G"],
    imagem: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop"
  }
];

let carrinho = [];

// 2. DESENHAR OS PRODUTOS NA TELA
function renderizarProdutos() {
  const container = document.getElementById("grade-produtos");
  container.innerHTML = "";

  produtos.forEach(prod => {
    container.innerHTML += `
      <div class="bg-white rounded-lg shadow-sm border p-4 flex flex-col justify-between">
        <div>
          <img src="${prod.imagem}" alt="${prod.nome}" class="w-full h-64 object-cover rounded-md mb-4">
          <h3 class="font-semibold text-lg leading-tight mb-1">${prod.nome}</h3>
          <p class="text-gray-900 font-bold mb-3">R$ ${prod.preco.toFixed(2).replace('.', ',')}</p>
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

  // Atualiza os ícones da tela
  lucide.createIcons();
}

// 3. LÓGICA DO CARRINHO
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

  // Atualiza contador de itens
  const totalQtd = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
  contador.innerText = totalQtd;

  // Atualiza lista visual
  if (carrinho.length === 0) {
    containerItens.innerHTML = `<p class="text-gray-500 text-center py-8">Seu carrinho está vazio.</p>`;
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

// 4. ABRIR E FECHAR O PAINEL DO CARRINHO
function alternarCarrinho() {
  const painel = document.getElementById("carrinho-painel");
  painel.classList.toggle("translate-x-full");
}

// Inicializar a aplicação
renderizarProdutos();