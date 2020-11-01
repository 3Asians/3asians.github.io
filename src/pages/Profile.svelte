<script>
    let pageName="Profile";
    import {Link} from "svelte-routing";
</script>

<main>  
    <header class="header">
        <Link back>Back</Link>
        <h1>{pageName}</h1>
    </header> 
    <article>
        <h2>Username</h2>
        <h2>Info</h2>
        <blockquote></blockquote>
        <h2>Favorite places</h2>
    </article>
</main>
