<script>
    let pageName="Sign out";
    import {Link} from "svelte-routing";
</script>
<main>  
    <header class="header">
        <Link back>Back</Link>
        <h1>{pageName}</h1>
    </header> 
    <article>
        <button onclick="signOut">Sign out</button>
    </article>
</main>
