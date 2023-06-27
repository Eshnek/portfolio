<template>
  <div>
    <Card
        title="Discord"
        description="@Eshnek"
    />

    <Card
        title="Email"
        description="dylanpozarnsky@gmail.com"
    />

    <Card
        title="LinkedIn"
        description="https://www.linkedin.com/in/dylan-pozarnsky/"
    />

    <Card
        title="Github"
        description="https://github.com/CitadelStronghold/teek"
    />

    <span>
      Use the social media color
      as background, to help the user easily identify them. Include as much info
      as possible to build credibility
    </span>
  </div>
</template>

<script lang="ts">
import Card from '@/components/Card.vue';

export default {
    components: { Card }
}
</script>
