import React from 'react';
import {withStyles, Stepper, Step, StepLabel, Button, Typography} from '@material-ui/core';
import ExportResult from './exportResult/ExportResult';

const styles = () => ({
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
            return 'Place Create types component here';
        case 1:
            return 'Place Define finer component here';
        case 2:
            return <ExportResult/>;
        default:
            return 'Unknown step';
    }
}

class ToolsSteps extends React.Component {
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
        const {activeStep} = this.state;

        //TODO copy to clipboard
    }

    handleDownload() {
        const {activeStep} = this.state;

        //TODO dowonload file
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
                    <div>
                        {getStepContent(activeStep)}
                        <div className={classes.bottomBar}>
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
            </div>
        );
    }
}

export default withStyles(styles)(ToolsSteps);
