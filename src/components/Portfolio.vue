<template>
    <div class="home">
        <Bio />

        <div class="card-holder">
            <Card
                title="Teek"
                description="Game in development. Uses a proprietary engine written with C++20. The game utilizes the ECS design pattern."
                link="https://teek.info" :blank="true"
            />

            <Card
                title="DayForm.io"
                description="Daily accountability form service delivered by text message. Responses are encrypted client-side using a derived key. Frontend written using VueJS."
                link="https://dayform.io" :blank="true"
            />

            <Card
                title="Gem Linux"
                description="Arch Linux® Based ISO Distribution"
                link="https://github.com/CitadelStronghold/gem"
            />
        </div>
        <h1>Visual Studio Code Extensions</h1>
        <div class="card-holder">
            <Card
                title="Power Commit"
                description="A Visual Studio Code Extension for performing quick Git commits"
                link="https://github.com/CitadelStronghold/power-commit"
            />
            <Card
                title="Smart Backspace"
                description="A Visual Studio Code Extension for deleting empty and whitespace lines when backspace is pressed"
                link="https://github.com/CitadelStronghold/smart-backspace"
            />
        </div>
        <h1>C++</h1>
        <div class="card-holder">
            <Card
                title="Match"
                description="High Performance Log Validator"
                link="https://github.com/CitadelStronghold/match"
            />

            <Card
                title="C++ Starter"
                description="Starter C++23 Project with CMake and Ninja"
                link="https://github.com/Eshnek/starter"
            />
            <Card
                title="TypeList"
                description="C++ Type Manipulation Header"
                link="https://github.com/Eshnek/typelist"
            />
            <Card
                title="Format"
                description="My official clang-format configuration"
                link="https://github.com/Eshnek/format"
            />

            <Card
                title="Case"
                description="An in-house testing engine that sandboxes tests into subprocesses. This technique allows any number of tests to run in parallel, without static variables interfering with each other."
            />
        </div>
    </div>
</template>

<script lang="ts">
import Card from "@/components/Card.vue";
import Bio from "@/components/Bio.vue";

export default {
    components: { Card, Bio },
};
</script>

<style lang="scss" scoped>
.home {
    display: flex;
    flex-direction: column;
    align-items: center;

    .bio {
        margin-top: var(--padding-page);
        margin-bottom: var(--padding-page);
    }
    h1 {
        margin: 8px;
        font-size: 24px;
    }
}
</style>
