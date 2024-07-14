const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = []; //Iniciar o carrinho vazio, sem itens

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal; //Atualiza os itens do carrinho
    cartModal.style.display = "flex"
});

//Fechar o modal  do carrinho quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
});

//Fechar o modal do carrinho ao clicar no botão fechar
closeModalBtn.addEventListener("click", function(){
   cartModal.style.display = "none";
});

//Selecionando o botão adicionar:
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener("click", function(event){    
        let parentButton = event.currentTarget;

        if(parentButton){
            const name = parentButton.getAttribute("data-name");
            const price = parseFloat(parentButton.getAttribute("data-price"));

            //Adicionando ao carrinho
            addToCart(name, price);
        }
    });
});

//Adicionando itens ao carrinho:
function addToCart(name, price){    
    const existingItem = cart.find(item => item.name === name); //Verifica se existe itens iguais selecionados    

    if (existingItem){
        //Se o item já existe, aumenta apenas a quantidade +1
        existingItem.quantity += 1;
        console.log(cart);
    }else{ //Se não apenas adiciona o item
        cart.push({
            name,
            price,
            quantity: 1,
        });
    } 
    updateCartModal(); //Atualiza o carrinho
}

//Atualiza Carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = ""; //Iniciar com carrinho vazio
    let total = 0; //Iniciar total zerado

    cart.forEach(item => {
        const cartItemElement = document.createElement("div"); //Criando um elemento div no HTML
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col"); //Estilizando div

        //Criando estrutura de um item ao elemento HTML do carrinho
        cartItemElement.innerHTML = ` 
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>                    
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `
        total += item.price * item.quantity; //Multiplicar a quantidade de cada item pelo seu valor
        cartItemsContainer.appendChild(cartItemElement); //Adicionando elemento item ao modal carrinho
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", { //Transformando numero para string. Moeda em Real
        style: "currency", //Currency = Moeda
        currency: "BRL"    //Real R$
    });

    cartCounter.innerHTML = cart.length; //Exibir a quantidade de itens no carrinho
}

//Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    //EventoDeClique.Selecionado.DoTipoClasse.Contem(BotaoRemover)
    if(event.target.classList.contains("remove-from-cart-btn")){ //Verifica se dentro do carrinho contem o botão remover
        const name = event.target.getAttribute("data-name"); //Pega o atributo nome que foi selecionado

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name); //findIndex = Procurar o indice de uma variavel em uma lista
    //Se for diferente de item não encontrado
    if(index !== -1){ //-1 significa que não foi encontrado o item
        const item = cart[index]; //Trazer apenas o indice do item
        if (item.quantity > 1){ //Se o item possui quantidade maior do que 1
            item.quantity -= 1; //Retira apenas uma quantidade
            updateCartModal(); //Atualiza o carrinho
            return; //Parar execução aqui
        }
        //Se não a quantidade for apenas 1:
        cart.splice(index, 1); //Remove o item da lista splice(posição_do_item, quantidade_para_remover)
        updateCartModal(); //Atualiza o carrinho
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500"); //Remove a borda vermelha do campo de endereço
        addressWarn.classList.add("hidden"); //Esconde o campo com a descrição de alerta
    }
});

//Finalizar pedido
checkoutBtn.addEventListener("click", function(){ //Ao clicar no botão "Finalizar pedido"

    //Exibe se o restaurante está fechado ou aberto
    /*const isOpen = checkRestaurantOpen();
    if (!isOpen){ //Se não tiver fechado
        alert("Restaurante fechado no momento!");
        return;
    }*/

    const isOpen = checkRestaurantOpen();
    if (!isOpen){
        Toastify({
            text: "Ops! O restaurante está fechado.",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "#ef4444",
            },
        }).showToast();
       return;
    }        

    if(cart.length === 0) return; //Se clicar em finalizar pedido sem ter item no carrinho, não faz nada
    if(addressInput.value === ""){ //Se o campo de endereço for vazio
        addressWarn.classList.remove("hidden"); //Mostrar campo de alerta
        addressInput.classList.add("border-red-500"); //Exibir borda vermelha no campo
        return;
    }

    const cartItems = cart.map((item) => {
        return (
            `${item.name} - Quantidade: (${item.quantity}) - Preço R$: (${item.price}) |`
        )
    }).join("");

    const message = encodeURIComponent(cartItems); //Transformando a mensagem em URL
    const phone = "96988949764"; //Telefone da lanchonete (aleatorio)
    //Enviando o pedido para API do whatsapp gratuita com o pedido e endereço do cliente:
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

    cart=[]; //Limpando o carrinho
    updateCartModal(); //Atualizando o carrinho

});

//Verificar a hora e manipular o card horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    //Restaurante está aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-500");
}else{
    spanItem.classList.remove("bg-green-500");
    spanItem.classList.add("bg-red-500");
}