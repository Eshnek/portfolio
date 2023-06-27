<template>
    <div class="bio">
        <div class="bio-top">
            Hello, I'm Dylan! I am a professional software engineer with experience all over the board.
        </div>

        <div class="bio-bottom">
            Below you can find some of my more recent projects.
        </div>

        <div class="bio-bottom">
            Cards with colored corners can be clicked on to open their corresponding links.
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bio {
    width: 100%;
    max-width: 512px;

    text-align: center;
    white-space: normal;

    div {
        margin-bottom: 24px;
    }
    .bio-top {
        font-size: 24px;
    }
    .bio-bottom {
        font-size: 18px;
    }
}
</style>
