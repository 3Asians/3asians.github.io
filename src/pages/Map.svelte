<script>
    let pageName="Map";
    import {Link} from "svelte-routing";

    // Initialize and add the map
    function initMap() {
    // The location of Uluru
    const uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: uluru,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: uluru,
        map: map,
    });
    }
</script>

<main>  
    <header class="header">
        <h1 class="font-bold text-5xl">{pageName}</h1>
    </header> 
    <div id="map"></div>
</main>
