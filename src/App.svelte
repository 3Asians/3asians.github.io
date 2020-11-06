<script>
	import { Router, Route, Link } from "svelte-routing";
	import Home from "./pages/Home.svelte";
	import Signin from "./pages/Signin.svelte";
	import Signout from "./pages/Signout.svelte";
	import Signup from "./pages/Signup.svelte";
	import About from "./pages/About.svelte";
	import Map from "./pages/Map.svelte";
	import List from "./pages/List.svelte";
	import Profile from "./pages/Profile.svelte";
	import Restaurant from "./pages/Restaurant.svelte";
	import Menu from "./pages/Menu.svelte";
	import ForgotPass from "./pages/ForgotPass.svelte";

	export let url = ""; 

</script>

<Router url="{url}">
<div class="links">
	<nav class="dropdown">
	<button class="dropbtn">
      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/> </svg>
    </button>
	<ul class="dropdown-content">
		<li><Link to="/">Home</Link></li>
		<li><Link to="signin">Signin</Link></li>
		<li><Link to="about">About</Link></li>
		<li><Link to="map">Map</Link></li>
		<li><Link to="list">List</Link></li>
		<li><Link to="profile">Profile</Link></li>
		</ul>
	</nav>
	</div>
	<div>
		<Route path="/"><Home /></Route>
		<Route path="signin" component="{Signin}"/>
		<Route path="signout" component="{Signout}"/>
		<Route path="signup" component="{Signup}"/>
		<Route path="about" component="{About}"/>
		<Route path="map" component="{Map}"/>
		<Route path="list" component="{List}"/>
		<Route path="profile" component="{Profile}"/>
		<Route path="restaurant" component="{Restaurant}"/>
		<Route path="menu" component="{Menu}"/>
		<Route path="forgotPass" component="{ForgotPass}"/>
	</div>
</Router>