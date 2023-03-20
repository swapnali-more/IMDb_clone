const searchInput = document.getElementById("search-movie");
const moviesList = document.getElementById("movies-list");
const loader = document.querySelector(".loader-overlay");
const movieDetail = document.getElementById('movie-detail')
const moviesWishList = document.getElementById("wish-list");

// Function to search for movies
const searchMovie = async (dummy = '2016') => {
    try {
        // Get search term from URL parameter or use default
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get("searchTerm") || dummy;

        // Fetch movie data from API
        const response = await fetch(`https://www.omdbapi.com/?apikey=bab3490d&s=${searchTerm}`);
        const data = await response.json();

        localStorage.setItem('SearchData', JSON.stringify(data.Search))

        // Hide loader
        loader.style.display = 'none';

        const wishlistedData = JSON.parse(localStorage.getItem("favourite"))

        // Map movie data to HTML
        const movieArr = data.Search ? data.Search.map(movie => {
            const buttonInner = wishlistedData && wishlistedData.some(v => v.imdbID === movie.imdbID) ? 
                `<i class="fa-solid fa-heart" style="color: #a10312"></i>` :
                `<i class="fa-regular fa-heart"></i>`;
            return `
              <div class="col-md-3 mb-3" id="${movie.imdbID}">
                <div class="movies-card">
                  <img src="${movie.Poster}" class="movie-img" alt="${movie.Title}" />
                  <div class="movie-content">
                    <p class="mb-2">Type: ${movie.Type}</p>
                    <h6 class="mb-2"><a href="details.html?id=${movie.imdbID}">${movie.Title}</a></h6>
                    <button class="btn wishlist" onclick="toggleWishlist('${movie.imdbID}')">${buttonInner}</button>
                  </div>
                </div>
              </div>
            `;
          }) : [];             
          
        // Update HTML with movie data
        moviesList.innerHTML = movieArr.join('');

    } catch (err) {
        console.log(err);
        loader.style.display = 'none';
    }
};

// Call searchMovies with default search term on page load
searchMovie();

// Add event listener to search input
searchInput.addEventListener('change', (e) => {
    const searchTerm = e.target.value;
    window.location.href = `index.html?searchTerm=${searchTerm}`;
    searchMovie(searchTerm);
});

// Function to add movie ID to wishlist
const toggleWishlist = (id) => {
    let SearchData = JSON.parse(localStorage.getItem("SearchData")) || [];
    let wishlistArr = JSON.parse(localStorage.getItem("favourite")) || [];
    SearchData.map(v => {
        if(v.imdbID === id) {
            const index = wishlistArr.findIndex(item => item.imdbID === v.imdbID)
            const button = document.querySelector(`[id="${v.imdbID}"] button`);

            if (index > -1) {
                wishlistArr = wishlistArr.filter(item => item.imdbID !== v.imdbID)
                button.innerHTML = '<i class="fa-regular fa-heart"></i>';
            } else {
                wishlistArr.push(v);
                button.innerHTML = '<i class="fa-solid fa-heart" style="color: #a10312"></i>';
            }
        }
    })
    
    localStorage.setItem("favourite", JSON.stringify(wishlistArr));
}

// Function to remove movie ID to wishlist
const removeWishlist = (id) => {
    console.log(id)
    const wishlistData = JSON.parse(localStorage.getItem('favourite'))
    const updatedWishlist = wishlistData.filter(movie => movie.imdbID !== id)
    localStorage.setItem('favourite', JSON.stringify(updatedWishlist))
    wishlistMovie()
}

// Function to wishlist movies
const wishlistMovie = async () => {
    try {
        const wishlistData = JSON.parse(localStorage.getItem('favourite')) || [];

        // Hide loader
        loader.style.display = 'none';

        // Map movie data to HTML
        const movieArr = wishlistData ? wishlistData.map(movie => {
            return `
              <div class="col-md-3 mb-3" id="${movie.imdbID}">
                <div class="movies-card">
                  <img src="${movie.Poster}" class="movie-img" alt="${movie.Title}" />
                  <div class="movie-content">
                    <p class="mb-2">Type: ${movie.Type}</p>
                    <h6 class="mb-2"><a href="details.html?id=${movie.imdbID}">${movie.Title}</a></h6>
                    <button class="btn wishlist" onclick="removeWishlist('${movie.imdbID}')"><i class="fa-solid fa-heart" style="color: #a10312"></i></button>
                  </div>
                </div>
              </div>
            `;
          }) : [];;             
          
        //Update HTML with movie data
        moviesWishList.innerHTML = movieArr.join('') || '<h2>Your wishlist is empty</h2>';
    } catch (err) {
        //console.log(err);
        loader.style.display = 'none';
    }
};

wishlistMovie()

// Function to search for a movie by ID
const searchMovieById = async () => {
    try {
        // Get movie ID from URL parameter
        const urlParams = new URLSearchParams(window.location.search)
        const imdbID = urlParams.get("id")

        // Fetch movie data from API
        if (!imdbID) {
            //console.log("No imdbID parameter found in URL");
            return;
        }

        const response = await fetch(`http://www.omdbapi.com/?apikey=bab3490d&i=${imdbID}`);
        const data = await response.json();

        // Map movie details to HTML
        const detailsArr = `<div class="col-md-5">
                        <div class="detail-img text-center">
                            <img src=${data.Poster} class="w-100" alt=${data.Title}>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="detail-content">
                            <h2>${data.Title}</h2>

                            <p><strong>Rating:</strong> ${data.imdbRating} / 10</p>

                            <ul class="list-unstyled list">
                                <li><strong>Year:</strong> ${data.Year}</li>
                                <li><strong>Rated:</strong> ${data.Rated}</li>
                                <li><strong>Released:</strong> ${data.Released}</li>
                            </ul>

                            <p class="genre"><strong>Genre:</strong> ${data.Genre}</p>
                            <p><strong>Writer:</strong> ${data.Writer}</p>
                            <p><strong>Actors:</strong> ${data.Actors}</p>
                            <p><strong>Plot:</strong> ${data.Plot}</p>

                            <p class="language"><em><strong>Language:</strong> ${data.Language}</em></p>

                            <small class="awards d-flex align-items-center"><i class="fa-solid fa-award"></i> ${data.Awards}</small>
                        </div>
                    </div>`

        // Update HTML with movie details
        movieDetail.innerHTML = detailsArr;
    } catch (err) {
        //console.log(err);
    }
}

// Call searchMovieById with search id on page load
searchMovieById();