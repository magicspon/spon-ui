---
title: 'Typography'
label: 'Typography'
---

## Modular Scale

Module scale utils. text-{ value }

<style>
  :target {
    display: block !important;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
</style>

<table>
  <thead>
    <th>key</th>
    <th>rems</th>
    <th>px</th>
    <th>preview</th>
  </thead>
{% for item in ms %}
  <tr>
    <td>{{ item.key }}</td>
    <td>{% if item.key == 'auto' %}n/a{% else %}{% if item.px == '0px' %}0{% else %}{{ item.rem }}{% endif %}{% endif %}</td>
    <td>{% if item.key == 'auto' %}auto{% else %}{{ item.px }}{% endif %}</td>
    <td>
      <a href="#{{ item.key }}">preview</a>
      <div id="{{ item.key }}" class="fixed hidden p-2 border z-10 bg-white text-black text-{{ item.key }}">
        <a href="#0" style="font-size: 10px;" class="absolute pin-t pin-r pt-0-5 pr-0-5">close</a>
        abcdefg HIJKLMNO
      </div>
    </td>
  </tr>
{% endfor %}
</table>

## Fluid Type

Fluid sizes. text-{ value }-fluid

<table>
  <thead>
    <th>key</th>
    <th>min</th>
    <th>max</th>
    <th>preview</th>
  </thead>
{% for item in fluid %}
  <tr>
    <td>{{ item.key }}</td>
    <td>{{ item.min.rem }} || {{ item.min.px }}</td>
    <td>{{ item.max.rem }} || {{ item.max.px }}</td>
    <td>
      <a href="#{{ item.key }}-fluid">preview</a>
      <div id="{{ item.key }}-fluid" class="fixed hidden p-2 border z-10 bg-white text-black text-{{ item.key }}-fluid">
        <a href="#0" style="font-size: 10px;" class="absolute pin-t pin-r pt-0-5 pr-0-5">close</a>
        abcdefg HIJKLMNO
      </div>
    </td>
  </tr>
{% endfor %}
</table>
