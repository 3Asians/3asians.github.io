<script>
    let appName = "FoodApp";
    import { onMount } from "svelte";
    import {Link} from "svelte-routing";
</script>

<main>
    <header class="text-center">
        <img class="logo" src="/restaurant.png" alt="logo">
        <h1 class="font-bold text-4xl">{appName}</h1>
    </header>
    <article class="text-center">
    <p class="m-10">Click the button to find lists of food</p>
    <Link to="list"><button class=" text-xl bg-white m-3 py-20 px-16 hover:bg-gray-200 text-blue-600 font-semibold border-4 border-blue-500 shadow items shadow-md" type="submit">
    Find Food</button></Link>
    </article>
    <footer>
        <p class="text-lg">Copyright &copy; 2020 {appName}. All Rights Reserved. </p>
    </footer>
</main>
