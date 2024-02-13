async function fetchData() {
    try {
        const response = await fetch('https://enslive.net/api/get_news_content');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function calculateTimeAgo(startTime) {
    const currentTime = new Date();
    const timeDifferenceInMinutes = Math.floor((currentTime - startTime) / (1000 * 60));

    if (timeDifferenceInMinutes < 60) {
        return `${timeDifferenceInMinutes} MIN AGO`;
    } else if (timeDifferenceInMinutes < 120) {
        return "AN HOUR AGO";
    } else if (timeDifferenceInMinutes < 1440) {
        const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
        return `${timeDifferenceInHours} HOUR AGO`;
    } else if (timeDifferenceInMinutes < 2880) {
        return `A DAY AGO`;
    } else {
        const timeDifferenceInDays = Math.floor(timeDifferenceInMinutes / 1440);
        return `${timeDifferenceInDays} DAY's AGO`;
    }
}

function createCarouselItem(item, index, activeClass) {
    const startTime = new Date(item.created_at);
    const timeAgo = calculateTimeAgo(startTime);

    const locationToShow = item.liveLocation !== null ? item.liveLocation : item.district_choice;

    return `
        <div class="carousel-item ${activeClass}">
            <img src="https://enslive.net/public/${item.photos_vid}" class="d-block w-100" alt="Slide ${index + 1}">
            <h4><a href="#">${item.news_title}</a></h4>
            <div class="card-span">
                <span class="bookmark-icon">&#9734;</span>
                <span class="label">
                    <span>${timeAgo}</span>
                    <span class="red">${locationToShow}</span>
                </span>
            </div>
        </div>
    `;
}

function createCardItem(item) {
    const startTime = new Date(item.created_at);
    const timeAgo = calculateTimeAgo(startTime);

    const locationToShow = item.liveLocation !== null ? item.liveLocation : item.district_choice;

    const newsEditionWords = item.edition.split(' ');
    const newsEditionAbbreviation = newsEditionWords.slice(0, 2).join(' ');
    return `
    <hr class="horizontal-line">
    <div class="card-div">
        <div class="cardTitle">
            <p><a href="#" class=""full-title><span>${item.news_title}<span></a></p>
            <div class="card-span">
                <span class="news_edition edition">${newsEditionAbbreviation}</span>
                <span class="red">${locationToShow}</span>
                <span>${timeAgo}</span>
                <span class="bookmark-icon">&#9734;</span>
        </div>
        </div>
        <div class="cardImg">
            <img src="https://enslive.net/public/${item.photos_vid}" class="card-img" alt="Card Image">
        </div>
    </div>
    `;
}

function createLeftCardItem(item) {
    const newsEditionWords = item.edition.split(' ');
    const newsEditionAbbreviation = newsEditionWords.slice(0, 2).join(' ');
    
    return `
    <div class="left_section">
        <div class="left_Card_div cardTitle">
            <span class="hash">&num;</span>
            <p><a href="#"><span>${item.news_title}</span></a></p>
        </div>
        <div class="left_card_label">
            <span class="left_edition edition red">${newsEditionAbbreviation}</span>
            <span title="bookmark" class="left_bookmark bookmark-icon">&#9734;</span>
        </div>
        <hr class="horizontal-line"></hr>
    </div>
    `;
}

async function addCarouselItems() {
    const carouselInner = document.querySelector('#dynamicCarousel .carousel-inner');
    const limit = 5; // Set your desired limit here
    const apiData = await fetchData();

    console.log('API Response:', apiData);

    if (apiData && apiData.data) {
        const newsItems = apiData.data.slice(0, limit); // Limit the items to the specified number

        newsItems.forEach((item, index) => {
            const activeClass = index === 0 ? 'active' : '';
            const carouselItem = createCarouselItem(item, index, activeClass);
            carouselInner.innerHTML += carouselItem;
        });
    } else {
        console.error('API response is not successful');
    }
}

async function addCardItems() {
    const cardSection = document.querySelector('.card-section');
    const limit = 5; // Set your desired limit here
    const apiData = await fetchData();

    console.log('API Response:', apiData);

    if (apiData && apiData.data) {
        const cardItems = apiData.data.slice(limit); // Items for the card section

        cardItems.forEach((item) => {
            const cardItem = createCardItem(item);
            cardSection.innerHTML += cardItem;
        });
    } else {
        console.error('API response is not successful');
    }
}

async function addLeftCardItem() {
    const leftCard = document.querySelector(".left_card_section");
    const apiData = await fetchData();
    console.log('API Response:', apiData);
    if (apiData && apiData.data) {
        const leftApiData = apiData.data;
        leftApiData.forEach((item)=>{
            const leftCardItem = createLeftCardItem(item);
            leftCard.innerHTML += leftCardItem;
        })
    }
}

// Start the carousel and make it slide automatically after 1 second
// $('#dynamicCarousel').carousel({
//     interval: 500,
//     wrap:true
// });

// Call the functions to add carousel and card items
addCarouselItems();
addCardItems();
addLeftCardItem();
