<template>
	<button @click="$emit('connect')">
		<p>Connect to Metamask</p>
	</button>
</template>

<script>

export default {
  name: 'Metamask'
}



</script>