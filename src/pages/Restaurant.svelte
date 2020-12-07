<script>
    let pageName="Restaurant";
    import { onMount } from "svelte";
    
    export let params; 
    let restaurants = [];
    let restaurant = [];

    onMount(async () => {
        const res = await fetch('https://raw.githubusercontent.com/3Asians/FoodApp/master/menu.json');
        restaurants = await res.json();
    });

    for (let i = 0; i < restaurants.length; i++) {
        if (params.id == restaurants[i].ID) {
            restaurant.push(restaurants[i]);
        }
    }

</script>

<main> 
    <header class="header">
        <h1 class="font-bold text-4xl">{pageName}</h1>
    </header> 
    <div class="foods">
        {#if restaurant.Menu == null}
            <h3>nothing here :/</h3>
        {:else if restaurant.Menu == String}
            <meta http-equiv="refresh" content="2; URL={restaurant.Menu}" />
            <p>redirecting to <a href={restaurant.Menu}>{restaurant.Menu}</a></p>
        {:else}
            <ul>
            {#each restaurant.Menu as i}
                <li>
                    <h2>{i.name}</h2>
                    <p>{i.food}</p>
                    <h3>{i.price}</h3>
                    <img src={i.img} alt="img" width="500"/>
                </li>
            {/each}
            </ul>
        {/if}
        
    </div>
</main>
