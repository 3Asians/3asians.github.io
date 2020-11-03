<script>
    let pageName="Sign up";
    import {Link} from "svelte-routing";
</script>
<main>  
    <header class="header">
        <Link back>Back</Link>
        <h1 class="font-bold text-5xl">{pageName}</h1>
    </header> 
    <article class="my-3">
        <form>
            <label>Email:
                <input class="my-2 p-1 text-left " name="email" required type="email" placeholder="food@email.com"/>
            </label>
            <label>Username:
                <input class="my-2 p-1" name="user" required/>
            </label>
            <label>Password:
                <input class="my-2 p-1" required type="password"/>
            </label>
            
            <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-2 border border-gray-400 shadow" type="submit">Sign up</button>
        </form>
    </article>
</main>
