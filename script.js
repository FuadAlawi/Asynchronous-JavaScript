const ACCESS_KEY = '5POUGOFMp53dDoSf1IrJC0rTkIdfQWvqa3IzSb_vLUE';
const API_URL = 'https://api.unsplash.com/search/photos';

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchWithAsyncAwait();
    }
}

function clearResults() {
    resultsContainer.innerHTML = '';
}

function showLoading() {
    clearResults();
    resultsContainer.innerHTML = '<div class="loading">Loading photos...</div>';
}

function showError(message) {
    clearResults();
    resultsContainer.innerHTML = `<div class="error">Error: ${message}</div>`;
}

function displayPhotos(photos) {
    clearResults();
    
    if (photos.length === 0) {
        resultsContainer.innerHTML = '<div class="loading">No photos found. Try another search term.</div>';
        return;
    }

    photos.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        
        const img = document.createElement('img');
        img.src = photo.urls.small;
        img.alt = photo.alt_description || photo.description || 'Unsplash photo';
        
        const info = document.createElement('div');
        info.className = 'photo-info';
        
        const title = document.createElement('h3');
        title.textContent = photo.user.name || 'Unknown Photographer';
        
        const desc = document.createElement('p');
        desc.textContent = photo.description || photo.alt_description || 'No description';
        
        info.appendChild(title);
        info.appendChild(desc);
        card.appendChild(img);
        card.appendChild(info);
        resultsContainer.appendChild(card);
    });
}

function searchWithXHR() {
    const query = searchInput.value.trim();
    if (!query) {
        alert('Please enter a search term');
        return;
    }

    showLoading();

    const xhr = new XMLHttpRequest();
    const url = `${API_URL}?query=${encodeURIComponent(query)}&per_page=20`;
    
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Authorization', `Client-ID ${ACCESS_KEY}`);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                displayPhotos(response.results);
            } catch (error) {
                showError('Failed to parse response data');
            }
        } else {
            showError(`HTTP Error: ${xhr.status} - ${xhr.statusText}`);
        }
    };
    
    xhr.onerror = function() {
        showError('Network error occurred');
    };
    
    xhr.send();
}

function searchWithFetch() {
    const query = searchInput.value.trim();
    if (!query) {
        alert('Please enter a search term');
        return;
    }

    showLoading();

    const url = `${API_URL}?query=${encodeURIComponent(query)}&per_page=20`;
    
    fetch(url, {
        headers: {
            'Authorization': `Client-ID ${ACCESS_KEY}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displayPhotos(data.results);
    })
    .catch(error => {
        showError(error.message);
    });
}

async function searchWithAsyncAwait() {
    const query = searchInput.value.trim();
    if (!query) {
        alert('Please enter a search term');
        return;
    }

    showLoading();

    const url = `${API_URL}?query=${encodeURIComponent(query)}&per_page=20`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Client-ID ${ACCESS_KEY}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        displayPhotos(data.results);
    } catch (error) {
        showError(error.message);
    }
}