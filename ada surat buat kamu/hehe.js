$(".container").css("background-color", "#053002");

function playPopSound() {
    const audio = new Audio("pop.mp3");
    audio.volume = 0.3;
    audio.play();
}

function popImages() {
    playPopSound();
}

$("#messageState").on("change", () => {
    $(".message").removeClass("openNor").removeClass("closeNor");
    if ($("#messageState").is(":checked")) {
        $(".message").removeClass("closed").removeClass("no-anim").addClass("openNor");
        $(".heart").removeClass("closeHer").removeClass("openedHer").addClass("openHer");

        $(".container").stop().animate({ "backgroundColor": "#800080" }, 2000);

        const bgAudio = document.getElementById("backgroundAudio");
        bgAudio.muted = false;
        bgAudio.play().catch(e => console.log("Autoplay failed:", e));

        popImages();
    } else {
        $(".message").removeClass("no-anim").addClass("closeNor");
        $(".heart").removeClass("openHer").removeClass("openedHer").addClass("closeHer");

        $(".container").stop().animate({ "backgroundColor": "#053002" }, 2000);
    }
});

$(".message").on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
	$(".message").removeClass("closeNor").addClass("no-anim");
});


$(".heart").on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
    if (!$(".heart").hasClass("closeHer")) {
        $(".heart").addClass("openedHer").addClass("beating");
    } else {
        $(".heart").addClass("no-anim").removeClass("beating");
    }
});

$(".heart").on("click", () => {
    $(".message").removeClass("no-anim closed").addClass("openNor");
});