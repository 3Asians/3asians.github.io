<script>
    let pageName="List";
    import { onMount } from "svelte";

    import {fade,slide} from "svelte/transition";
	
	let show = false;
	let showMore = false;
	
	function toggle() {
		show? showMore = false : show = true
	}

    let restaurants = [];

    onMount(async () => {
        const res = await fetch(`https://gist.githubusercontent.com/anhthuvu/1004ac7072533201b49592b24a446466/raw/ccbb6574bf8460128053f2cad38864481b21e452/menu.json`);
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
            <li>Price: {restaurant.Price}</li>
            <li><a href={restaurant.Site}>{restaurant.Site}</a></li>
            <li>Menu: </li>
            {#if show}
            <div class="set" transition:slide on:introend={()=> showMore = true}>
                {#if showMore}
                    <div transition:fade on:outroend={()=> show = false} >
                        {#each restaurant.Menu as foods}
                        <ul class="lists">
                            <li>{foods.name}</li>
                            <li>{foods.food}</li>
                            <li>{foods.price}</li>
                            <li><img src={foods.img} alt="img" width="100"/></li>
                        </ul>
                        {:else}
                        <div class="loader"></div>
                        {/each}
                    </div>
                {/if}
            </div>
            {/if}
            <button on:click={toggle}>
                {show? '' : 'Show'}
            </button>
        </ul>
        {:else}
        <div class="loader"></div>
        {/each}
    </div>
</main>
