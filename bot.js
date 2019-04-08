var el = document.querySelectorAll('.captcha-image');

// Функция переключения видимости слоёв
function toggleView() {
	$(".container").show();
	$(".message-error").hide();
	$(".loading").hide();
}

// Функция прокликивания элементов
function clickEl(el, arr) {
	for (let i = 0; i < arr.length; i++) {
		el[arr[i]].click();
	}
}

// Функция создание массива всех комбинаций чисел из диапазона
function getPermutation(min, max) {
	let result = [];
	result.push([min]);
	result.push([min + 1]);
	result.push([min, min + 1]);

	for (let i = min + 2; i <= max; i++) {
		oldLength = result.length;
		result.push([i]);
		for (let j = 0; j < oldLength; j++) {
			result.push(result[j].concat(i));
		}
	}

	return result;
}

// 
// Выполняем клики
//

// Подмена выполения дейстия
$(".button").off('click');
$(".button").click(function () {
	if (0 == $(".captcha-image.active").length)
		return !1;
	currentCat = $('input[name="category"]').val(),
		capthcaData = [],
		$(".captcha-image").each(function (t) {
			item = Object(),
				item.id = $(this).data("id"),
				item.token = $(this).data("token"),
				item.active = $(this).hasClass("active"),
				capthcaData.push(item)
		}),
		$.ajax({
			url: "ajax/sendCaptcha.php",
			method: "POST",
			dataType: "json",
			data: {
				capthcaData: capthcaData,
				category: currentCat
			}
		}).done(function (t) {
			$(".loading").hide(function () {
				"success" == t.status ? (console.log(t),
					$(".message-success").show(),
					clearInterval(interval),
					alert("А Я молодец, я смог подобрать! Дальше я не в курсе что будет)"),
					"" == t.content ? $(".success-first").show() : $(".success-following").show(),
					$("ul").append(t.content)) : $(".message-error").show()
			})
		})
});

var allPermutation = getPermutation(0, 8);
var i = 0;

clickEl(el, allPermutation[i]);
$(".button").click();
var interval = setInterval(function () {
	toggleView();
	clickEl(el, allPermutation[i]);
	i++;
	clickEl(el, allPermutation[i]);
	$(".button").click();
}, 100);
