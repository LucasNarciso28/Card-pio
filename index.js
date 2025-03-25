document.addEventListener('DOMContentLoaded', function() {
    // Array com os itens do cardápio (incluindo as repetições iniciais)
    const itensCardapioComRepeticoes = [
        {
            nome: "Água gelada",
            imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTCcrQiAJUipgE7yo5z9mmJre0EcLv-cYaWw&s",
            descricao: "Água fresquinha e captada na hora dentro de uma de nossas minas de água.",
            preco: "R$9.99",
            info: "LIVRE DE LACTOSE."
        },
        {
            nome: "Hambúrguer Clássico",
            imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyG4HkWXNbsy5FPJyDd8yuoQgpE-Msusu3wQ&s",
            descricao: "Pão brioche, carne artesanal 180g, queijo cheddar, alface, tomate e maionese da casa.",
            preco: "R$25.50"
        },
        {
            nome: "Água gelada",
            imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTCcrQiAJUipgE7yo5z9mmJre0EcLv-cYaWw&s",
            descricao: "Água fresquinha e captada na hora dentro de uma de nossas minas de água.",
            preco: "R$9.99",
            info: "LIVRE DE LACTOSE."
        },
        {
            nome: "Batata Frita",
            imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOJYRilamYNqM8OKYjvvtUK4uNC1g2fGfXyw&s",
            descricao: "Porção generosa de batatas fritas crocantes.",
            preco: "R$15.00"
        },
        {
            nome: "Hambúrguer Clássico",
            imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyG4HkWXNbsy5FPJyDd8yuoQgpE-Msusu3wQ&s",
            descricao: "Pão brioche, carne artesanal 180g, queijo cheddar, alface, tomate e maionese da casa.",
            preco: "R$25.50"
        }
        // Adicione mais itens aqui...
    ];

    // Função para remover itens duplicados (baseado no nome)
    function removerDuplicados(array) {
        const unicos = {};
        return array.filter(item => {
            return unicos.hasOwnProperty(item.nome) ? false : (unicos[item.nome] = true);
        });
    }

    // Obtém a lista de itens únicos
    const itensUnicos = removerDuplicados(itensCardapioComRepeticoes);

    // Obtém o container onde os itens serão injetados
    const cardapioContainer = document.getElementById('cardapio-container');

    // Função para criar o HTML de um item do cardápio
    function criarItemHTML(item) {
        let infoHTML = item.info ? `<h3><em>${item.info}</em></h3>` : '';
        return `
            <article class="prato">
                <img src="${item.imagem}" alt="${item.nome}" width="150">
                <h2>${item.nome}</h2>
                ${infoHTML}
                <p>${item.descricao}</p>
                <p class="preco">${item.preco}</p>
            </article>
        `;
    }

    // Itera sobre os itens únicos e injeta o HTML no container
    let cardapioHTML = '';
    itensUnicos.forEach(item => {
        cardapioHTML += criarItemHTML(item);
    });

    cardapioContainer.innerHTML = cardapioHTML;
});