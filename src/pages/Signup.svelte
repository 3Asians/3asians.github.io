<script>
    let pageName="Sign up";
    import {Link} from "svelte-routing";
</script>
<main>  
    <header class="header">
        <Link back>Back</Link>
        <h1>{pageName}</h1>
    </header> 
    <article>
        <form>
            <label>Email:
                <input name="email" required type="email" placeholder="food@email.com"/>
            </label>
            <label>Username:
                <input name="user" required/>
            </label>
            <label>Password:
                <input required type="password"/>
            </label>
            
            <button type="submit">Sign up</button>
        </form>
    </article>
</main>
