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

## CSS primitives and utilities

| Class                 | CSS                                              |
|-----------------------|--------------------------------------------------|
| `.d-flex`             | `display: flex`                                  |
| `.d-flex-col`         | `display: flex; flex-direction: column;`         |
| `.d-flex-row`         | `display: flex; flex-direction: row;`            |
| `.d-flex-wrap`        | `display: flex; flex-wrap: wrap;`                |                      
| `.d-flex-nowrap`      | `display: flex; flex-wrap: nowrap;`              |              
| `.d-flex-grow-1`      | `display: flex; flex-grow: 1;`                   |                   
| `.d-flex-shrink-0`    | `display: flex; flex-shrink: 0;`                 |                 
| `.d-flex-shrink-1`    | `display: flex; flex-shrink: 1;`                 |                 
| `.d-flex-jc-start`    | `display: flex; justify-content: flex-start;`    |    
| `.d-flex-jc-end`      | `display: flex; justify-content: flex-end;`      |  
| `.d-flex-jc-center`   | `display: flex; justify-content: center;`        |        
| `.d-flex-jc-between`  | `display: flex; justify-content: space-between;` | 
| `.d-flex-ai-start`    | `display: flex; align-items: flex-start;`        |        
| `.d-flex-ai-end`      | `display: flex; align-items: flex-end;`          |          
| `.d-flex-ai-center`   | `display: flex; align-items: center;`            |            
| `.d-flex-ai-baseline` | `display: flex; align-items: baseline;`          |          
| `.d-flex-ai-stretch`  | `display: flex; align-items: stretch;`           |           
| `.d-flex-ac-start`    | `display: flex; align-content: flex-start;`      |      
| `.d-flex-ac-end`      | `display: flex; align-content: flex-end;`        |    
| `.d-flex-ac-center`   | `display: flex; align-content: center;`          |          
| `.d-flex-ac-between`  | `display: flex; align-content: space-between;`   |   
| `.d-flex-ac-around`   | `display: flex; align-content: space-around;`    |    
| `.d-flex-ac-stretch`  | `display: flex; align-content: stretch;`         |         