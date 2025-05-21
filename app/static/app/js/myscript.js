$('#slider1, #slider2, #slider3').owlCarousel({
    loop: true,
    margin: 20,
    responsiveClass: true,
    responsive: {
        0: {
            items: 2,
            nav: false,
            autoplay: true,
        },
        600: {
            items: 4,
            nav: true,
            autoplay: true,
        },
        1000: {
            items: 6,
            nav: true,
            loop: true,
            autoplay: true,
        }
    }
});

$('.plus-cart').click(function(){
    var id = $(this).attr("pid").toString();
    var eml = this.parentNode.children[2];
    $.ajax({
        type: "GET",
        url: "/pluscart",
        data: { prod_id: id },
        success: function(data){
            eml.innerText = data.quantity;
            document.getElementById("amount").innerText = data.amount;
            document.getElementById("totalamount").innerText = data.totalamount;
        }
    });
});

$('.minus-cart').click(function(){
    var id = $(this).attr("pid").toString();
    var eml = this.parentNode.children[2];
    $.ajax({
        type: "GET",
        url: "/minuscart",
        data: { prod_id: id },
        success: function(data){
            eml.innerText = data.quantity;
            document.getElementById("amount").innerText = data.amount;
            document.getElementById("totalamount").innerText = data.totalamount;
        }
    });
});

$('.remove-cart').click(function(){
    var id = $(this).attr("pid").toString();
    var eml = this;
    $.ajax({
        type: "GET",
        url: "/removecart",
        data: { prod_id: id },
        success: function(data){
            document.getElementById("amount").innerText = data.amount;
            document.getElementById("totalamount").innerText = data.totalamount;
            eml.parentNode.parentNode.parentNode.parentNode.remove();
        }
    });
});

$('.plus-wishlist').click(function(){
    var id = $(this).attr("pid").toString();
    $.ajax({
        type: "GET",
        url: "/pluswishlist",
        data: { prod_id: id },
        success: function(data){
            window.location.href = `/product-detail/${id}`;
        }
    });
});

$('.minus-wishlist').click(function(){
    var id = $(this).attr("pid").toString();
    $.ajax({
        type: "GET",
        url: "/minuswishlist",
        data: { prod_id: id },
        success: function(data){
            window.location.href = `/product-detail/${id}`;
        }
    });
});


// ====================== ĐẶT HÀNG ======================

let form = document.getElementById('form');

if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Ngăn reload trang

        let total = parseFloat(document.getElementById('totalamount').innerText);

        let userFormData = {
            'name': form.name.value,
            'email': form.email.value,
            'total': total
        };

        let shippingInfo = {
            'address': form.address.value,
            'city': form.city.value,
            'state': form.state.value,
            'zipcode': form.zipcode.value,
            'country': form.country.value,
        };

        console.log("Sending order to backend...", userFormData, shippingInfo);

        fetch('/process_order/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ 'form': userFormData, 'shipping': shippingInfo }),
        })
        .then(response => response.json())
        .then(data => {
            alert("Đặt hàng thành công!");
            window.location.href = "/"; // Chuyển hướng về trang chủ
        })
        .catch(error => {
            alert("Có lỗi xảy ra khi gửi đơn hàng!");
            console.error(error);
        });
    });
}

// CSRF helper
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
