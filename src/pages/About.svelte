<script>
    let appName = "FoodApp";
    let pageName="About";
</script>

<main>
    <header class="header">
        <img class="logo" src="/restaurant.png" alt="logo">
        <h1 class="font-bold text-4xl">{pageName}</h1>
    </header>  
    <article class="w-2/4 mr-auto ml-auto">
        <h2 class="font-bold text-2xl my-2">About us</h2>
        <p class="text-left text-lg">The FoodPoint is a fastfood/restaurants finder where you can find lists of food when you don't know what to eat.</p>
        <br>
        <p class="text-left text-lg">We are students from Technical College and this website is our project for web development class. We've been
            working on this project for a semester. We manage to scrape some restaurant website and put the data in the list, 
            we also added a GoogleMaps and the restaurants from our lists which are pinned in the map. What we didn't manage to add was log in and log out
            and favorite the restaurants, make filter to find restaurants easier and make new website for the menu. 
            We used Svelte to make our website, since Svelte is a recent Javascript framework there wasn't much information to find.
            The result is not perfect but we did try to make the website as best as possible.
        </p>
    </article>
    <aside>
        <h4 class="font-bold text-lg my-4">Our Github Page</h4>
        <a href="https://github.com/3Asians/FoodApp">https://github.com/3Asians/FoodApp</a>

    </aside>
    <footer>
        <p class="text-lg">Copyright &copy; 2020 {appName}. All Rights Reserved. </p>
    </footer>
</main>
