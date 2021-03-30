import ReactDOM from 'react-dom';
import {StrictMode} from "react";
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/source-sans-pro' //For codemirror in MarkdownEditor.js
import './fonts/starcraft/starcraft.css' //Stylized font for menu
import {MuiThemeProvider} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import {LoadServiceWorker} from "./LoadServiceWorker";
import {ErrorBoundary} from "./ErrorBoundary";
import 'overlayscrollbars/css/OverlayScrollbars.css'
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";
import {OverlayScrollbarOptions, theme} from "./globals/theme";
import {RandomBackground} from "./shared/randomBackground";
import {LoginCheck} from "./LoginCheck";

/*Largest index of background images, inclusive*/
const numImages = 26;

/*Decide whether to run mock service worker for debugging*/
const USE_MOCK_SERVICE_WORKER = false;
if (process.env.NODE_ENV === 'development' && USE_MOCK_SERVICE_WORKER) {
    const {worker} = require('./test/mocks/browser')
    worker.start()
}

ReactDOM.render(
    <StrictMode>
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <RandomBackground numImages={numImages}/>
            <ErrorBoundary>
                <LoadServiceWorker/>
                <OverlayScrollbarsComponent
                    options={OverlayScrollbarOptions}>
                    <LoginCheck/>
                </OverlayScrollbarsComponent>
            </ErrorBoundary>
        </MuiThemeProvider>
    </StrictMode>
    , document.getElementById('root'));



