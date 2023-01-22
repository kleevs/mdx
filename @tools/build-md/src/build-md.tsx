import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkPrism from 'remark-prism'
import remarkDirective from 'remark-directive'
import remarkAdmonition from '@plugins/admonition'
import remarkReplacer from '@plugins/replacer'
import remarkMdx from 'remark-mdx'

export async function buildMd(filecontent: string) {
    const processedContent = await unified()
        .use(remarkMdx)
        .use(remarkParse)
        .use(remarkReplacer)
        .use(remarkDirective)
        .use(remarkAdmonition)
        .use(remarkPrism)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(filecontent)

    return processedContent.toString();
}