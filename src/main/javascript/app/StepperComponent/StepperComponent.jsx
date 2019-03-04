import React from 'react';
import {translate} from 'react-i18next';
import {withStyles, Stepper, Step, StepLabel, Button} from '@material-ui/core';
import CreateTypes from './CreateTypes';
import ExportResult from './ExportResult';
import {downloadFile, copyToClipBoard} from './StepperComponent.document-utils';
import DefineFinder from './DefineFinders';
import {compose} from 'react-apollo';
import SDLParser from '../parsing/sdlParser';
import AddModifyPropertyDialog from './CreateTypes/AddModifyPropertyDialog';

const styles = () => ({
    root: {
        margin: '10px 16px'
    },
    bottomBar: {
        margin: '21px 6px',
        textAlign: 'right',
        '& button': {
            marginLeft: '5px'
        }
    }
});

class StepperComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeStep: 0,
            skipped: new Set(),
            steps: [
                props.t('label.sdlGeneratorTools.steps.createTypes'),
                props.t('label.sdlGeneratorTools.steps.defineFinder'),
                props.t('label.sdlGeneratorTools.steps.exportResult')
            ]
        };
        this.getStepContent = this.getStepContent.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    getStepContent(step) {
        switch (step) {
            case 1:
                return <DefineFinder/>;
            case 2:
                return <ExportResult/>;
            case 0:
            default:
                return <CreateTypes/>;
        }
    }

    handleNext() {
        const {activeStep} = this.state;
        let {skipped} = this.state;
        this.setState({
            activeStep: activeStep + 1,
            skipped
        });
    }

    handleBack() {
        this.setState(state => ({
            activeStep: state.activeStep - 1
        }));
    }

    handleCopy() {
        const sdlTypes = SDLParser.parse(this.props.nodeTypes);
        copyToClipBoard(sdlTypes);
    }

    handleDownload() {
        const sdlTypes = SDLParser.parse(this.props.nodeTypes);
        downloadFile(sdlTypes, 'graphql-extension.sdl');
    }

    handleReset() {
        this.setState({
            activeStep: 0
        });
    }

    render() {
        const {classes, t} = this.props;
        const {activeStep, steps} = this.state;
        const lastStep = steps.length - 1;

        return (
            <React.Fragment>
                <div className={classes.root}>
                    <Stepper activeStep={activeStep}>
                        {steps.map(label => {
                            const props = {};
                            const labelProps = {};
                            return (
                                <Step key={label} {...props}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <div>
                        {this.getStepContent(activeStep)}
                        <div className={classes.bottomBar}>
                            {activeStep !== 0 ? (
                                <Button color="primary" className={classes.button} onClick={this.handleBack}>
                                    {t('label.sdlGeneratorTools.backButton')}
                                </Button>
                            ) : (
                                null
                            )}
                            {activeStep === lastStep ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={this.handleCopy}
                                >
                                    {t('label.sdlGeneratorTools.copyToClipboardButton')}
                                </Button>
                            ) : (
                                null
                            )}
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={activeStep === lastStep ? this.handleDownload : this.handleNext}
                            >
                                {activeStep === lastStep ? t('label.sdlGeneratorTools.downloadFileButton') : t('label.sdlGeneratorTools.nextButton')}
                            </Button>
                        </div>
                    </div>
                </div>
                <AddModifyPropertyDialog/>
            </React.Fragment>
        );
    }
}

export default compose(
    withStyles(styles),
    translate()
)(StepperComponent);
