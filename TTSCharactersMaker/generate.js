document.addEventListener("DOMContentLoaded", function () {
    const assets = {
        base: './assets',
        foundation: './assets/foundation',
        emotion: './assets/emotion',
        eyebrow: './assets/eyebrow',
        hairstyle: './assets/hairstyle',
        pupil: './assets/pupil',
    };

    const nameFH = document.getElementById('nameFH').value;
    const foundation = document.getElementById('foundation').value;
    const pupil1 = document.getElementById('pupil1').value;
    const pupil2 = document.getElementById('pupil2').value;
    const eyebrow = document.getElementById('eyebrows').value;
    const emotion = document.getElementById('emotion').value;
    const hairstyle = document.getElementById('hairstyle').value;

    const canvas = document.getElementById('result');
    const ctx = canvas.getContext('2d');

    function processFormAndGenerateCanvas() {
        canvas.width = 600;
        canvas.height = 600;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        function drawImage(type, number, x, y) {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = `${assets[type]}/${number}.png`;
                img.onload = function () {
                    const originalWidth = img.width;
                    const originalHeight = img.height;
                    ctx.drawImage(img, x, y, originalWidth, originalHeight);
                    resolve();
                };
            });
        }

        async function drawAllImages() {
            if (foundation !== "0") await drawImage("foundation", foundation, 0, 0);
            if (pupil1 !== "0") await drawImage("pupil", pupil1, 214, 120);
            if (pupil2 !== "0") await drawImage("pupil", pupil2, 313, 120);
            if (eyebrow !== "0") await drawImage("eyebrow", eyebrow, 196, 85);
            if (hairstyle !== "0") {
                let x = 156;
                let y = 40;
                switch (hairstyle) {
                    case "2":
                        x = 147;
                        y = 29;
                        break;
                }
                await drawImage("hairstyle", hairstyle, x, y);
            }
            if (emotion !== "0") await drawImage("emotion", emotion, 241, 211);
        }

        drawAllImages().then(() => {
            createDownloadLink(nameFH);
        });
    }

    function createDownloadLink(nameFH) {
        const canvas = document.getElementById('result');
        canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            let downloadLink = document.getElementById('downloadLink');

            if (!downloadLink) {
                const downloadbtn = document.createElement('button');
                downloadbtn.classList.add('btn', 'btn-inline');

                const link = document.createElement('a');
                link.id = 'downloadLink';
                link.textContent = 'Скачать';
                link.style.textDecoration = "none";
                downloadbtn.appendChild(link);

                document.getElementById('generateForm').appendChild(downloadbtn);

                downloadLink = link;
            }

            downloadLink.href = url;
            downloadLink.download = `${nameFH ? nameFH : "Герой"}.png`;

            downloadLink.addEventListener('click', function () {
                setTimeout(() => URL.revokeObjectURL(url), 100);
            });
        });
    }

    document.getElementById('generateForm').addEventListener('submit', function (event) {
        event.preventDefault();
        processFormAndGenerateCanvas();
    });
});
