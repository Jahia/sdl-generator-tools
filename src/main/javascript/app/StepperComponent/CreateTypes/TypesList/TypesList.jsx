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
import {Add, Edit} from '@material-ui/icons';
import {compose} from 'react-apollo';
import C from '../../../App.constants';
import {
    sdlSelectType,
    sdlUpdateAddModifyTypeDialog
} from '../../StepperComponent.redux-actions';
import connect from 'react-redux/es/connect/connect';

const styles = () => ({
    paper: {
        width: '100%',
        minHeight: '60%',
        maxHeight: '60%',
        padding: '6px 0px'
    }
});

const TypeItem = withStyles(styles)(({classes, name, uuid, isSelected, selectType, updateTypeDialogMode}) => {
    console.log('Render', name);
    return (
        <ListItem selected={isSelected}
                  onClick={() => selectType(uuid)}
        >
            <ListItemText primary={name}/>
            <ListItemSecondaryAction classes={classes}>
                <IconButton aria-label="Edit"
                            onClick={() => {
                                selectType(uuid);
                                updateTypeDialogMode({open: true, mode: C.DIALOG_MODE_EDIT});
                            }}
                >
                    <Edit/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
});

const TypesList = ({classes, t, nodeTypes, selection, selectType, updateTypeDialogMode}) => {
    return (
        <Paper className={classes.paper}>
            <List subheader={
                <ListSubheader>{t('label.sdlGeneratorTools.createTypes.nodeTypeText')}</ListSubheader>
                    }
            >
                <ListItem>
                    <Button onClick={() => {
                                updateTypeDialogMode({open: true, mode: C.DIALOG_MODE_ADD});
                            }}
                    >
                        {t('label.sdlGeneratorTools.createTypes.addNewTypeButton')}
                        <Add/>
                    </Button>
                </ListItem>
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
                                    />
                                );
                            })
                        }
            </List>
        </Paper>
    );
};

TypesList.propTypes = {
    nodeTypes: PropTypes.object.isRequired,
    selectType: PropTypes.func.isRequired,
    selection: PropTypes.string
};

TypesList.defaultProps = {
    selection: ''
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
