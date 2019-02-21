import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles, Grid, Paper, List, ListItem, ListItemText, ListSubheader, Button} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import AddModifyFinderDialog from './addModifyFinderDialog';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {upperCaseFirst} from '../../util/helperFunctions';

const styles = theme => ({
    paper: {
        width: 360,
        height: 400
    }
});

const DefineFinders = ({classes, t, addFinder, removeFinder, nodeTypes, selection, selectType}) => {
    const [isDialogOpen, setDialogState] = useState(false);
    const selectedType = nodeTypes.reduce((acc, type, idx) => type.name === selection ? Object.assign({idx: idx}, type) : acc, null);
    const availableFinders = selectedType ? filterAvailableFinders(selectedType) : [];
    return (
        <React.Fragment>
            <Grid container>
                <Grid item>
                    <Paper className={classes.paper}>
                        <List subheader={<ListSubheader>{t('label.sdlGeneratorTools.Type')}</ListSubheader>}>
                            {
                                nodeTypes.map(type => (
                                    <TypeItem key={type.name}
                                              {...type}
                                              isSelected={type.name === selection}
                                              selectType={selectType}/>
                                ))
                            }
                        </List>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>
                        <List subheader={<ListSubheader>{t('label.sdlGeneratorTools.defineFinder.finders')}</ListSubheader>}>
                            <Button disabled={selectedType === null || availableFinders.length === 0}
                                    onClick={() => setDialogState(true)}
                            >
                                {t('label.sdlGeneratorTools.defineFinder.addAFinderCaption')}
                                <Add/>
                            </Button>
                            {
                                nodeTypes.filter(type => type.name === selection).map(type => type.queries.map(finder => {
                                        return (
                                            <FinderItem key={finder.name}
                                                        name={finder.name}/>
                                        );
                                    }
                                ))
                            }
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            <AddModifyFinderDialog open={isDialogOpen}
                                   close={() => setDialogState(false)}
                                   addFinder={addFinder}
                                   selectedType={selectedType}
                                   availableFinders={availableFinders}
                                   selection={selection}/>
        </React.Fragment>
    );

    function filterAvailableFinders(selectedType) {
        let finders = [];
        if (selectedType.queries.reduce((acc, curr) => curr.suffix === 'all' ? false : acc, true)) {
            finders.push('all');
        }
        return selectedType.fieldDefinitions.reduce((acc, curr) => {
            let finder = `by${upperCaseFirst(curr.name)}`;
            let connectionVariant = `${finder}Connection`;
            let connectionVariantExists = false;
            if (selectedType.queries.reduce((found, query) => {
                if (connectionVariant === query.suffix) {
                    connectionVariantExists = true;
                }
                return query.suffix === finder ? false : found;
            }, true)) {
                acc.push(finder);
                if (!connectionVariantExists) {
                    acc.push(connectionVariant);
                }
            }
            return acc;
        }, finders);
    }
};

const TypeItem = ({name, isSelected, selectType}) => (
    <ListItem button
              selected={isSelected}
              onClick={() => selectType(name)}
    >
        <ListItemText primary={name}/>
    </ListItem>
);

const FinderItem = ({name}) => (
    <ListItem button>
        <ListItemText primary={name}/>
    </ListItem>
);

DefineFinders.propTypes = {
    nodeTypes: PropTypes.array.isRequired,
    addFinder: PropTypes.func.isRequired,
    removeFinder: PropTypes.func.isRequired,
    selectType: PropTypes.func.isRequired,
    selection: PropTypes.string
};

export default compose(
    withStyles(styles),
    translate()
)(DefineFinders);
