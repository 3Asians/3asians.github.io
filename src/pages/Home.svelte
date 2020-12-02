<script>
    let appName = "FoodApp";
    import { onMount } from "svelte";
    import {Link} from "svelte-routing";
</script>

<main>
    <header class="text-center">
        <h1 class="font-bold text-4xl">{appName}</h1>
    </header>
    <article class="text-center">
    <p>Click the button to find lists of food</p>
    <Link to="list"><button class="bg-white m-4 py-20 px-16 hover:bg-gray-200 text-red-600 font-semibold border-4 border-red-500 shadow items shadow-2xl" type="submit">
    Find Food</button></Link>
    </article>
    <footer class="text-center py-8 px-8">
        <p class="copy">&copy; {appName} 2020 </p>
    </footer>
</main>
