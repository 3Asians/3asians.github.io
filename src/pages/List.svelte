<script>
    let pageName="List";
    import { onMount } from "svelte";

    let restaurants = [];
    onMount(async () => {
        const res = await fetch(`https://gist.githubusercontent.com/anhthuvu/310a146b9bfa2697cb71b8402d89c87e/raw/be025a19e9f70587a18c5bc44c00c8cf1506502d/data.json`);
        restaurants = await res.json();
    });
</script>
<main> 
    <header class="header">
        <h1 class="font-bold text-4xl">{pageName}</h1>
    </header> 
    <div class="foods">
        {#each restaurants as restaurant}
        <ul>
            <li><b>{restaurant.RestaurantName}</b></li>
            <li>Category: {restaurant.RestaurantCategory}</li>
            <li>Distance: {restaurant.RestaurantDistance}km</li>
            <li><img src={restaurant.RestaurantImage} alt="imaage" width="500"/></li>
        </ul>
        {:else}
        <p>loading...</p>
        {/each}
    </div>
</main>
