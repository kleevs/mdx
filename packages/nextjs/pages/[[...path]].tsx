import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import { buildMd } from '@tools/build-md'
import { useCallback } from 'react'

const postsDirectory = path.join(process.cwd(), '.doc')

export default function Home({ contentHtml, menu }: {
  contentHtml: string;
  menu: any;
}) {
    const toggleSidebar = useCallback((event) => {
        event.preventDefault();
        document.body.classList.toggle('sb-sidenav-toggled');
    }, [])

    return <div className="d-flex" id="wrapper">
        <div className="border-end bg-white" id="sidebar-wrapper">
            <div className="sidebar-heading border-bottom bg-light">Docu</div>
            <div className="list-group list-group-flush">
                {Object.keys(menu).map((key, i) => <a key={i} className="list-group-item list-group-item-action list-group-item-light p-3" href={menu[key].href}>{menu[key].id}</a>)}
            </div>
        </div>
        <div id="page-content-wrapper">
            <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                <div className="container-fluid">
                    <button className="btn btn-primary" id="sidebarToggle" onClick={toggleSidebar}>Toggle Menu</button>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container-fluid">
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>
        </div>
    </div>
}

export async function getServerSideProps( { params } ) {
    try {
        const directories = reduce(readDirectory([''], postsDirectory));
        console.log(directories);
        const id = `${params.path.join("/")}`;
        const fullPath = path.join(postsDirectory, `${id}.md`)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)
        const contentHtml = await buildMd(matterResult.content);

        return {
            props: { contentHtml: contentHtml, menu: directories }
        }
    } catch (e) {
        console.error(e)
        return {
            notFound: true
        }
    }
}

function readDirectory(paths: string[], directoryPath: string) {
    const list = fs.readdirSync(directoryPath);
    const result: any = {};
    list.forEach((file) => {
        const filePath = path.join(directoryPath, file);

        if (fs.lstatSync(filePath).isDirectory()) {
            result[file] = readDirectory([...paths, file], filePath);
        } else if (file.endsWith('.md')) {
            const id = file.replaceAll(/\.md$/gi, '');
            result[id] = [...paths, id].join('/');
        }
    });

    return result;
}

function reduce(menu: any) {
    var result = [];
    Object.keys(menu).forEach(key => {
        if (typeof menu[key] === 'string') {
            result.push({ id: key, href: menu[key] });
        } else {
            reduce(menu[key]).forEach(item => result.push(item));
        }
    })

    return result;
}