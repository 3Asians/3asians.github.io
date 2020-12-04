<script>
    let pageName="Sign out";
    import {Link} from "svelte-routing";
</script>
<main>  
    <header class="header">
        <h1 class="font-bold text-4xl">{pageName}</h1>
    </header> 
    <article>
        <button class="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-3 border border-black rounded shadow items" onclick="signOut">Sign out</button>
    </article>
</main>
