import React from 'react';
import PropTypes from 'prop-types';
import {withStyles, Stepper, Step, StepLabel, Button, Typography} from '@material-ui/core';
import CreateTypes from './createTypes/index';
import ExportResult from "./exportResult/ExportResult";
import {copyToClipBoard, downloadFile} from "../util/documentUtils";

const styles = theme => ({
    root: {
        position: 'absolute',
        width: '780px',
        left: '32px',
        top: '84px'
    },
    bottomBar: {
        margin: '21px 6px',
        textAlign: 'right',
        '& button': {
            marginLeft: '5px'
        }
    }
});

function getSteps() {
    return ['Create types', 'Define finder', 'Export result'];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return <CreateTypes/>;
        case 1:
            return 'Place Define finer component here';
        case 2:
            return <ExportResult/>;
        default:
            return 'Unknown step';
    }
}

class StepperComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeStep: 0,
            skipped: new Set()
        };
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.handleReset = this.handleReset.bind(this);
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
        const sdlContent = 'dummy sdl';
        copyToClipBoard(sdlContent);
    }

    handleDownload() {
        const sdlContent = 'dummy sdl';
        downloadFile(sdlContent, 'graphql-extension.sdl');
    }

    handleReset() {
        this.setState({
            activeStep: 0
        });
    }

    render() {
        const {classes} = this.props;
        const steps = getSteps();
        const lastStep = steps.length - 1;
        const {activeStep} = this.state;

        return (
            <div className={classes.root}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
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
                    {getStepContent(activeStep)}
                    <div className={classes.bottomBar}>
                        {activeStep !== 0 ? (
                            <Button color="primary" className={classes.button} onClick={this.handleBack}>
                                Back
                            </Button>
                        ) : (
                            null
                        )}
                        {activeStep === lastStep ? (
                            <React.Fragment>
                                <Button className={classes.button} onClick={this.handleReset}>
                                    Create an other SDL
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={this.handleCopy}
                                >
                                    Copy to clipboard
                                </Button>
                            </React.Fragment>
                        ) : (
                            null
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={activeStep === lastStep ? this.handleDownload : this.handleNext}
                        >
                            {activeStep === lastStep ? 'Download as a file' : 'Next'}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

StepperComponent.propTypes = {
    classes: PropTypes.object,
    children: PropTypes.object
};

export default withStyles(styles)(StepperComponent);
