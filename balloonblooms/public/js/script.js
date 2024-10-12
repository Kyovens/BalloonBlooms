// navbar-burger js
document.addEventListener('DOMContentLoaded', function () {
    // Get all "navbar-burger" elements
    var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    // Check if there are any nav burgers
    if ($navbarBurgers.length > 0) {
        // Add a click event on each of them
        $navbarBurgers.forEach(function ($el) {
            $el.addEventListener('click', function () {
                // Get the target from the "data-target" attribute
                var target = $el.dataset.target;
                var $target = document.getElementById(target);
                // Toggle the class on both the "navbar-burger" and the "navbar-menu"
                $el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }
});

// logout loading
let loadLogout = () => {
    document.getElementById('btnlogout').style.display = "none"
    document.getElementById('userEmail').style.display = "none"
    document.getElementById('btnload').style.display = "block"
    alert("Logged out successfully. You will be redirected to Home page.")
}

// integer to currency : class price
let prices = document.getElementsByClassName('prices')
for (let i = 0; i < prices.length; i++) {
    prices[i].innerHTML = Number(prices[i].innerHTML).toLocaleString('id-id', {
        style    : 'currency',
        currency : 'IDR'
    })
}

console.log(document.getElementById('price'));

// integer to currency : id price
let price = document.getElementById('price').innerHTML
document.getElementById('price').innerHTML = Number(price).toLocaleString('id-id', {
    style    : 'currency',
    currency : 'IDR'
})