<template>
    <div class="contact">
        <div class="card-holder">
            <Card blank small
                title="Email"
                link="mailto:dylan@eshnek.dev"
            >dylan@eshnek.dev</Card>
        </div>
        <div class="card-holder">
            <Card blank
                title="Github"
                link="https://github.com/Eshnek"
                background="#333"
                foreground="#fff"
            >Eshnek</Card>

            <Card blank
                title="Discord"
                link="https://discordapp.com/users/Eshnek"
                background="#7289da"
                foreground="#fff"
            >@Eshnek</Card>
        </div>
    </div>
</template>

<script lang="ts">
import Card from '@/components/Card.vue';

export default {
    components: { Card }
}
</script>

<style lang="scss" scoped>
.contact {
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: var(--gap);

    padding: var(--padding-page)
}
</style>
