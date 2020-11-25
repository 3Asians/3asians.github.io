<script>
	export let item;
	export let distance;
</script>

<style>
	span{
		background-color: #ddd;
		border-radius: 4px;
		padding: 0 1em;
		font-size: .5em;
	}
</style>

<h1>
	<span>{distance}</span> {item.RestaurantName}
</h1>