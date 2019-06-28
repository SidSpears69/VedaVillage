$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $("input[type='tel']").mask("+ 7 (999) 999-99-99");
    $(document).ready(function () {
        magnific($('.btn-feedback'));
        magnific($('.btn-investment'));
    })

    function magnific(element) {
        element.magnificPopup({
            type: 'inline',
            modal: true,
            fixedContentPos: true,
            fixedBgPos: false,

            overflowY: 'auto',

            closeBtnInside: true,
            preloader: false,

            midClick: true,
            removalDelay: 300,
            mainClass: 'mfp-fade'
        });
    }
    $(".investment-item").click(function () {
        var header = $(this).find(".investment-item-header");
        var color = header.css("background-color");
        $(".investment-item-header-popup").css("background-color", color)
    })
    $(document).on('click', '.popup-close', function () {
        $.magnificPopup.close();
    });
    $(document).on('click', '#close', function () {
        $.magnificPopup.close();
    });
    var mySwiper = new Swiper(".swiper-container", {
        mode: 'horizontal',
        slidesPerView: 1,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        loop: true
    });
    $(document).on('click', '.popup-close', function () {
        $.magnificPopup.close();
    });
    ymaps.ready(init);

    function init() {
        // Создание карты.    
        var myMap = new ymaps.Map("yandex-map", {
            center: [59.9403, 30.5075],
            zoom: 16,
            controls: []
        });
        myMap.controls.remove('searchControl');
        myMap.behaviors.disable('scrollZoom');

        myMap.controls.add('zoomControl', {
            position: {
                top: 100,
                right: 15
            }
        });
        myMap.controls.add('geolocationControl', {
            position: {
                top: 50,
                right: 15
            }
        });
        var myPlacemark = new ymaps.Placemark([59.9406, 30.5129], {}, {
            iconLayout: 'default#image',
            iconImageHref: 'img/location-icon.png',
            iconImageSize: [48, 60],
            iconImageOffset: [-23, -70]
        });

        myMap.geoObjects.add(myPlacemark);
    };

    $("#feedback-form").submit(sendForm);
    $("#faq-form").submit(sendForm);
    $("#investment-form").submit(sendForm);

    $("#form-footer").submit(sendForm);

    function sendForm() {
        var form = $(this);
        var error = false;
        form.find('input:not([type=hidden])').each(function () {
            if ($(this).val() == '') {
                $(this).css("border-color", "red");
                error = true;
            }
        });
        if (form.children("#input-header").length > 0) {
            var popup = form.closest('.popup-investment');
            var headerText = popup.find("#form-header").text();
            form.find("#input-header").val(headerText);
            var selfText = popup.find("#price").text();
            form.find("#input-price").val(selfText);
            var selfText = form.find("#loan-money").text();
            form.find("#input-loan").val(selfText);
            var selfText = form.find("#self-money").text();
            form.find("#input-self").val(selfText);
        };
        if (!error) {
            var data = form.serialize();
            console.log(data);
            $.ajax({
                type: 'POST',
                url: 'send.php',
                dataType: 'json',
                data: data,
                beforeSend: function (data) {
                    form.find('input[type="submit"]').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data['error']) {
                        console.log(data['error']);
                    } else {
                        $.magnificPopup.open({
                            items: {
                                src: '#success'
                            }
                        });
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                },
                complete: function (data) {
                    form.find('input[type="submit"]').prop('disabled', false);
                }

            });
        }
        return false;
    }
})