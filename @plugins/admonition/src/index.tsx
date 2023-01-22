import {visit} from 'unist-util-visit'
import {h} from 'hastscript'

/** @type {import('unified').Plugin<[], import('mdast').Root>} */
export default function admonition() {
    return (tree) => {
      visit(tree, (node) => {
        if (
          node.type === 'textDirective' ||
          node.type === 'leafDirective' ||
          node.type === 'containerDirective'
        ) {
          const data = node.data || (node.data = {})
          const hast = h(node.name, node.attributes) as any;
  
          data.hName = 'div'
          data.hProperties = hast.properties
          data.hProperties = { class: `theme-admonition alert alert-${hast.properties.id}` }
        }
      })
    }
}