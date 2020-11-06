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
        <Link back>&#8592;Back</Link>
        <h1 class="py-3 font-bold text-5xl" >{pageName}</h1>
    </header> 
    <article>
        <form on:submit|preventDefault={handleSubmit}>
            <label>Username:
            <input class="my-2 p-1" name="user" required bind:value={user} />
        
            <label>Password:
            <input class="my-2 p-1" name="password" required type="password" bind:value={password} /><br>

            <button class="bg-gray-200 my-3 hover:bg-gray-300 text-gray-800 py-2 px-2 border border-gray-400 shadow" type="submit">Sign in</button>

            <p class="my-3"><Link to="forgotPass">Forgot password?</Link></p>
            <p class="my-3"><Link to="signup">Don't have account?</Link></p>
        </form>
    </article>
</main>
