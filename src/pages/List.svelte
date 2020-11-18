<script>
    let pageName="List";
    import { onMount } from "svelte";

    let events = [];
    onMount(async () => {
        const res = await fetch(`https://gist.githubusercontent.com/anhthuvu/02012661b6fee976842f035be56a3ded/raw/5da4fb30af059d268715fbf9681901f131420328/data.json`);
        events = await res.json();
    });

</script>

<main>  
    <header class="header">
        <h1 class="font-bold text-4xl">{pageName}</h1>
    </header> 
    <div>
        {#each events as event}
        <ul>
            <li><b>{event.name}</b></li>
            <li>{event.date}</li>
            <li>{event.location}</li>
            <li><img src={event.imageSource} alt="imaage" width="500"/></li>
        </ul>
        {:else}
        <p>loading...</p>
        {/each}
    </div>
</main>
