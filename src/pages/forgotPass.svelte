<script>
    let pageName="Forgot password";
    import {Link} from "svelte-routing";
</script>
<main>  
    <header class="header">
        <Link back>Back</Link>
        <h1>{pageName}</h1>
    </header> 
    <article>
        <form>
            <label>Enter your email
                <input name="email" required type="email" placeholder="food@email.com"/>
            </label>
            <button type="submit">Enter</button>
            <p>You will get an email with your username and password</p>
        </form>
        <Link to="signin">Back to sign in</Link>
    </article>
</main>
