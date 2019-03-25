import { components } from "https://designstem.github.io/fachwerk/fachwerk.js";
Vue.component("FEditor", components.FEditor);

new Vue({
  el: "#app",
  data: {
    size: 500,
    yaml: `title: oppekava
children:
- title: Yldopingud
  children:
  - title: eesti
    value: 6
  - title: inglise
    value: 4.5
  - title: matem
    value: 5
  - title: loodus
    value: 6
  - title: sotsiaal
    value: 7
  - title: kunst
    value: 1.5
- title: Pohiopingud
  children: 
  - title: praktika
    value: 38
  - title: moodulid
    children: 
    - title: alusteadmised
      value: 9
    - title: prog. alused
      value: 10.5
    - title: arendusprotsess
      value: 6
    - title: agiilne
      value: 4.5
    - title: andmebaasid
      value: 7.5
    - title: veebirakendused
      value: 9
    - title: testimine
      value: 6
    - title: programmeerimine
      value: 13.5
    - title: hajusrakendused
      value: 6
    - title: it juhtimine
      value: 4.5
    - title: karjaar/ettevotlus
      value: 6
- title: valikopingud
  value: 28`
  },
  computed: {
    nodes() {
      return this.yaml
        ? d3
            .treemap()
            .tile(d3.treemapBinary)
            .size([this.size * 1.5, this.size])
            .padding(2)
            .paddingTop(30)
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
      return this.nodes.length ? d3.interpolateRdYlBu((i / this.nodes.length / 4) + 0.25) : ''
    }
  },
  template: `
  <div style="display: flex;">
  <div style="width: 450px;">
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
        alignment-baseline="text-before-edge"
        style="font-size: 10px;"
        v-html="n.data.title"
      />
      <text
        :x="n.x1 - 5"
        :y="n.y0 + 5"
        alignment-baseline="text-before-edge"
        text-anchor="end"
        style="font-size: 10px;"
        opacity="0.3"
        v-html="n.value"
      />
    </g>
  </svg>
  </div>
</div>
  `
});
