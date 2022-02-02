//API BINANCE - CONECTOR API BINANCE 
const cards = document.getElementById('cards');
const templateCard = document.getElementById('template-card').content;
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();

let carrito = {

}




document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e => {
    addCarrito(e)
})





const fetchData = async() => {
    'https://min-api.cryptocompare.com/data/top/totalvolfull?limit=15&tsym=USD'
    try {
        const respuesta = await fetch('https://min-api.cryptocompare.com/data/top/totalvolfull?limit=15&tsym=USD')
        const data = await respuesta.json();

        // console.log(data)
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}


const pintarCards = data => {
    console.log(data)

    data.Data.forEach(producto => {

        producto.innerHTML = ''
            //console.log(producto)
        templateCard.querySelector('h5').textContent = producto.CoinInfo.FullName
        templateCard.querySelector('p').textContent = producto.DISPLAY.USD.PRICE
        templateCard.querySelector('#img').innerHTML = `<img src="https://www.cryptocompare.com${producto.CoinInfo.ImageUrl}" alt="" class="card-img-top">`
            //templateCard.querySelector('img').setAttribute = ("src", + producto.CoinInfo.ImageUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.CoinInfo.Id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone);

    })

    cards.appendChild(fragment)
}

const addCarrito = e => {
    // console.log(e.target)
    // console.log(e.target.classList.contains('btn-dark'))
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    //console.log(objeto)
    const producto = {
        Id: objeto.querySelector('.btn-dark').dataset.id,
        FullName: objeto.querySelector('h5').textContent,
        PRICE: objeto.querySelector('p').textContent,
        cantidad: ''
    }



    carrito[producto.FullName] = {...producto }
    pintarCarrito();
    // console.log(producto.PRICE)
    //


}



const pintarCarrito = () => {

    items.innerHTML = ''


    Object.values(carrito).forEach(producto => {


        templateCarrito.querySelector('th').textContent = producto.Id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.FullName
        templateCarrito.querySelector('span').textContent = producto.PRICE






        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)


    })


    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
         <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>   `

        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)

    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, PRICE }) => PRICE, 0)
        //console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })


}