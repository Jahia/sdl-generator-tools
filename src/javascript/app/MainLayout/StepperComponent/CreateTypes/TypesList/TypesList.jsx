import React from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, withStyles} from '@material-ui/core';
import {Button, Paper, Typography} from '@jahia/design-system-kit';
import {Add, Edit} from '@material-ui/icons';
import {compose} from '../../../../compose';
import C from '../../../../App.constants';
import {sdlSelectType, sdlUpdateAddModifyTypeDialog} from '../../StepperComponent.redux-actions';
import {connect} from 'react-redux';

/* eslint-disable */
const styles = theme => ({
    paper: {
        width: '100%',
        height: '100%',
        padding: 0,
        overflowY: 'auto',
        boxShadow: 'none',
        border: '1px solid ' + theme.palette.ui.omega
    },
    root: {
        position: 'absolute',
        textAlign: 'right'
    },
    listButton: {
        '& > * *': {
            color: theme.palette.primary.main
        }
    },
    subHeader: {
        textDecoration: 'none',
        padding: (theme.spacing.unit * 3),
        background: theme.palette.ui.epsilon,
        borderBottom: '1px solid ' + theme.palette.ui.omega,
        borderRight: '1px solid ' + theme.palette.ui.omega,
        '& > p': {
            lineHeight: 2.54
        }
    }
});
/* eslint-disable */

const TypeItem = withStyles(styles)(({classes, name, uuid, mode, isSelected, selectType, updateTypeDialogMode}) => {
    const renderEditButton = () => {
        return mode === C.TYPE_LIST_MODE_CREATE ?
            <ListItemSecondaryAction classes={classes}>
                <IconButton aria-label="Edit"
                            onClick={() => {
                                selectType(uuid);
                                updateTypeDialogMode({open: true, mode: C.DIALOG_MODE_EDIT});
                            }}
                >
                    <Edit/>
                </IconButton>
            </ListItemSecondaryAction> : null;
    };

    return (
        <ListItem selected={isSelected}
                  onClick={() => selectType(uuid)}
        >
            <ListItemText primary={name}/>
            {renderEditButton()}
        </ListItem>
    );
});

const TypesList = ({classes, t, nodeTypes, selection, selectType, updateTypeDialogMode, mode}) => {
    const renderCreateListButton = () => {
        return mode === C.TYPE_LIST_MODE_CREATE ?
            <Button
                variant="ghost"
                icon={<Add/>}
                className={classes.listButton}
                onClick={() => {
                    updateTypeDialogMode({open: true, mode: C.DIALOG_MODE_ADD});
                }}
            >
                {t('label.sdlGeneratorTools.createTypes.addNewTypeButton')}
            </Button> : null;
    };

    return (
        <Paper className={classes.paper}>
            <List subheader={
                <ListSubheader className={classes.subHeader}>
                    <Typography color="alpha" variant="zeta">
                        {t('label.sdlGeneratorTools.createTypes.nodeTypeText')}
                        {renderCreateListButton()}
                    </Typography>
                </ListSubheader>
            }
            >
                {
                    Object.getOwnPropertyNames(nodeTypes).map(uuid => {
                        const type = nodeTypes[uuid];
                        return (
                            <TypeItem key={type.name}
                                      {...type}
                                      uuid={uuid}
                                      isSelected={uuid === selection}
                                      selectType={selectType}
                                      updateTypeDialogMode={updateTypeDialogMode}
                                      mode={mode}
                            />
                        );
                    })
                }
            </List>
        </Paper>
    );
};

TypesList.propTypes = {
    classes: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    nodeTypes: PropTypes.object.isRequired,
    selectType: PropTypes.func.isRequired,
    updateTypeDialogMode: PropTypes.func.isRequired,
    mode: PropTypes.string,
    selection: PropTypes.string
};

TypesList.defaultProps = {
    selection: '',
    mode: C.TYPE_LIST_MODE_CREATE
};

const mapStateToProps = ({sdlGeneratorTools: state}) => {
    return {
        nodeTypes: state.nodeTypes,
        selection: state.selection
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateTypeDialogMode: infos => dispatch(sdlUpdateAddModifyTypeDialog(infos)),
        selectType: typeName => dispatch(sdlSelectType(typeName))
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(styles),
    withTranslation('sdl-generator-tools')
)(TypesList);
