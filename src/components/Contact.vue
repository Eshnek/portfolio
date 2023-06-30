<template>
    <div class="contact">
        <div class="card-holder">
            <Card blank small
                title="Email"
                description="dylan@eshnek.dev"
                link="mailto:dylan@eshnek.dev"
            />
        </div>
        <div class="card-holder">
            <Card blank
                title="Github"
                description="Eshnek"
                link="https://github.com/Eshnek"
                background="#333"
                foreground="#fff"
            />

            <Card blank
                title="LinkedIn"
                link="https://www.linkedin.com/in/dylan-pozarnsky/"
                background="#0077B5"
                foreground="#fff"
            />

            <Card blank
                title="Discord"
                description="@Eshnek"
                link="https://discordapp.com/users/Eshnek"
                background="#7289da"
                foreground="#fff"
            />
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
