<script>
    let appName = "FoodApp";
    import { onMount } from "svelte";

</script>

<main>
    <header class="text-center">
        <h1 class="font-bold text-4xl">{appName}</h1>
    </header>
    <article class="text-center">
    <p>Click the button to find lists of food</p>
        <input type="button" value="Find food" onclick="window.open('list')"class="bg-white m-4 py-20 px-8 hover:bg-gray-200 text-red-600 font-semibold border-4 border-red-500 shadow items shadow-2xl">
    </article>
    <footer class="text-center py-8 px-8">
        <p class="copy">&copy; {appName} 2020 </p>
    </footer>
</main>
