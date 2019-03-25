import { components } from "https://designstem.github.io/fachwerk/fachwerk.js";
Vue.component("FEditor", components.FEditor);

import yaml from './yaml.js'

new Vue({
  el: "#app",
  data: {
    height: 600,
    width: 1400,
    yaml
  },
  computed: {
    nodes() {
      return this.yaml
        ? d3
            .treemap()
            .tile(d3.treemapSquarify.ratio(3))
            .size([this.width, this.height])
            .padding(3)
            .paddingTop(20)
            (d3.hierarchy(this.parsedYaml).sum(d => d.value))
            .descendants()
        : [];
    },
    parsedYaml() {
      return jsyaml.safeLoad(this.yaml);
    }
  },
  methods: {
    color(i) {
      return this.nodes.length ? d3.interpolateRdYlBu((i / this.nodes.length / 3) + 0.25) : ''
    },
    yearColor(i) {
      return d3.interpolateViridis(1 - ((i / 3) + 0.25))
    }
  },
  template: `
  <div style="display: flex; height: 100vh;" :style="{width: width + 'px'}">
  <div style="width: 400px;" v-if="false">
    <f-editor v-model="yaml" style="height: 100vh" />
  </div>
  <div>
  <svg :width="width" height="height">
    <g
      v-for="(n,i) in nodes"
      :opacity="n.data.title == 'inglise' ? 0.25 : 1"
    >
      <rect
        :x="n.x0"
        :y="n.y0"
        :width="n.x1 - n.x0"
        :height="n.y1 - n.y0"
        fill="none"
        :fill="n.depth > 0 ? color(i) : 'none'"
        :rx="5 / n.depth + 1"
        :ry="5 / n.depth + 1"
        stroke="rgba(0,0,0,0.1)"
      />
      <circle 
        v-if="n.data.year"
        v-for="(y,i) in n.data.year"
        :cx="n.x0 + 7 + (5 * i)"
        :cy="n.y0 + 9"
        r="2"
        :fill="yearColor(y - 1)"
      />
      <text
        :x="n.x0 + (n.data.year ? (n.data.year.length * 5) + 7 : 5)"
        :y="n.y0 + 3"
        alignment-baseline="text-before-edge"
        style="font-size: 9px;"
        v-html="n.data.title"
        opacity="0.8"
      />
      <text
        :x="n.x1 - 5"
        :y="n.y0 + 3"
        alignment-baseline="text-before-edge"
        text-anchor="end"
        style="font-size: 9px;"
        opacity="0.3"
        v-html="n.value"
      />
    </g>
  </svg>
  </div>
</div>
  `
});
