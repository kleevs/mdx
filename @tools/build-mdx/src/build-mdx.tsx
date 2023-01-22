import remarkPrism from 'remark-prism'
import remarkDirective from 'remark-directive'
import remarkAdmonition from '@plugins/admonition'
import remarkReplacer from '@plugins/replacer'
import {compile} from '@mdx-js/mdx'

export async function buildMdx(filecontent: string) {
    const processedContent = await compile(filecontent, {
        remarkPlugins: [remarkReplacer, remarkDirective, remarkAdmonition, remarkPrism]
    })

    return processedContent.toString();
}