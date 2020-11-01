<script>
    let appName = "FoodApp";
    let pageName="About";
    import {Link} from "svelte-routing";
</script>

<main>
    <header class="header">
        <Link back>Back</Link>
        <h1>{pageName}</h1>
    </header>  
    <article>
        <h2>Our story</h2>
        <h2>About web</h2>
    </article>
    <aside>
        <h4>Phone</h4>
        <h4>Email</h4>
        <h4>Github</h4>
    </aside>
    <footer class="footer">
        <p class="copy">&copy; {appName} 2020 </p>
    </footer>
</main>
