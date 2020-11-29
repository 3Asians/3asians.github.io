<script>
    let pageName="Sign in";
    import {Link} from "svelte-routing";
    import GithubLogin from "svelte-github-login";
</script>
<main>  
    <header class="header">
        <h1 class="font-bold text-4xl" >{pageName}</h1>
    </header> 
    <GithubLogin
        clientId="XXX"
        scope="user:email"
        redirectUri="http://localhost:5000/"
        on:success={params => console.log(params)}
        on:error={error => console.log(error)}
        let:onLogin
    >
        <button on:click={onLogin}>Github Login</button>
  </GithubLogin>
</main>
