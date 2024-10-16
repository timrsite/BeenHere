ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 12,
        controls: []
    });

    myMap.behaviors.disable('scrollZoom');

    var friends = [
        {lat: 55.75, lon: 37.62, video: 'https://cdn.glitch.global/ec56f749-8c39-4a62-afde-15e1155b2893/5121351_School_Classroom_1280x720.mp4?v=1729022340195'},
        {lat: 55.77, lon: 37.66, video: 'video2.mp4'},
        {lat: 55.74, lon: 37.60, video: 'video3.mp4'},
        {lat: 55.78, lon: 37.68, video: 'video4.mp4'}
    ];

    friends.forEach(friend => {
        var placemark = new ymaps.Placemark([friend.lat, friend.lon], {
            hintContent: 'Видео друга',
            video: friend.video
        }, {
            iconLayout: ymaps.templateLayoutFactory.createClass(
                '<div class="avatar-container">' +
                '<canvas class="video-preview"></canvas>' +
                '<video src="{{ properties.video }}" muted loop style="display:none;"></video>' +
                '<div class="play-pause-btn">▶</div>' +
                '</div>'
            ),
            iconShape: {
                type: 'Circle',
                coordinates: [30, 30],
                radius: 30
            }
        });

        placemark.events.add('add', function (e) {
            var container = e.get('target').getOverlaySync().getLayoutSync().getElement();
            var videoElement = container.querySelector('video');
            var canvasElement = container.querySelector('canvas');

            videoElement.addEventListener('loadeddata', function() {
                canvasElement.width = videoElement.videoWidth;
                canvasElement.height = videoElement.videoHeight;
                canvasElement.getContext('2d').drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
            });
        });

        placemark.events.add('click', function (e) {
            var container = e.get('target').getOverlaySync().getLayoutSync().getElement();
            var videoElement = container.querySelector('video');
            var canvasElement = container.querySelector('.video-preview');
            var playPauseBtn = container.querySelector('.play-pause-btn');
            
            if (videoElement.paused) {
                videoElement.play();
                playPauseBtn.textContent = '❚❚';
                canvasElement.style.display = 'none';
                videoElement.style.display = 'block';
            } else {
                videoElement.pause();
                playPauseBtn.textContent = '▶';
            }
        });

        myMap.geoObjects.add(placemark);
    });

    setupOverlaySwipe();
    setupShowOverlayButton();
}

function setupOverlaySwipe() {
    const overlay = document.querySelector('.overlay');
    const showOverlayBtn = document.querySelector('.show-overlay-btn');
    let startY;
    let startTranslateY;
    let currentTranslateY = 0;

    overlay.addEventListener('touchstart', touchStart);
    overlay.addEventListener('touchmove', touchMove);
    overlay.addEventListener('touchend', touchEnd);

    function touchStart(event) {
        startY = event.touches[0].clientY;
        startTranslateY = currentTranslateY;
        overlay.style.transition = 'none';
    }

    function touchMove(event) {
        const currentY = event.touches[0].clientY;
        const diffY = currentY - startY;
        currentTranslateY = startTranslateY + diffY;
        
        if (currentTranslateY > 0) currentTranslateY = 0;
        
        overlay.style.transform = `translateY(${currentTranslateY}px)`;
    }

    function touchEnd() {
        overlay.style.transition = 'transform 0.3s ease';
        if (currentTranslateY < -50) {
            overlay.classList.add('hidden');
            currentTranslateY = -overlay.offsetHeight;
            showOverlayBtn.classList.add('visible');
        } else {
            overlay.classList.remove('hidden');
            currentTranslateY = 0;
            showOverlayBtn.classList.remove('visible');
        }
        overlay.style.transform = `translateY(${currentTranslateY}px)`;
    }
}

function setupShowOverlayButton() {
    const overlay = document.querySelector('.overlay');
    const showOverlayBtn = document.querySelector('.show-overlay-btn');

    showOverlayBtn.addEventListener('click', () => {
        overlay.classList.remove('hidden');
        overlay.style.transform = 'translateY(0)';
        showOverlayBtn.classList.remove('visible');
    });
}

function showExpandedVideo(videoSrc) {
    var expandedVideo = document.getElementById('expanded-video');
    var videoElement = expandedVideo.querySelector('video');
    videoElement.src = videoSrc;
    expandedVideo.classList.add('active');

    expandedVideo.onclick = function(event) {
        if (event.target === expandedVideo) {
            expandedVideo.classList.remove('active');
            videoElement.pause();
        }
    };

    var reactionButtons = expandedVideo.querySelectorAll('.reaction-btn');
    reactionButtons.forEach(function(button) {
        button.onclick = function(event) {
            event.stopPropagation();
            console.log('Реакция:', button.textContent);
        };
    });
}
