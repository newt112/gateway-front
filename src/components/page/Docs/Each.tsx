import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setPageInfo } from '#/stores/page';
import ReactMarkdown from 'react-markdown';

import { Grid, Card } from '@mui/material';

const DocsEach = () => {
    const { doc_id } = useParams<{ doc_id: string; }>() || "top";
    const [md, setMd] = useState<string>("");
    useEffect(() => {
        fetch(require(`./markdown/${doc_id}.md`))
            .then(response => {
                return response.text()
            })
            .then(text => {
                setMd(text);
            })
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageInfo({ title: "ドキュメント" }));
    }, []);

    const linkBlock = ({ ...props }) => {
        const { href, children } = props;
        if (href.match('http')) {
            return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            );
        } else if (href.slice(0, 1) == '#') {
            // ページ内リンク
            return <a href={href}>{children}</a>;
        } else {
            return <Link to={href}>{children}</Link>;
        };
    };

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2 }}>
                    <ReactMarkdown children={md} components={{ a: linkBlock }} />
                </Card>
            </Grid>
        </Grid>
    )
}

export default DocsEach;