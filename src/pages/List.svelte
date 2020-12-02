<script>
    let pageName="List";
    import { onMount } from "svelte";

    let restaurants = [];
    onMount(async () => {
        const res = await fetch(`https://gist.githubusercontent.com/anhthuvu/27946e76eb3ff4af6132ff54f9e3a3b3/raw/696392a234b93fe07c2b8cfa25f9f370d095c905/data.json`);
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
            <li><b><a href="/restaurant/{restaurant.ID}">{restaurant.Name}</a></b></li>
            <li>Category: {restaurant.Category}</li>
            <li>Distance: {restaurant.Distance}km</li>
            <li><a href={restaurant.Site}>{restaurant.Site}</a></li>
            <!--<li><img src={restaurant.Image} alt="img" width="500"/></li>-->
        </ul>
        {:else}
        <p>loading...</p>
        {/each}
    </div>
</main>
