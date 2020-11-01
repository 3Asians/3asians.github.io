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
	<nav>
		<Link to="/">Home</Link>
		<Link to="signin">Signin</Link>
		<Link to="about">About</Link>
		<Link to="map">Map</Link>
		<Link to="list">List</Link>
		<Link to="profile">Profile</Link>
	</nav>
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