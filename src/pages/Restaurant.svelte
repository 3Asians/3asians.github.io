<script>
    let pageName="Restaurant";
    import { onMount } from "svelte";
    
    export let params; 
    let restaurants = [];
    var r;
    let restaurant = [];
    onMount(async () => {
        const res = await fetch(`https://gist.githubusercontent.com/anhthuvu/27946e76eb3ff4af6132ff54f9e3a3b3/raw/696392a234b93fe07c2b8cfa25f9f370d095c905/data.json`);
        restaurants = await res.json();
    });

    for (r = 0; r < restaurants.length; r++) {
        if (restaurants[r].ID == params.id) {
            restaurant = restaurants[r];
        }
    }

</script>

<main> 
    <header class="header">
        <h1 class="font-bold text-4xl">{pageName}</h1>
    </header> 
    <div class="foods">
        {#each restaurant.Menu as foods}
        <ul class="lists">
            <li>{foods.name}</li>
            <li>{foods.food}</li>
            <li>{foods.price}</li>
            <li><img src={foods.img} alt="img" width="500"/></li>
        </ul>
        {:else}
        <div class="loader"></div>
        {/each}
    </div>
</main>
