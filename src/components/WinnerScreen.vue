<script setup lang="ts">
import CustomButton from './CustomButton.vue';

defineProps<{
	winner: boolean | null
}>()
</script>

<template>
	<div v-if="winner !== null" class="screen">
		<div style="display: flex; flex-direction: column; gap: 30px; align-items: center;">
			<p>{{ winner ? 'Вы выиграли' : 'Вы проиграли' }}</p>
			<RouterLink to="/menu">
				<CustomButton btn-text="Вернуться в меню"/>
			</RouterLink>
		</div>	
</div>
</template>

<style scoped>
.screen {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 99999;
	color: white;
	background-color: rgba(0, 0, 0, 0.562);
}

p {
	display: block;
	font-size: 24px;
}
</style>