<script>
    let pageName="Forgot password";
    import {Link} from "svelte-routing";
</script>
<main>  
    <header class="header">
        <Link back>Back</Link>
        <h1 class="font-bold text-4xl my-2">{pageName}</h1>
    </header> 
    <article>
        <form>
            <label>Enter your email
                <input class="my-2 p-1" name="email" required type="email" placeholder="food@email.com"/>
            </label>
            <button class= "bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-2 border border-gray-400 shadow" type="submit">Enter</button>
            <p class="my-2">You will get an email with your username and password</p>
        </form>
        <Link to="signin">Back to sign in</Link>
    </article>
</main>
