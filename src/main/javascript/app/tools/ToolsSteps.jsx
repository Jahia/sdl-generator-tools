import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Stepper, Step, StepLabel, Button, Typography} from '@material-ui/core';

const styles = theme => ({
    root: {
        position: "absolute",
        width: "780px",
        left: "32px",
        top: "84px"
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
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
            return 'Place Export result component here';
        default:
            return 'Unknown step';
    }
}

class ToolsSteps extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            activeStep: 0,
            skipped: new Set(),
        }
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleSkip = this.handleSkip.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleNext() {
        const { activeStep } = this.state;
        let { skipped } = this.state;
        this.setState({
            activeStep: activeStep + 1,
            skipped,
        });
    }

    handleBack() {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    }

    handleSkip() {
        const { activeStep } = this.state;

        this.setState(state => {
            const skipped = new Set(state.skipped.values());
            skipped.add(activeStep);
            return {
                activeStep: state.activeStep + 1,
                skipped,
            };
        });
    }

    handleReset() {
        this.setState({
            activeStep: 0,
        });
    }

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;

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
                    {activeStep === steps.length ? (
                        <div>
                            <Typography className={classes.instructions}>
                                All steps completed - you&quot;re finished
                            </Typography>
                            <Button onClick={this.handleReset} className={classes.button}>
                                Reset
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                            <div>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={this.handleBack}
                                    className={classes.button}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleNext}
                                    className={classes.button}
                                >
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

ToolsSteps.propTypes = {
    classes: PropTypes.object,
    children: PropTypes.object
};

export default withStyles(styles)(ToolsSteps);