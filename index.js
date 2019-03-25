import { components } from "https://designstem.github.io/fachwerk/fachwerk.js";
Vue.component("FEditor", components.FEditor);

new Vue({
  el: "#app",
  data: {
    size: 500,
    yaml: `title: oppekava
children:
- title: Yldopingud
  value: 30
- title: Pohiopingud
  value: 122
  children: 
  - title: loimitud
    value: 30
  - title: praktika
    value: 38
- title: valikopingud
  value: 28`
  },
  computed: {
    nodes() {
      return this.yaml
        ? d3
            .treemap()
            .size([this.size * 1.5, this.size])
            .padding(20)(d3.hierarchy(this.parsedYaml).sum(d => d.value))
            .descendants()
        : [];
    },
    parsedYaml() {
      return jsyaml.safeLoad(this.yaml);
    }
  },
  methods: {
    color(i) {
      return this.nodes.length ? d3.interpolateRdYlBu((i / this.nodes.length / 4) + 0.25) : ''
    }
  },
  template: `
  <div style="display: flex;">
  <div style="width: 250px;">
    <f-editor v-model="yaml" style="height: 100vh" />
  </div>
  <div>
  <svg :width="size * 1.5" height="size">
    <g v-for="(n,i) in nodes">
      <rect
        :x="n.x0"
        :y="n.y0"
        :width="n.x1 - n.x0"
        :height="n.y1 - n.y0"
        fill="none"
        :fill="n.depth > 0 ? color(i) : 'none'"
        :rx="5 / n.depth + 1"
        :ry="5 / n.depth + 1"
      />
      <text
        :x="n.x0 + 5"
        :y="n.y0 + 5"
        v-html="n.data.title"
        alignment-baseline="text-before-edge"
        style="font-size: 10px;"
      />
    </g>
  </svg>
  </div>
</div>
  `
});
