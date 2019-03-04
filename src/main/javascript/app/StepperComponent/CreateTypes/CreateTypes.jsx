import React, {useState} from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import {
    withStyles,
    Grid,
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
import AddTypeDialog from './AddModifyTypeDialog';
import {compose} from 'react-apollo';
import C from '../../App.constants';
import {lookUpMappingStringArgumentInfo} from '../StepperComponent.utils';

const styles = () => ({
    paper: {
        width: '100%',
        minHeight: '50%',
        padding: '6px 0px'
    },
    root: {
        position: 'absolute',
        textAlign: 'right'
    }
});

const TypeItem = withStyles(styles)(({classes, name, isSelected, selectType, updateTypeDialogMode, showAddTypeDialog}) => {
    console.log('Render', name);
    return (
        <ListItem selected={isSelected}
                  onClick={() => selectType(name)}
        >
            <ListItemText primary={name}/>
            <ListItemSecondaryAction classes={classes}>
                <IconButton aria-label="Edit"
                            onClick={() => {
                            selectType(name);
                            updateTypeDialogMode(C.DIALOG_MODE_EDIT);
                            showAddTypeDialog(true);
                        }}
                >
                    <Edit/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
});

const PropertyItem = ({index, name, type, jcrName, selectProperty, showAddPropertyDialog}) => (
    <ListItem button
              onClick={() => {
                  selectProperty(index, name, jcrName, type);
                  showAddPropertyDialog();
              }}
    >
        <ListItemText primary={name}/>
    </ListItem>
);

const CreateTypes = ({classes, t, nodeTypes, selection, selectedProperty, dispatch, dispatchBatch, removeType, selectType, selectProperty, addModifyPropertyDialog}) => {
    const [addTypeDialogShown, showAddTypeDialog] = useState(false);
    const [typeDialogMode, updateTypeDialogMode] = useState(C.DIALOG_MODE_ADD);

    const selectedType = nodeTypes.reduce((acc, type, idx) => type.name === selection ? Object.assign({idx: idx}, type) : acc, null);

    // Const isDuplicatedPropertyName = propertyName => {
    //     return selectedType && selectedType.fieldDefinitions.find(field => field.name === propertyName) !== undefined;
    // };

    const isDuplicatedTypeName = typeName => {
        return nodeTypes.find(type => type.name === typeName) !== undefined;
    };

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper}>
                        <List subheader={
                            <ListSubheader>{t('label.sdlGeneratorTools.createTypes.nodeTypeText')}</ListSubheader>
                        }
                        >
                            <ListItem>
                                <Button onClick={() => {
                                    updateTypeDialogMode(C.DIALOG_MODE_ADD);
                                    showAddTypeDialog(true);
                                }}
                                >
                                    {t('label.sdlGeneratorTools.createTypes.addNewTypeButton')}
                                    <Add/>
                                </Button>
                            </ListItem>
                            {
                                nodeTypes.map(type => (
                                    <TypeItem key={type.name}
                                              {...type}
                                              isSelected={type.name === selection}
                                              selectType={selectType}
                                              updateTypeDialogMode={updateTypeDialogMode}
                                              showAddTypeDialog={showAddTypeDialog}
                                              removeType={removeType}
                                    />
                                ))
                            }
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper}>
                        <List subheader={
                            <ListSubheader>{t('label.sdlGeneratorTools.createTypes.propertiesText')}</ListSubheader>
                        }
                        >
                            <ListItem>
                                <Button onClick={() => {
                                    if (selectedProperty === null) {
                                        selectProperty(selectType, '', '', '');
                                    }
                                    addModifyPropertyDialog({open: true, mode: C.DIALOG_MODE_ADD});
                                }}
                                >
                                    {t('label.sdlGeneratorTools.createTypes.addNewPropertyButton')}
                                    <Add/>
                                </Button>
                            </ListItem>
                            {
                                nodeTypes
                                    .filter(type => type.name === selection)
                                    .map(type => type.fieldDefinitions
                                        .map((field, i) => {
                                                return (
                                                    <PropertyItem key={field.name}
                                                                  index={i}
                                                                  name={field.name}
                                                                  type={field.type}
                                                                  jcrName={lookUpMappingStringArgumentInfo(field, 'property')}
                                                                  selectProperty={selectProperty}
                                                                  showAddPropertyDialog={() => addModifyPropertyDialog({open: true, mode: C.DIALOG_MODE_EDIT})}
                                                    />
                                                );
                                            }
                                        ))
                            }
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            <AddTypeDialog open={addTypeDialogShown}
                           mode={typeDialogMode}
                           dispatch={dispatch}
                           dispatchBatch={dispatchBatch}
                           closeDialog={() => showAddTypeDialog(false)}
                           selectedType={selectedType}
                           isDuplicatedTypeName={isDuplicatedTypeName}
                           removeType={removeType}/>
        </React.Fragment>
    );
};

CreateTypes.propTypes = {
    nodeTypes: PropTypes.array.isRequired,
    selectType: PropTypes.func.isRequired,
    removeType: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    dispatchBatch: PropTypes.func.isRequired,
    selection: PropTypes.string
};

CreateTypes.defaultProps = {
    selection: ''
};

export default compose(
    withStyles(styles),
    translate()
)(CreateTypes);
