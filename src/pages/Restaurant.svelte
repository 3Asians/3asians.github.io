<script>
    let pageName="Restaurant";
    import { onMount } from "svelte";
    
    export let params; 
    let restaurants = [];
    var r
    let restaurant = [];
    onMount(async () => {
        const res = await fetch('https://gist.githubusercontent.com/Gudruna02/cfa46697fd9d5eb012e4605d28dd32f2/raw/534c4ae3dcaa31ce3ce3e4d13e5b9855a66663c1/menu.json');
        restaurants = await res.json();
    });

    for (r = 0; r < restaurants.length; r++) {
        if (restaurants[r].ID == params.id) {
            restaurant.push(restaurants[r]);
        }
    }

</script>

<main> 
    <header class="header">
        <h1 class="font-bold text-4xl">{pageName}</h1>
    </header> 
    <div class="foods">
            <ul>
                <li><b><a href="/restaurant/{restaurant.ID}">{restaurant.Name}</a></b></li>
                <li>Category: {restaurant.Category}</li>
                <li>Distance: {restaurant.Distance}km</li>
                <li>Price: {restaurant.Price}</li>
                <li><a href={restaurant.Site}>{restaurant.Site}</a></li>
                <!--<li><img src={restaurant.Image} alt="img" width="500"/></li>-->
            </ul>
    </div>
</main>
