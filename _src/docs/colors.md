---
title: 'Colour'
label: 'Color'
---

## Colour Palettes

<div class="flex flex-wrap">
{% for palette, values in colors %}
  <div class="bg-{{ palette }} flex items-center justify-center mb-2 mr-3 rounded-full" style="width: 150px; height: 150px;">
    <span class="bg-white p-0-25 rounded">{{ palette }}</span>
  </div>
{% endfor %}
</div>
