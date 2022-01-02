import React from 'react';
import { Container, Box, Toolbar } from '@mui/material';

import Drawer from '#/components/ui/pc/Drawer';
import TopBar from '#/components/ui/TopBar';
import Body from '#/components/page/Body';

const PC = () => {
    return (
        <>
            <TopBar />
            <Box sx={{ display: 'flex' }}>
                <Drawer />
                <Container sx={{ display: 'flex', flexWrap: 'wrap', m: 0 }}>
                    <Toolbar sx={{ p: 1 }} />
                    <Body />
                </Container>
            </Box>
        </>
    )
}

export default PC