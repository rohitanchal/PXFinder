const accessKey = "9UBOsNSJxz3WNs-mCeLlYlgeA_3qPHC2yU58iufoA18";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");
const loaderContainer = document.getElementById("loader-container");

let keyword = "";
let page = 1;

// Function to download an image directly
function downloadImage(url) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "image.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => console.error("Download error:", error));
}

async function searchImages() {
    keyword = searchBox.value.trim();
    if (!keyword) return;

    // Show loader
    loaderContainer.style.display = "flex";

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (page === 1) {
            searchResult.innerHTML = "";
        }

        data.results.forEach((result) => {
            const imageBox = document.createElement("div");
            imageBox.classList.add("col-lg-4", "col-md-6", "col-12");

            imageBox.innerHTML = `
                <div class="image-box">
                    <img src="${result.urls.regular}" class="img-fluid" alt="Image">
                    <button class="download-btn" onclick="downloadImage('${result.urls.full}')">
                        <i class="bi bi-cloud-arrow-down"></i>
                    </button>
                </div>
            `;

            searchResult.appendChild(imageBox);
        });

        showMoreBtn.classList.remove("d-none");

    } catch (error) {
        console.error("Error fetching images:", error);
    } finally {
        setTimeout(() => {
            loaderContainer.style.display = "none";
        }, 500);
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    page = 1;
    searchImages();
});

showMoreBtn.addEventListener("click", () => {
    page++;
    searchImages();
});
