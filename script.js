document.addEventListener('DOMContentLoaded', () => {});
const rockets = document.querySelector('#category-filter input[type="checkbox"][value="rockets"]');
const drones = document.querySelector('#category-filter input[type="checkbox"][value="drones"]');
const planes = document.querySelector('#category-filter input[type="checkbox"][value="planes"]');
let itemHolder = '';
rockets.addEventListener('change', (e) => {
    itemHolder = 'rockets';
    checkboxHandler(e, itemHolder);
});
drones.addEventListener('change', (e) => {
    itemHolder = 'drones';
    checkboxHandler(e, itemHolder)   
});
planes.addEventListener('change', (e) => {
    itemHolder = `planes`
    checkboxHandler(e, itemHolder)
});
function checkboxHandler(e, itemHolder) {
    if (e.target.checked) {
        display(itemHolder);
    } else {
        clearDisplay(itemHolder)
    }
}
function clearDisplay(itemHolder) {
    const container = document.querySelector('#display_container');
    const cardsToRemove = container.querySelectorAll(`.vehicle_card[data-category="${itemHolder}"]`);
    cardsToRemove.forEach(card => card.remove());
}
function display(itemHolder) {
    fetch(`http://localhost:3000/${itemHolder}`)
        .then(response => response.json())
        .then(rocket => {
            rocket.forEach(item => {
                const container = document.querySelector('#display_container');
                const card = document.createElement('div');
                card.className = 'vehicle_card';
                card.dataset.category = itemHolder;
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
                    <div class="long_description">
                        <p><!-- Vehicle Long Description -->${item.detailed_description}</p>
                    </div>
                </div>
                `;
                container.appendChild(card);
                const image = card.querySelector('img');
                image.addEventListener('mouseover', () => {
                    setTimeout(() => {
                        image.src = item.img_url2;
                    }, 300);
                });
                image.addEventListener('mouseout', () => {
                    setTimeout(() => {
                        image.src = item.img_url1;
                    }, 1000);
                });
            });
        })
}
// vehicleImage.addEventListener('mouseover', (e) => {
//     const vehicleCard = e.target.closest('.vehicle_card');
//     if (vehicleCard) {
//         const img = vehicleCard.querySelector('.vehicle_image img');
//         img.src = img.src.replace('img_url1', 'img_url2');
//     }
// });