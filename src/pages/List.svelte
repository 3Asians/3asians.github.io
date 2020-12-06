<script>
    let pageName="List";
    import { onMount } from "svelte";

    let restaurants = [];
    onMount(async () => {
        const res = await fetch('/menu.json');
        restaurants = await res.json();
        restaurants.sort((a, b) => (a.Distance > b.Distance) ? 1 : (a.Distance === b.Distance) ? ((a.ID > b.ID) ? 1 : -1) : -1 );
    });

</script>

<main> 
    <header class="header">
        <h1 class="font-bold text-4xl">{pageName}</h1>
    </header> 
    <div class="foods">
        {#each restaurants as restaurant}
        <ul class="lists">
            <li><b><a href="/restaurant/{restaurant.ID}">{restaurant.Name}</a></b></li>
            <li>Category: {restaurant.Category}</li>
            <li>Distance: {restaurant.Distance}km</li>
            <li><a href={restaurant.Site}>{restaurant.Site}</a></li>
            <li><img src={restaurant.img} alt="img" width="500"/></li>
        </ul>
        {:else}
        <div class="loader"></div>
        
        {/each}
    </div>
</main>
