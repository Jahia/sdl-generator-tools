import React from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import {
    withStyles,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    ListItemSecondaryAction,
    IconButton,
    Button
} from '@material-ui/core';
import {Typography} from '@jahia/ds-mui-theme';
import {Add, Edit} from '@material-ui/icons';
import {compose} from 'react-apollo';
import C from '../../../../App.constants';
import {
    sdlSelectType,
    sdlUpdateAddModifyTypeDialog
} from '../../StepperComponent.redux-actions';
import {connect} from 'react-redux';

const styles = theme => ({
    paper: {
        width: '100%',
        height: '100%',
        padding: '6px 0px',
        overflowY: 'auto'
    },
    root: {
        position: 'absolute',
        textAlign: 'right'
    },
    listButton: {
        '& > * *': {
            color: theme.palette.primary.main
        }
    }
});

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
            <ListItem>
                <Button className={classes.listButton}
                        onClick={() => {
                    updateTypeDialogMode({open: true, mode: C.DIALOG_MODE_ADD});
                }}
                >
                    <Typography color="alpha" variant="zeta">
                        {t('label.sdlGeneratorTools.createTypes.addNewTypeButton')}
                    </Typography>
                    <Add/>
                </Button>
            </ListItem> : null;
    };

    return (
        <Paper className={classes.paper}>
            <List subheader={
                <ListSubheader>
                    <Typography color="alpha" variant="omega">
                        {t('label.sdlGeneratorTools.createTypes.nodeTypeText')}
                    </Typography>
                </ListSubheader>
                    }
            >
                {renderCreateListButton()}
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
    t: PropTypes.object.isRequired,
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

const mapStateToProps = state => {
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
    translate()
)(TypesList);
