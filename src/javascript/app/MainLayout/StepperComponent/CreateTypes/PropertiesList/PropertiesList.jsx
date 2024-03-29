import React from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {List, ListItem, ListItemText, ListSubheader, withStyles} from '@material-ui/core';
import {Button, Paper, Typography} from '@jahia/design-system-kit';
import {Add} from '@material-ui/icons';
import {compose} from '../../../../compose';
import C from '../../../../App.constants';
import {lookUpMappingStringArgumentInfo} from '../../StepperComponent.utils';
import {sdlSelectProperty, sdlUpdateAddModifyPropertyDialog} from '../../StepperComponent.redux-actions';
import {connect} from 'react-redux';

const styles = theme => ({
    paper: {
        width: '100%',
        height: '100%',
        padding: 0,
        overflowY: 'auto',
        boxShadow: 'none',
        border: '1px solid ' + theme.palette.ui.omega
    },
    listButton: {
        '& > * *': {
            color: theme.palette.brand.alpha
        }
    },
    subHeader: {
        textDecoration: 'none',
        padding: (theme.spacing.unit * 3),
        background: theme.palette.ui.epsilon,
        borderBottom: '1px solid ' + theme.palette.ui.omega
    }
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

PropertyItem.propTypes = {
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    jcrName: PropTypes.string.isRequired,
    selectProperty: PropTypes.func.isRequired,
    showAddPropertyDialog: PropTypes.func.isRequired
};

const PropertiesList = ({classes, t, selectedType, selectProperty, addModifyPropertyDialog}) => {
    return (
        <Paper className={classes.paper}>
            <List subheader={
                <ListSubheader className={classes.subHeader}>
                    <Typography color="alpha" variant="zeta">
                        {t('label.sdlGeneratorTools.createTypes.propertiesText')}
                        <Button
                            icon={<Add/>}
                            variant="ghost"
                            className={classes.listButton}
                            onClick={() => {
                                addModifyPropertyDialog({isOpen: true, channel: undefined, mode: C.DIALOG_MODE_ADD});
                            }}
                        >
                            {t('label.sdlGeneratorTools.createTypes.addNewPropertyButton')}
                        </Button>
                    </Typography>
                </ListSubheader>
            }
            >
                {
                    selectedType && selectedType.fieldDefinitions.map((field, i) => (
                        <PropertyItem key={field.name}
                                      index={i}
                                      name={field.name}
                                      type={field.type}
                                      jcrName={lookUpMappingStringArgumentInfo(field, 'property')}
                                      selectProperty={selectProperty}
                                      showAddPropertyDialog={() => addModifyPropertyDialog({
                                          isOpen: true,
                                          mode: C.DIALOG_MODE_EDIT
                                      })}
                        />
                    ))

                }
            </List>
        </Paper>
    );
};

PropertiesList.propTypes = {
    classes: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    selectedType: PropTypes.object,
    selectProperty: PropTypes.func.isRequired,
    addModifyPropertyDialog: PropTypes.func.isRequired
};

const mapStateToProps = ({sdlGeneratorTools: state}) => {
    return {
        selectedType: state.nodeTypes[state.selection]
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addModifyPropertyDialog: infos => dispatch(sdlUpdateAddModifyPropertyDialog(infos)),
        selectProperty: (index, name, jcrName, type) => dispatch(sdlSelectProperty(index, name, jcrName, type))
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(styles),
    withTranslation('sdl-generator-tools')
)(PropertiesList);
