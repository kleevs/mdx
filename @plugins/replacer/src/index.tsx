/** @type {import('unified').Plugin<[], import('mdast').Root>} */
export default function replacer() {
    const Parser = this.Parser;

    this.Parser = !!Parser ? function () {
        const args = arguments;
        args[0] = args[0]?.replaceAll(/:::(\w+)/gi, ':::info{#$1}\n');
        return Parser.apply(this, arguments);
    } : Parser;
}