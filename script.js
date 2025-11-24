// Variáveis principais
let cardContainer = document.querySelector("#card-container");
let emptyState = document.getElementById("empty-state");
let welcomeScreen = document.getElementById("welcome-screen");
let loadingState = document.getElementById("loading-state");
let resultsHeader = document.getElementById("results-header");
let resultsCount = document.getElementById("results-count");
let clearSearchBtn = document.getElementById("clear-search");
let dados = [];
let termoBuscaAtual = "";

// Função para buscar exemplo (da tela inicial)
function BuscarExemplo(termo) {
    let inputBusca = document.getElementById('busca-input');
    if (inputBusca) {
        inputBusca.value = termo;
    }
    IniciarBusca();
}

// Função para limpar busca
function LimparBusca() {
    let inputBusca = document.getElementById('busca-input');
    if (inputBusca) {
        inputBusca.value = "";
    }
    VoltarInicio();
}

// Função para voltar à página inicial
function VoltarInicio() {
    // Limpa o campo de busca
    let inputBusca = document.getElementById('busca-input');
    if (inputBusca) {
        inputBusca.value = "";
    }
    
    termoBuscaAtual = "";
    
    // Atualiza botão limpar
    if (clearSearchBtn) {
        clearSearchBtn.style.display = "none";
    }
    
    // Mostra a tela de boas-vindas
    if (welcomeScreen) {
        welcomeScreen.style.display = "block";
    }
    
    // Esconde os cards, loading, resultados e mensagem de erro
    if (cardContainer) {
        cardContainer.style.display = "none";
        cardContainer.innerHTML = "";
    }
    
    if (emptyState) {
        emptyState.style.display = "none";
    }
    
    if (loadingState) {
        loadingState.style.display = "none";
    }
    
    if (resultsHeader) {
        resultsHeader.style.display = "none";
    }
}

// Função para destacar texto (melhoria simples)
function destacarTexto(texto, termo) {
    if (!termo || termo.trim() === "") {
        return texto;
    }
    
    const regex = new RegExp(`(${termo})`, 'gi');
    return texto.replace(regex, '<mark>$1</mark>');
}

// Quando a página carrega, configura os eventos
document.addEventListener('DOMContentLoaded', function() {
    // Busca quando aperta Enter
    let inputBusca = document.getElementById('busca-input');
    if (inputBusca) {
        inputBusca.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                IniciarBusca();
            }
        });
        
        // Mostra/esconde botão limpar quando digita
        inputBusca.addEventListener('input', function() {
            if (clearSearchBtn) {
                clearSearchBtn.style.display = inputBusca.value.length > 0 ? "block" : "none";
            }
        });
    }
    
    // Busca quando clica no botão
    let botaoBusca = document.getElementById('botao-busca');
    if (botaoBusca) {
        botaoBusca.addEventListener('click', IniciarBusca);
    }
});

// Função principal de busca (similar ao exemplo da aula)
async function IniciarBusca() {
    let inputBusca = document.getElementById('busca-input');
    termoBuscaAtual = inputBusca ? inputBusca.value.toLowerCase().trim() : "";

    // Se não tem termo de busca, mostra a tela inicial
    if (!termoBuscaAtual) {
        VoltarInicio();
        return;
    }

    // Mostra loading
    if (loadingState) {
        loadingState.style.display = "flex";
    }
    
    // Esconde outros elementos
    if (welcomeScreen) {
        welcomeScreen.style.display = "none";
    }
    if (cardContainer) {
        cardContainer.style.display = "none";
        cardContainer.innerHTML = "";
    }
    if (emptyState) {
        emptyState.style.display = "none";
    }
    if (resultsHeader) {
        resultsHeader.style.display = "none";
    }

    // Carrega os dados do JSON se ainda não carregou (igual ao exemplo)
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            dados = await resposta.json();
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            if (loadingState) {
                loadingState.style.display = "none";
            }
            return;
        }
    }
    
    // Pequeno delay para mostrar loading
    await new Promise(resolve => setTimeout(resolve, 200));

    // Filtra os dados (igual ao exemplo da aula, mas com mais campos)
    const dadosFiltrados = dados.filter(function(item) {
        // Busca no nome (igual ao exemplo)
        if (item.nome && item.nome.toLowerCase().includes(termoBuscaAtual)) {
            return true;
        }
        
        // Busca na descrição (igual ao exemplo)
        if (item.descricao && item.descricao.toLowerCase().includes(termoBuscaAtual)) {
            return true;
        }
        
        // Busca na categoria (extensão simples)
        if (item.categoria && item.categoria.toLowerCase().includes(termoBuscaAtual)) {
            return true;
        }
        
        // Busca nas palavras-chave (tags) - extensão simples
        if (item.tags && Array.isArray(item.tags)) {
            for (let i = 0; i < item.tags.length; i++) {
                if (item.tags[i].toLowerCase().includes(termoBuscaAtual)) {
                    return true;
                }
            }
        }
        
        return false;
    });

    // Esconde loading
    if (loadingState) {
        loadingState.style.display = "none";
    }
    
    // Mostra os cards (igual ao exemplo)
    renderizarCards(dadosFiltrados);
    
    // Mostra mensagem se não encontrou nada
    if (dadosFiltrados.length === 0) {
        if (emptyState) {
            emptyState.style.display = "block";
        }
        if (cardContainer) {
            cardContainer.style.display = "none";
        }
        if (resultsHeader) {
            resultsHeader.style.display = "none";
        }
    } else {
        if (emptyState) {
            emptyState.style.display = "none";
        }
        if (cardContainer) {
            cardContainer.style.display = "grid";
        }
        
        // Mostra contador de resultados (melhoria simples)
        if (resultsHeader && resultsCount) {
            let texto = dadosFiltrados.length === 1 
                ? "1 tecnologia encontrada" 
                : dadosFiltrados.length + " tecnologias encontradas";
            resultsCount.textContent = texto;
            resultsHeader.style.display = "block";
        }
    }
}

// Cria os cards na tela (similar ao exemplo da aula)
function renderizarCards(dadosFiltrados) {
    if (!cardContainer) return;

    cardContainer.innerHTML = "";

    for (let i = 0; i < dadosFiltrados.length; i++) {
        let item = dadosFiltrados[i];
        let card = document.createElement("article");
        card.style.animationDelay = `${i * 0.05}s`;
        
        // Monta o conteúdo do card (similar ao exemplo)
        let html = "";
        
        // Categoria (se tiver)
        if (item.categoria) {
            html += '<div class="categoria">' + item.categoria + '</div>';
        }
        
        // Título com destaque (melhoria simples)
        let nomeDestacado = destacarTexto(item.nome || 'Sem nome', termoBuscaAtual);
        html += '<h2>' + nomeDestacado + '</h2>';
        
        // Informações
        html += '<div class="info">';
        if (item.data_criacao) {
            html += '<span>📅 ' + item.data_criacao + '</span>';
        }
        if (item.impacto) {
            html += '<span>⚡ ' + item.impacto + '</span>';
        }
        html += '</div>';
        
        // Descrição com destaque (melhoria simples)
        if (item.descricao) {
            let descDestacada = destacarTexto(item.descricao, termoBuscaAtual);
            html += '<p>' + descDestacada + '</p>';
        }
        
        // Link (igual ao exemplo)
        if (item.link) {
            html += '<a href="' + item.link + '" target="_blank">Saiba mais →</a>';
        }
        
        card.innerHTML = html;
        cardContainer.appendChild(card);
    }
}
