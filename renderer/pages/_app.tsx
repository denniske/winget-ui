import React from 'react';
import type {AppProps} from 'next/app';

import '../styles/globals.css';
import {Provider} from "react-redux";
import {useStore} from "../state/store";

function SafeHydrate({ children }) {
    return (
        <div suppressHydrationWarning>
            {typeof window === 'undefined' ? null : children}
        </div>
    )
}


function MyApp({Component, pageProps}: AppProps) {
    const store = useStore(pageProps.initialReduxState)
    return (
        <Provider store={store}>
            <React.Fragment>
                <SafeHydrate><Component {...pageProps} /></SafeHydrate>
            </React.Fragment>
        </Provider>
    )
}

export default MyApp
