import { Fragment } from 'react';

function safeHref(href) {
    const value = href.trim();
    return /^(https?:\/\/|\/[^/])/i.test(value) ? value : null;
}

function inline(text, keyPrefix) {
    const tokens = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    const output = [];
    let lastIndex = 0;

    for (const match of text.matchAll(tokens)) {
        const index = match.index ?? 0;
        if (index > lastIndex) output.push(text.slice(lastIndex, index));
        const token = match[0];
        const key = `${keyPrefix}-${index}`;

        if (token.startsWith('**')) output.push(<strong key={key}>{token.slice(2, -2)}</strong>);
        else if (token.startsWith('*')) output.push(<em key={key}>{token.slice(1, -1)}</em>);
        else if (token.startsWith('`')) output.push(<code className="rounded bg-slate-500/10 px-1.5 py-0.5 text-[0.92em]" key={key}>{token.slice(1, -1)}</code>);
        else {
            const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            const href = link ? safeHref(link[2]) : null;
            output.push(href ? <a className="text-emerald-500 underline underline-offset-4" href={href} key={key} rel="noreferrer" target={href.startsWith('http') ? '_blank' : undefined}>{link[1]}</a> : token);
        }

        lastIndex = index + token.length;
    }

    if (lastIndex < text.length) output.push(text.slice(lastIndex));
    return output.map((part, index) => <Fragment key={`${keyPrefix}-part-${index}`}>{part}</Fragment>);
}

export default function ContentBody({ content = '', className = '' }) {
    const lines = content.replace(/\r\n?/g, '\n').split('\n');
    const blocks = [];
    let paragraph = [];
    let list = [];
    let listType = null;

    const flushParagraph = () => {
        if (paragraph.length) blocks.push(<p key={`p-${blocks.length}`}>{inline(paragraph.join(' '), `p-${blocks.length}`)}</p>);
        paragraph = [];
    };
    const flushList = () => {
        if (!list.length) return;
        const List = listType === 'ordered' ? 'ol' : 'ul';
        blocks.push(<List className={`pl-6 ${listType === 'ordered' ? 'list-decimal' : 'list-disc'}`} key={`list-${blocks.length}`}>{list.map((item, index) => <li key={index}>{inline(item, `li-${blocks.length}-${index}`)}</li>)}</List>);
        list = [];
        listType = null;
    };

    lines.forEach((line) => {
        const trimmed = line.trim();
        const unordered = trimmed.match(/^[-*]\s+(.+)$/);
        const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
        if (!trimmed) { flushParagraph(); flushList(); return; }
        if (unordered || ordered) {
            flushParagraph();
            const nextType = unordered ? 'unordered' : 'ordered';
            if (listType && listType !== nextType) flushList();
            listType = nextType;
            list.push((unordered || ordered)[1]);
            return;
        }
        flushList();
        const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
        if (heading) {
            flushParagraph();
            const Tag = `h${heading[1].length + 1}`;
            blocks.push(<Tag className="font-bold" key={`h-${blocks.length}`}>{inline(heading[2], `h-${blocks.length}`)}</Tag>);
        } else if (trimmed.startsWith('> ')) {
            flushParagraph();
            blocks.push(<blockquote className="border-l-2 border-emerald-500 pl-4 italic" key={`q-${blocks.length}`}>{inline(trimmed.slice(2), `q-${blocks.length}`)}</blockquote>);
        } else paragraph.push(trimmed);
    });
    flushParagraph();
    flushList();

    return <div className={`content-body space-y-4 ${className}`}>{blocks}</div>;
}
