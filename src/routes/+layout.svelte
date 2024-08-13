<script>
	import '../bootstrap.css'
	import '../app.css';
	
	import Navbar from '$lib/components/nav/Navbar.svelte';
	import Footer from '$lib/components/nav/Footer.svelte';
</script>

<Navbar />
<slot />
<Footer />