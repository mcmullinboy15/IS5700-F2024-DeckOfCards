import Header from "./Header";
import Container from '@mui/material/Container';

import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {

    return (
        <>
        <Header className="top-0" />
        <Container>
            {children}
        </Container>
        </>
    )
}