<script>
    let pageName="Map";
    import {Link} from "svelte-routing";

</script>

<main>  
    <header class="header">
        <img class="logo" src="/restaurant.png" alt="logo">
        <h1 class="font-bold text-4xl">{pageName}</h1>
    </header> 
    <div class="px-5">
    <iframe title="map" src="https://www.google.com/maps/d/embed?mid=1HzY2j4x2sQGoC9SBT-J5kvjp0wZ57a0L"></iframe></div>
    <footer>
        <p class="text-lg">Copyright &copy; 2020 FoodApp. All Rights Reserved. </p>
    </footer>
</main>