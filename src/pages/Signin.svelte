<script>
    let pageName="Sign in";
    import {Link} from "svelte-routing";
    let user = "";
    let password = "";
    let isSuccess = false;
    const handleSubmit = () => {
    };
</script>
<main>  
    <header class="header">
        <Link back>Back</Link>
        <h1>{pageName}</h1>
    </header> 
    <article>
        <form on:submit|preventDefault={handleSubmit}>
            <label>Username:
            <input name="user" required bind:value={user} />
        
            <label>Password:
            <input name="password" required type="password" bind:value={password} />

            <p><button type="submit">Sign in</button></p>

            <p><Link to="forgotPass">Forgot password</Link></p>
            <p><Link to="signup">Don't have account</Link></p>
        </form>
    </article>
</main>
