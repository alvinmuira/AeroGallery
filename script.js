// Javascript code
document.addEventListener('DOMContentLoaded', () => {
// Accessing the category filter checkboxes
const rockets = document.querySelector('#category-filter input[type="checkbox"][value="rockets"]');
const drones = document.querySelector('#category-filter input[type="checkbox"][value="drones"]');
const planes = document.querySelector('#category-filter input[type="checkbox"][value="planes"]');
let itemHolder = '';   //Holds the the object name to be accessed in the server
// Adding event listeners to the checkboxes
rockets.addEventListener('change', (e) => {
    itemHolder = 'rockets';
    checkboxHandler(e, itemHolder);
});
drones.addEventListener('change', (e) => {
    itemHolder = 'drones';
    checkboxHandler(e, itemHolder);
});
planes.addEventListener('change', (e) => {
    itemHolder = `planes`
    checkboxHandler(e, itemHolder)
});
// Function to handle checkbox changes
function checkboxHandler(e, itemHolder) {
    if (e.target.checked) {
        display(itemHolder);
    } else {
        clearDisplay(itemHolder)
    }
}
// Function to clear the display of vehicles based on the category
function clearDisplay(itemHolder) {
    const container = document.querySelector('#display_container');
    const cardsToRemove = container.querySelectorAll(`.vehicle_card[data-category="${itemHolder}"]`);
    cardsToRemove.forEach(card => card.remove());
}
// Function to fetch and display vehicles based on the selected category
function display(itemHolder) {
    fetch(`http://localhost:3000/${itemHolder}`)  // Fetching data from the server
        .then(response => response.json())
        .then(rocket => {
            // Looping through the fetched data and creating vehicle cards
            rocket.forEach(item => {
                const container = document.querySelector('#display_container'); // Selecting the display container
                const card = document.createElement('div');  // Creating a new div for each vehicle card
                card.className = 'vehicle_card';
                card.dataset.category = itemHolder;
                // Setting the inner HTML of the card with vehicle details
                card.innerHTML = `
                    <div class="vehicle_image">
                    <!-- Vehicle Image --><img src="${item.img_url1}" >
                </div>
                <div class="title_bar">
                    <div class="title">
                        <h3><!-- Vehicle Name -->${item.title}</h3>
                    </div>
                    <div class="button_holder">
                        <button class="favorite_button">Add to Fav</button>
                    </div>
                </div>
                <div>
                    <div class="short_description">
                        <p><!-- Vehicle Short Description -->${item.short_description}</p>
                    </div>
                    <div class="button_holder_details">
                        <button class="view_details_button">View Details</button>
                    </div>
                    <div class="long_description" style="display: none;">
                        <p><!-- Vehicle Long Description -->${item.detailed_description}</p>
                    </div>
                </div>
                `;
                container.appendChild(card);   // Appending the card to the display container            
                const image = card.querySelector('img');  // Selecting the image element within the card
                // Adding event listeners for mouseover and mouseout to change the image source
                // Mouseover
                image.addEventListener('mouseover', () => {
                    setTimeout(() => {
                        image.src = item.img_url2;
                    }, 300);
                });
                // Mouseout
                image.addEventListener('mouseout', () => {
                    setTimeout(() => {
                        image.src = item.img_url1;
                    }, 1000);
                });
                const viewDetailsButton = card.querySelector('.view_details_button');  // Selecting the view details button
                // Adding event listener to toggle the display of detailed description
                viewDetailsButton.addEventListener('click', () => {                   
                    const detailedDescription = card.querySelector('.long_description');  // Selecting the detailed description element   
                    if (detailedDescription.style.display === 'none') {
                        detailedDescription.style.display = 'block';
                        viewDetailsButton.textContent = 'Hide Details';
                    } else {
                        detailedDescription.style.display = 'none';
                        viewDetailsButton.textContent = 'View Details';
                    }
                });
                const favoriteButton = card.querySelector('.favorite_button');  // Selecting the favorite button
                let favoriteId = undefined;  // Variable to hold the favorite ID
                // Fetching favorites to check if the item is already favorited
                favoriteButton.addEventListener('click', () => {
                    // Data to be sent to the server when adding/removing from favorites
                    const requiredData = {
                        title: item.title,
                        img_url1: item.img_url1,
                        img_url2: item.img_url2,
                        short_description: item.short_description,
                        detailed_description: item.detailed_description
                    }
                    // If the button text is 'Add to Fav', send a POST request to add to favorites
                    if (favoriteButton.textContent === 'Add to Fav') {
                        fetch(`http://localhost:3000/favorites`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(requiredData)
                        })
                        .then(response => response.json())
                        .then(data => {
                            favoriteId = data.id;
                            favoriteButton.textContent = 'Remove from Fav';
                        });
                    } else {      // If the button text is 'Remove from Fav', send a DELETE request to remove from favorites                 
                        fetch(`http://localhost:3000/favorites/${favoriteId}`, {
                            method: 'DELETE'
                        })
                        .then(() => {
                            favoriteButton.textContent = 'Add to Fav';
                        })
                    }
                });
            });
        })
}
const form = document.querySelector('#rating-form');  // Selecting the rating form
// Displaying the rating form when the page loads
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const rating = document.querySelector('#experience-rating').value;
    fetch(`http://localhost:3000/rating`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rate: rating })
        }
    )
    .then(response => response.json())
    .then(()=> {
        const ratingMessage = document.querySelector('#thank-you-message');
        ratingMessage.style.display = 'block';
        form.style.display = 'none';
    })     
    });
});