import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {withStyles, Stepper, Step, StepLabel} from '@material-ui/core';
import {Typography, Button} from '@jahia/ds-mui-theme';
import CreateTypes from './CreateTypes';
import ExportResult from './ExportResult';
import {downloadFile, copyToClipBoard} from './StepperComponent.document-utils';
import DefineFinder from './DefineFinders/index';
import {compose} from 'react-apollo';
import SDLParser from '../../parsing/sdlParser';
import {connect} from 'react-redux';
import C from '../../App.constants';
import {getFromLocalStore, storeLocally} from '../../App.utils';
import {sdlInitNodeTypes} from '../../App.redux-actions';
import {sdlSelectType} from './StepperComponent.redux-actions';
import * as _ from 'lodash';

/* eslint-disable */
const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 4
    },
    steppers: {
        marginBottom: theme.spacing.unit * 3
    },
    bottomBar: {
        margin: (theme.spacing.unit * 4) + ' 0 ' + (theme.spacing.unit * 2),
        textAlign: 'right',
        '& button': {
            marginLeft: '5px'
        }
    },
    clearButton: {
        float: 'left'
    }
});
/* eslint-disable */

const stepsTitles = t => ([
    t('label.sdlGeneratorTools.steps.createTypes'),
    t('label.sdlGeneratorTools.steps.defineFinder'),
    t('label.sdlGeneratorTools.steps.exportResult')
]);

const getStepsComponents = currentStep => {
    switch (currentStep) {
        case 1:
            return <DefineFinder/>;
        case 2:
            return <ExportResult/>;
        case 0:
        default:
            return <CreateTypes/>;
    }
};

class StepperComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeStep: 0,
            skipped: new Set(),
            steps: stepsTitles(props.t)
        };
        this.hasNext = this.hasNext.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        // Load from local storage if there is one
        const savedStore = getFromLocalStore(C.LOCAL_STORAGE);
        if (savedStore !== null) {
            this.props.setStore(savedStore);
        }
    }

    hasNext() {
        const nodeTypes = this.props.nodeTypes;

        if (_.isNil(nodeTypes) || _.isEmpty(nodeTypes)) {
            return false;
        }

        return _.isNil(Object.values(nodeTypes).find(type => _.isEmpty(type.fieldDefinitions)));
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
            <Fragment>
                <div className={classes.root}>
                    <Stepper className={classes.steppers} activeStep={activeStep}>
                        {steps.map(label => {
                            const props = {};
                            const labelProps = {};
                            return (
                                <Step key={label} {...props}>
                                    <StepLabel {...labelProps}>
                                        <Typography color="alpha" variant="zeta">{label}</Typography>
                                    </StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {getStepsComponents(activeStep)}
                    <div className={classes.bottomBar}>
                        {
                            activeStep === 0 &&
                            <Button
                                variant="ghost"
                                size="normal"
                                className={classes.button}
                                onClick={() => {
                                    storeLocally(C.LOCAL_STORAGE, {});
                                    this.props.setStore({});
                                }}
                            >
                                    {t('label.sdlGeneratorTools.clearButton')}
                            </Button>
                        }
                        {
                            activeStep !== 0 &&
                            <Button variant="secondary" className={classes.button} onClick={this.handleBack}>
                                {t('label.sdlGeneratorTools.backButton')}
                            </Button>
                        }
                        {
                            activeStep === lastStep &&
                            <Button
                                disabled={!this.hasNext()}
                                variant="secondary"
                                size="normal"
                                className={classes.button}
                                onClick={this.handleCopy}
                            >
                                    {t('label.sdlGeneratorTools.copyToClipboardButton')}
                            </Button>
                        }
                        <Button
                            disabled={!this.hasNext()}
                            variant="primary"
                            size="normal"
                            className={classes.button}
                            onClick={activeStep === lastStep ? this.handleDownload : this.handleNext}
                        >
                            {activeStep === lastStep ? t('label.sdlGeneratorTools.downloadFileButton') : t('label.sdlGeneratorTools.nextButton')}
                        </Button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

StepperComponent.propTypes = {
    t: PropTypes.func.isRequired,
    setStore: PropTypes.func.isRequired,
    nodeTypes: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    currentStep: PropTypes.number
};

const mapStateToProps = state => {
    return {
        nodeTypes: state.nodeTypes
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setStore: store => {
            dispatch(sdlInitNodeTypes(store));
            const keys = Object.keys(store);
            dispatch(sdlSelectType(keys.length > 0 ? keys[0] : ''));
        }
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(styles),
    translate()
)(StepperComponent);
