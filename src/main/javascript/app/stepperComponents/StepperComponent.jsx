import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {withStyles, Stepper, Step, StepLabel, Button, Typography} from '@material-ui/core';
import CreateTypes from './createTypes/index';
import {ExportResult} from './exportResult';
import {downloadFile, copyToClipBoard} from '../util/documentUtils';
import DefineFinder from './defineFinders/index';
import {compose} from 'react-apollo';

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
            return <DefineFinder/>;
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
        const {classes, t} = this.props;
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
        );
    }
}

StepperComponent.propTypes = {
    classes: PropTypes.object,
    children: PropTypes.object
};

export default compose(
    withStyles(styles),
    translate()
)(StepperComponent);
