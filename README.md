# celerix-spectrum
Framework-agnostic primitives for color and layout. Build your own UI on a solid foundation of OKLCH dynamics and systematic spacing

## Usage (vue example)
To interact with the theming engine
```typescript
import { createSpectrum } from "celerix-spectrum/vue";

//After const app = createApp(..)
// prefix is optional, defaults to 'cx'
app.use(createSpectrum({prefix: 'your-prefix'}))
```
then in a component or view, you can use it like this:

```vue

<script setup lang="ts">
  import { useSpectrum } from "celerix-spectrum/vue";
  const spectrum = useSpectrum();
</script>
<template>
  <div>light hue = {{ spectrum.state.light.hue }}</div>
  <div>light chroma = {{ spectrum.state.light.chroma }}</div>
</template>
```

Stay tuned more to follow...