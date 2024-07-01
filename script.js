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

let cart = [];

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal; //Atualiza os itens do carrinho
    cartModal.style.display = "flex"
});

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
});

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
    updateCartModal();
}

//AtualizaCarrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div"); //Criando um elemento div no HTML
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        //Criando estrutura de um item ao elemento HTML do carrinho
        cartItemElement.innerHTML = ` 
            <div>
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p calss="font-medium mt-2">R$ ${item.price}</p>                    
                </div>
                <div>
                    <button>
                        Remover
                    </button>
                </div>

            </div>
        `
        cartItemsContainer.appendChild(cartItemElement); //Adicionando elemento item ao modal carrinho
    })
}